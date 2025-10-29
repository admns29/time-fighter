package com.example.timefighter.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.timefighter.dto.SessionRequestDTO;
import com.example.timefighter.dto.SessionResponseDTO;
import com.example.timefighter.service.SessionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    
    private final SessionService sessionService;
    
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }
    
    @PostMapping("/start")
    public SessionResponseDTO startSession(@Valid @RequestBody SessionRequestDTO request) {
        return sessionService.startSession(request);
    }

    @GetMapping("/current")
    public SessionResponseDTO getCurrentSession() {
        return sessionService.getCurrentSession();
    }

    @PutMapping("/{id}/pause")
    public SessionResponseDTO pauseSession(@PathVariable Long id) {
        return sessionService.pauseSession(id);
    }
    
    @PutMapping("/{id}/resume")
    public SessionResponseDTO resumeSession(@PathVariable Long id) {
        return sessionService.resumeSession(id);
    }

    @PutMapping("/{id}/stop")
    public SessionResponseDTO stopSession(@PathVariable Long id) {
        return sessionService.stopSession(id);
    }

    @GetMapping
    public List<SessionResponseDTO> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/{id}")
    public SessionResponseDTO getSession(@PathVariable Long id) {
        return sessionService.getSession(id);
    }

    @GetMapping("/active")
    public SessionResponseDTO getActiveSession() {
        return sessionService.getActiveSession();
    }
}