package com.jobtrackerai.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GeminiMultimodalResponse {
    private List<Candidate> candidates;

    private UsageMetadata usageMetadata;

    private String modelVersion;

    @Data
    public static class Candidate {
        private Content content;
        private String finishReason;
        private Double avgLogprobs;
    }

    @Data
    public static class Content {
        private List<Part> parts;
        private String role;
    }

    @Data
    public static class Part {
        private String text;
    }

    @Data
    public static class UsageMetadata {
        private int promptTokenCount;
        private int candidatesTokenCount;
        private int totalTokenCount;

        @JsonProperty("promptTokensDetails")
        private List<TokenDetail> promptTokensDetails;

        @JsonProperty("candidatesTokensDetails")
        private List<TokenDetail> candidatesTokensDetails;
    }

    @Data
    public static class TokenDetail {
        private String modality;
        private int tokenCount;
    }
}
