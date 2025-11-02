package com.example.timefighter.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.timefighter.dto.SessionMapper;
import com.example.timefighter.dto.SessionRequestDTO;
import com.example.timefighter.dto.SessionResponseDTO;
import com.example.timefighter.exception.InvalidSessionStateException;
import com.example.timefighter.exception.ResourceNotFoundException;
import com.example.timefighter.model.Session;
import com.example.timefighter.repository.SessionRepository;

@Service
public class SessionService {
    
    private final SessionRepository sessionRepository;
    
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    
    public SessionResponseDTO startSession(SessionRequestDTO request) {
        Session session = sessionRepository.findByStatusIn(List.of("ACTIVE", "PAUSED"))
        .stream()
        .findFirst()
        .orElse(null);
        if (session != null) {
            throw new InvalidSessionStateException("An active session already exists with id: " + session.getId());
        }

        Session newSession = new Session();
        newSession.setCategory(request.getCategory());
        newSession.setStatus("ACTIVE");
        newSession.setStartTime(LocalDateTime.now());
        newSession.setDuration(0L);
        newSession.setGoalDuration(request.getGoalDuration());
        
        Session saved = sessionRepository.save(newSession);
        return SessionMapper.toResponseDTO(saved);
    }
    
    public SessionResponseDTO pauseSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));
        
        if (!"ACTIVE".equals(session.getStatus())) {
                throw new InvalidSessionStateException("Can only pause active sessions");        }
        
        long additionalSeconds = Duration.between(session.getStartTime(), LocalDateTime.now()).getSeconds();
        session.setDuration(session.getDuration() + additionalSeconds);
        session.setStatus("PAUSED");
        
        Session saved = sessionRepository.save(session);
        return SessionMapper.toResponseDTO(saved);
    }

    public SessionResponseDTO resumeSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));        
        if (!"PAUSED".equals(session.getStatus())) {
            throw new InvalidSessionStateException("Can only resume paused sessions with id: " + sessionId);
        }
        
        session.setStatus("ACTIVE");
        session.setStartTime(LocalDateTime.now());
        
        Session saved = sessionRepository.save(session);
        return SessionMapper.toResponseDTO(saved);
    }

    public SessionResponseDTO stopSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        if ("ACTIVE".equals(session.getStatus())) {
            long additionalSeconds = Duration.between(session.getStartTime(), LocalDateTime.now()).getSeconds();
            session.setDuration(session.getDuration() + additionalSeconds);
        }
        
        session.setStatus("COMPLETED");
        session.setEndTime(LocalDateTime.now());
        
        Session saved = sessionRepository.save(session);
        return SessionMapper.toResponseDTO(saved);
    }

    public SessionResponseDTO getSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        return SessionMapper.toResponseDTO(session);
    }

    public List<SessionResponseDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(SessionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SessionResponseDTO getActiveSession() {
        List<Session> activeSessions = sessionRepository.findByStatus("ACTIVE");
        if (activeSessions.isEmpty()) {
            return null;
        }
        return SessionMapper.toResponseDTO(activeSessions.get(0));
    }

    public SessionResponseDTO getCurrentSession() {
    // Find any session that's ACTIVE or PAUSED (not COMPLETED)
    List<Session> currentSessions = sessionRepository.findAll().stream()
            .filter(s -> "ACTIVE".equals(s.getStatus()) || "PAUSED".equals(s.getStatus()))
            .sorted((a, b) -> b.getStartTime().compareTo(a.getStartTime())) // Most recent first
            .toList();
    
    if (currentSessions.isEmpty()) {
        return null;
    }
    return SessionMapper.toResponseDTO(currentSessions.get(0));
    }

    public SessionResponseDTO setGoalDuration(Long sessionId, Long goalDuration) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));
        session.setGoalDuration(goalDuration);
        Session saved = sessionRepository.save(session);
        return SessionMapper.toResponseDTO(saved);
    }

    public SessionResponseDTO getGoalDuration(Long sessionId) {
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));
    return SessionMapper.toResponseDTO(session); // response includes goalDuration
    }

}