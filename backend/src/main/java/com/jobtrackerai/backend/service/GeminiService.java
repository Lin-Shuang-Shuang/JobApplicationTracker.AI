package com.jobtrackerai.backend.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.jobtrackerai.backend.model.JobApplication;

public interface GeminiService {
    JobApplication parseFile(String filepath);
}
