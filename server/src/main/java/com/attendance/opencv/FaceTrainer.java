package com.attendance.opencv;

import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_face.LBPHFaceRecognizer;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;
import static org.bytedeco.opencv.global.opencv_core.*;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class FaceTrainer {

    public void trainModel(String datasetDir, String modelPath) {
        File root = new File(datasetDir);
        if (!root.exists() || root.listFiles() == null)
            return;

        List<Mat> images = new ArrayList<>();
        List<Integer> labels = new ArrayList<>();

        for (File userDir : root.listFiles()) {
            if (userDir.isDirectory()) {
                try {
                    int label = Integer.parseInt(userDir.getName());
                    File[] imgFiles = userDir.listFiles();
                    if (imgFiles != null) {
                        for (File img : imgFiles) {
                            Mat image = imread(img.getAbsolutePath(), IMREAD_GRAYSCALE);
                            if (!image.empty()) {
                                images.add(image);
                                labels.add(label);
                            }
                        }
                    }
                } catch (NumberFormatException e) {
                    // Skip
                }
            }
        }

        if (images.isEmpty())
            return;

        MatVector imageVector = new MatVector(images.toArray(new Mat[0]));
        Mat labelMat = new Mat(labels.size(), 1, CV_32SC1);
        java.nio.IntBuffer labelBuffer = labelMat.createBuffer();
        for (int i = 0; i < labels.size(); i++) {
            labelBuffer.put(i, labels.get(i));
        }

        LBPHFaceRecognizer recognizer = LBPHFaceRecognizer.create();
        recognizer.train(imageVector, labelMat);
        recognizer.save(modelPath);
    }
}
