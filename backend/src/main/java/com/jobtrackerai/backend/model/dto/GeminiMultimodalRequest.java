package com.jobtrackerai.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Setter;

import java.util.List;
@Data
@Setter
public class GeminiMultimodalRequest {

    private List<Content> contents;

    @Data
    @Setter
    public static class Content {
        private List<Part> parts;

        @Data
        @Setter
//        @JsonInclude(JsonInclude.Include.NON_NULL)
        public static class Part {
            @JsonProperty("inline_data")
            private InlineData inlineData;
            private String text;
            @Data
            @Setter
            public static class InlineData {
                @JsonProperty("mime_type")
                private String mimeType;
                private String data;
            }
        }

    }
}
