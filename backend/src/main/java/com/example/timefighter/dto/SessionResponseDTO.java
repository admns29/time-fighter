package com.example.timefighter.dto;

import java.time.LocalDateTime;

public class SessionResponseDTO {
    
    private Long id;
    private String category;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long duration;
    private Long goalDuration;
    private String status;
    
    // Default constructor
    public SessionResponseDTO() {}
    
    // Full constructor
    public SessionResponseDTO(Long id, String category, LocalDateTime startTime, 
                              LocalDateTime endTime, Long duration, String status, Long goalDuration) {
        this.id = id;
        this.category = category;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.goalDuration = goalDuration;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public Long getDuration() {
        return duration;
    }
    
    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public Long getGoalDuration() {
        return goalDuration;
    }

    public void setGoalDuration(Long goalDuration) {
        this.goalDuration = goalDuration;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}