package com.jobtrackerai.backend.controller;

import com.jobtrackerai.backend.model.JobApplication;
import com.jobtrackerai.backend.model.dto.JobApplicationDto;
import com.jobtrackerai.backend.service.GeminiService;
import com.jobtrackerai.backend.service.GeminiServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RequestMapping("/upload")
@RestController
public class UploadController {
    private final GeminiService geminiService;
    private static final Logger LOGGER = LoggerFactory.getLogger(GeminiServiceImpl.class);


    public UploadController(final GeminiService geminiService) {
        this.geminiService = geminiService;
    }
    @PostMapping("/job-description")
    public ResponseEntity<JobApplication> uploadJobDescription(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            String fileName = file.getOriginalFilename();
            
            String uploadsDir = "/app/uploads";
            File directory = new File(uploadsDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            String filePath = uploadsDir + "/" + fileName;
            File savedFile = new File(filePath);
            file.transferTo(savedFile);
            JobApplication jobApplication = geminiService.parseFile(filePath);
            return ResponseEntity.ok(jobApplication);
        } catch (IOException e) {
            LOGGER.error("Failed to save file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
}
