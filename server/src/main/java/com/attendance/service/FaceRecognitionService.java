package com.attendance.service;

import com.attendance.opencv.FaceDetector;
import com.attendance.opencv.FaceTrainer;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Rect;
import org.bytedeco.opencv.opencv_face.LBPHFaceRecognizer;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;

@Service
public class FaceRecognitionService {

    private final FaceDetector faceDetector = new FaceDetector();
    private final FaceTrainer faceTrainer = new FaceTrainer();
    private LBPHFaceRecognizer recognizer;
    
    private static final String FACE_DATA_DIR = System.getProperty("user.dir") + File.separator + "face-data";
    private static final String MODEL_PATH = System.getProperty("user.dir") + File.separator + "trained_model.yml";

    @PostConstruct
    public void init() {
        recognizer = LBPHFaceRecognizer.create();
        loadModel();
    }

    public void loadModel() {
        File modelFile = new File(MODEL_PATH);
        if (modelFile.exists()) {
            try {
                recognizer.read(MODEL_PATH);
                System.out.println("Face recognition model loaded from: " + MODEL_PATH);
            } catch (Exception e) {
                System.err.println("Error loading model: " + e.getMessage());
            }
        } else {
            System.out.println("No trained model found. Please train first.");
        }
    }

    public void train() {
        System.out.println("Starting model training...");
        faceTrainer.trainModel(FACE_DATA_DIR, MODEL_PATH);
        loadModel();
        System.out.println("Model training completed and reloaded.");
    }

    public int predict(String imagePath) {
        if (recognizer == null) {
            System.err.println("Predict failed: Recognizer not initialized.");
            return -2; // Special code for initialization error
        }
        
        File modelFile = new File(MODEL_PATH);
        if (!modelFile.exists()) {
            System.out.println("Model file missing. Triggering auto-train...");
            train();
            if (!modelFile.exists()) {
                System.out.println("Auto-train failed (no face data?).");
                return -3; // Special code for no models available
            }
        }

        Mat image = imread(imagePath, IMREAD_GRAYSCALE);
        if (image == null || image.empty()) {
            System.err.println("Predict failed: Could not read image " + imagePath);
            return -4;
        }

        Rect faceRect = faceDetector.detectFaces(imagePath);
        if (faceRect == null) {
            System.out.println("No face detected in the captured image.");
            return -5;
        }

        try {
            Mat face = new Mat(image, faceRect);
            resize(face, face, new org.bytedeco.opencv.opencv_core.Size(200, 200));

            org.bytedeco.javacpp.IntPointer label = new org.bytedeco.javacpp.IntPointer(1);
            org.bytedeco.javacpp.DoublePointer confidence = new org.bytedeco.javacpp.DoublePointer(1);
            recognizer.predict(face, label, confidence);

            int predictedId = label.get(0);
            double confValue = confidence.get(0);

            System.out.println("AI Prediction result - ID: " + predictedId + ", Confidence: " + (int)confValue + " (Lower is better)");

            if (predictedId != -1 && confValue < 150.0) {
                return predictedId;
            }

            if (predictedId != -1) {
                System.out.println("Prediction rejected: Confidence (" + (int)confValue + ") exceeds threshold (150).");
            }
        } catch (Exception e) {
            System.err.println("Native prediction error: " + e.getMessage());
            return -6;
        }
        
        return -1;
    }
}
