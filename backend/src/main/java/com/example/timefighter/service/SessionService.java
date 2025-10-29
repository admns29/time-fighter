package com.example.timefighter.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.timefighter.model.Session;
import com.example.timefighter.repository.SessionRepository;

@Service
public class SessionService {
    
    private final SessionRepository sessionRepository;
    
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    
    public Session startSession(String category) {
        Session newSession = new Session();
        newSession.setCategory(category);
        newSession.setStatus("ACTIVE");
        newSession.setStartTime(LocalDateTime.now());
        newSession.setDuration(0L);
        return sessionRepository.save(newSession);
    }
    
    public Session pauseSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new IllegalStateException("Can only pause active sessions");
        }
        
        // Calculate duration from start to now
        long additionalSeconds = Duration.between(session.getStartTime(), LocalDateTime.now()).getSeconds();
        session.setDuration(session.getDuration() + additionalSeconds);
        session.setStatus("PAUSED");
        
        return sessionRepository.save(session);
    }

    public Session resumeSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        if (!"PAUSED".equals(session.getStatus())) {
            throw new IllegalStateException("Can only resume paused sessions");
        }
        
        session.setStatus("ACTIVE");
        session.setStartTime(LocalDateTime.now()); // reset start time for duration calculation
        
        return sessionRepository.save(session);
    }

    public Session stopSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        if ("ACTIVE".equals(session.getStatus())) {
            // Calculate final duration
            long additionalSeconds = Duration.between(session.getStartTime(), LocalDateTime.now()).getSeconds();
            session.setDuration(session.getDuration() + additionalSeconds);
        }
        
        session.setStatus("COMPLETED");
        session.setEndTime(LocalDateTime.now());
        
        return sessionRepository.save(session);
    }

    public Session getSession(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Session getActiveSession() {
        List<Session> activeSessions = sessionRepository.findByStatus("ACTIVE");
        return activeSessions.isEmpty() ? null : activeSessions.get(0);
    }
}