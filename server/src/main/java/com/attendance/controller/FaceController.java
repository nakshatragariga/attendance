package com.attendance.controller;

import com.attendance.model.User;
import com.attendance.service.AttendanceService;
import com.attendance.service.UserService;
import com.attendance.service.FaceRecognitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/face")
public class FaceController {

    private final AttendanceService attendanceService;
    private final UserService userService;
    private final FaceRecognitionService faceRecognitionService;
    private static final String FACE_DATA_DIR = System.getProperty("user.dir") + File.separator + "face-data";

    public FaceController(AttendanceService attendanceService, UserService userService, FaceRecognitionService faceRecognitionService) {
        this.attendanceService = attendanceService;
        this.userService = userService;
        this.faceRecognitionService = faceRecognitionService;
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyFace(@RequestParam("image") MultipartFile image) {
        try {
            if (image.isEmpty()) {
                return ResponseEntity.badRequest().body("No image provided");
            }

            Path tempDir = Paths.get(FACE_DATA_DIR, "temp");
            Files.createDirectories(tempDir);
            Path tempFile = tempDir.resolve("capture_" + System.currentTimeMillis() + ".jpg");
            image.transferTo(tempFile.toFile());

            int predictedId = faceRecognitionService.predict(tempFile.toString());
            Files.deleteIfExists(tempFile);

            if (predictedId == -3) {
                return ResponseEntity.ok(java.util.Map.of("message", "No faces registered in the system. Please register your face in the 'Face Registration' page first."));
            } else if (predictedId == -5) {
                return ResponseEntity.ok(java.util.Map.of("message", "No face detected. Please ensure you are looking clearly at the camera."));
            } else if (predictedId == -6) {
                return ResponseEntity.ok(java.util.Map.of("message", "AI is starting up. Please try again in a few seconds."));
            } else if (predictedId < -1) {
                return ResponseEntity.ok(java.util.Map.of("message", "System error (" + predictedId + "). Please contact the agent."));
            }
            
            if (predictedId >= 0) {
                Optional<User> userOptional = userService.findById((long) predictedId);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    if ("STUDENT".equalsIgnoreCase(user.getRole())) {
                        attendanceService.markAttendance((long) predictedId, "PRESENT");
                        return ResponseEntity.ok(java.util.Map.of("message", "Face recognized — " + user.getName() + " (Student). Attendance marked!"));
                    } else {
                        return ResponseEntity.ok(java.util.Map.of("message", "Face recognized — " + user.getName() + " (" + user.getRole() + "). Attendance not marked (Students only)."));
                    }
                } else {
                    return ResponseEntity.ok(java.util.Map.of("message", "Face matched a deleted account (ID: " + predictedId + "). Please re-register."));
                }
            }

            return ResponseEntity.ok(java.util.Map.of("message", "Face not recognized. Try moving closer or ensure good lighting."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Attendance marking failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerFace(
            @RequestParam("userId") String userId,
            @RequestParam("images") MultipartFile[] images) {
        try {
            if (images == null || images.length == 0) {
                return ResponseEntity.badRequest().body("No images provided");
            }

            Path userDir = Paths.get(FACE_DATA_DIR, userId);
            Files.createDirectories(userDir);

            for (int i = 0; i < images.length; i++) {
                Path imagePath = userDir.resolve("face_" + i + ".jpg");
                images[i].transferTo(imagePath.toFile());
            }

            // Trigger training after new samples are added
            new Thread(() -> {
                try {
                    faceRecognitionService.train();
                } catch (Exception e) {
                    System.err.println("Background training failed: " + e.getMessage());
                }
            }).start();

            return ResponseEntity.ok("Face registration successful! System is re-training the AI model in the background.");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error saving face images: " + e.getMessage());
        }
    }

    @PostMapping("/train")
    public ResponseEntity<String> trainModel() {
        faceRecognitionService.train();
        return ResponseEntity.ok("Model training triggered successfully!");
    }
}
