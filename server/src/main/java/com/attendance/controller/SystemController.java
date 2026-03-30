package com.attendance.controller;

import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.UserRepository;
import com.attendance.service.FaceRecognitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final FaceRecognitionService faceRecognitionService;
    private static final String FACE_DATA_DIR = System.getProperty("user.dir") + File.separator + "face-data";
    private static final String MODEL_PATH = System.getProperty("user.dir") + File.separator + "trained_model.yml";

    public SystemController(UserRepository userRepository, AttendanceRepository attendanceRepository, FaceRecognitionService faceRecognitionService) {
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.faceRecognitionService = faceRecognitionService;
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetSystem() {
        try {
            // 1. Clear Database
            attendanceRepository.deleteAll();
            userRepository.deleteAll();

            // 2. Clear Face Data Files
            File faceDir = new File(FACE_DATA_DIR);
            if (faceDir.exists()) {
                Files.walk(Paths.get(FACE_DATA_DIR))
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(f -> {
                        if (!f.getAbsolutePath().equals(faceDir.getAbsolutePath())) {
                            f.delete();
                        }
                    });
            }

            // 3. Delete AI Model
            File modelFile = new File(MODEL_PATH);
            if (modelFile.exists()) {
                modelFile.delete();
            }

            // 4. Re-init service state
            faceRecognitionService.init();

            return ResponseEntity.ok(Map.of("message", "System reset successful. All data cleared."));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to clear physical files: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "System reset failed: " + e.getMessage()));
        }
    }
}
