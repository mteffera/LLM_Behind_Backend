package com.mekdes.ai.message;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key:${spring.ai.google.generativeai.api-key:}}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash-latest}")
    private String model;

    private final RestTemplate rest;

    public AiService(RestTemplate rest) {
        this.rest = rest;
    }

    public String chat(String userMessage) throws Exception {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Missing AI API key. Set gemini.api.key or spring.ai.google.generativeai.api-key in application.properties.");
        }
        if (userMessage == null || userMessage.trim().isEmpty()) {
            throw new IllegalArgumentException("User message cannot be empty");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", userMessage)
                        })
                }
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = rest.postForEntity(url, request, Map.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new Exception("Failed to get response from AI service");
            }

            // Extract assistant message
            var candidates = (java.util.List) response.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new Exception("No candidates in response");
            }

            var content = (Map) ((Map) candidates.get(0)).get("content");
            var parts = (java.util.List) content.get("parts");
            var text = (Map) parts.get(0);

            return text.get("text").toString();
        } catch (Exception e) {
            throw new Exception("AI Service Error: " + e.getMessage(), e);
        }
    }
}