package com.jobtrackerai.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jobtrackerai.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gemini")
public class GeminiController {
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final GeminiService geminiService;
    private String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    public GeminiController(final GeminiService geminiService) {
        this.geminiService = geminiService;
    }
//    @PostMapping
//    public ResponseEntity<String> parseDocument(@RequestParam String filePath) {
//        String base64 = geminiService.getBase64(filePath);
//        if (base64 == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        return ResponseEntity.accepted().body(geminiService.getGeminiCompletions(base64));
//
//    }



}
