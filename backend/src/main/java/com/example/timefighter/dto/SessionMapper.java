package com.example.timefighter.dto;

import com.example.timefighter.model.Session;

public class SessionMapper {
    
    public static SessionResponseDTO toResponseDTO(Session session) {
        return new SessionResponseDTO(
            session.getId(),
            session.getCategory(),
            session.getStartTime(),
            session.getEndTime(),
            session.getDuration(),
            session.getStatus(),
            session.getGoalDuration()
        );
    }
}