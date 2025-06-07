package com.jobtrackerai.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobtrackerai.backend.model.JobApplication;
import com.jobtrackerai.backend.model.dto.GeminiMultimodalRequest;
import com.jobtrackerai.backend.model.dto.GeminiMultimodalResponse;
import com.jobtrackerai.backend.repository.JobApplicationRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
public class GeminiServiceImpl implements GeminiService {
    private static final Logger LOGGER = LoggerFactory.getLogger(GeminiServiceImpl.class);
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    private String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private final JobApplicationRepository jobApplicationRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public GeminiServiceImpl(final JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public JobApplication parseFile(String filepath) {
        String base64 = getBase64(filepath);
        String completion = getGeminiCompletions(base64);
        JobApplication jobApplication = parseGeminiResponse(completion);
        return jobApplication;
    }

    private String getBase64(String filepath) {
        try {
            File file = new File(filepath);
            byte[] fileContent = Files.readAllBytes(file.toPath());
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (IOException e) {
            LOGGER.error("Error reading file: "  + e.getMessage());
        }
        return null;
    }
    private String getGeminiCompletions(String base64) {
        String url = geminiUrl + geminiApiKey;
        GeminiMultimodalRequest geminiMultimodalRequest = new GeminiMultimodalRequest();
        GeminiMultimodalRequest.Content content = new GeminiMultimodalRequest.Content();
        GeminiMultimodalRequest.Content.Part part1 = new GeminiMultimodalRequest.Content.Part();
        part1.setText("You are an expert job application tracker. Extract these information: Company, Job Position in json format");
        GeminiMultimodalRequest.Content.Part part2 = new GeminiMultimodalRequest.Content.Part();

        GeminiMultimodalRequest.Content.Part.InlineData inlineData = new GeminiMultimodalRequest.Content.Part.InlineData();
        inlineData.setData(base64);
        inlineData.setMimeType("image/png");
        part2.setInlineData(inlineData);
        List<GeminiMultimodalRequest.Content.Part> parts = new ArrayList<>();
        parts.add(part1);
        parts.add(part2);

        content.setParts(parts);
        List<GeminiMultimodalRequest.Content> contents = new ArrayList<>();
        contents.add(content);
        geminiMultimodalRequest.setContents(contents);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(geminiApiKey);
        HttpEntity<GeminiMultimodalRequest> entity = new HttpEntity<>(geminiMultimodalRequest, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<GeminiMultimodalResponse> response = restTemplate.postForEntity(url, entity, GeminiMultimodalResponse.class);
//        System.out.println(response.getBody());
        String geminiResponse = response.getBody().getCandidates().get(0).getContent().getParts().get(0).getText();

        return geminiResponse;

    }

    private JobApplication parseGeminiResponse(String response) {
        String cleaned = response.trim();
        cleaned = cleaned.replaceAll("^```json\\s*", "");
        cleaned = cleaned.replaceAll("```\\s*$", "");
        cleaned = cleaned.trim();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, String> application = objectMapper.readValue(cleaned, new TypeReference<>() {});
            JobApplication jobApplication = new JobApplication();

            for (Map.Entry<String, String> entry : application.entrySet()) {
                if ("Company".equals(entry.getKey())) jobApplication.setCompany(entry.getValue());
                if ("Job Position".equals(entry.getKey())) jobApplication.setJobPosition(entry.getValue());
                String formattedDate = LocalDate.now().format(formatter);
                jobApplication.setDateApplied(formattedDate);

            }
            jobApplicationRepository.save(jobApplication);
            return jobApplication;
        } catch (JsonMappingException e) {
            log.error("Error parsing JSON: " + e.getMessage());
        } catch (JsonProcessingException e) {
            log.error("Error processing JSON: " + e.getMessage());

        }
        return null;
    }
}
