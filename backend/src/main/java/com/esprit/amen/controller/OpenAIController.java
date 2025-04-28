package com.esprit.amen.controller;

import com.esprit.amen.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/gpt")
@CrossOrigin(origins = "http://localhost:4200")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;  // Changed from OpenAPIService to OpenAIService

    @PostMapping("/ask")
    public ResponseEntity<String> askGPT(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");
            if (userMessage == null || userMessage.isBlank()) {
                return ResponseEntity.badRequest().body("Message cannot be empty");
            }
            return ResponseEntity.ok(openAIService.generateResponse(userMessage));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error processing request");
        }
    }
}