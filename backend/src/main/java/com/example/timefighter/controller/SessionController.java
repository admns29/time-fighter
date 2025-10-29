package com.example.timefighter.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.timefighter.model.Session;
import com.example.timefighter.service.SessionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    
    private final SessionService sessionService;
    
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }
    
    @PostMapping("/start")
    public Session startSession(@RequestParam String category) {
        return sessionService.startSession(category);
    }

    @PutMapping("/{id}/pause")
    public Session pauseSession(@PathVariable Long id) {
        return sessionService.pauseSession(id);
    }
    
    @PutMapping("/{id}/resume")
    public Session resumeSession(@PathVariable Long id) {
        return sessionService.resumeSession(id);
    }

    @PutMapping("/{id}/stop")
    public Session stopSession(@PathVariable Long id) {
        return sessionService.stopSession(id);
    }

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/active")
    public Session getActiveSession() {
        return sessionService.getActiveSession();
    }

    @GetMapping("/{id}/session")
    public Session getSession(@PathVariable Long id) {
        return sessionService.getSession(id);
    }
    
}