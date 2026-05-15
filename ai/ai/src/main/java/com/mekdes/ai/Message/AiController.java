package com.mekdes.ai.message;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/ai", "/api"})
@CrossOrigin(origins = {"*"}, allowedHeaders = "*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        if (request.getUserMessage() == null || request.getUserMessage().trim().isEmpty()) {
            return new ChatResponse("Error: User message cannot be empty.");
        }
        
        try {
            String reply = aiService.chat(request.getUserMessage());
            return new ChatResponse(reply);
        } catch (Exception e) {
            return new ChatResponse("Error: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("AI service is running", true);
    }
}