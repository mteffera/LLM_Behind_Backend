package com.mekdes.ai.message;

public class ChatResponse {
    private String assistantMessage;

    public ChatResponse(String assistantMessage) {
        this.assistantMessage = assistantMessage;
    }

    public String getAssistantMessage() { return assistantMessage; }
}