package com.example.timefighter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String category; // LeetCode, Python, Java, Cybersecurity
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    private LocalDateTime endTime; // null if session is still active
    
    @Column(nullable = false)
    private Long duration; // total duration in seconds
    
    @Column(nullable = false)
    private String status; // ACTIVE, PAUSED, COMPLETED
    
    public Session() {}
    
    public Session(String category, LocalDateTime startTime, String status) {
        this.category = category;
        this.startTime = startTime;
        this.status = status;
        this.duration = 0L;
    }
    
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}