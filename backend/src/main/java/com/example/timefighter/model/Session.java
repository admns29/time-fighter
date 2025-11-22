package com.example.timefighter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = true)
    private Long goalDuration; // goal duration in seconds, can be null
    
    @Column(nullable = false)
    private String status; // ACTIVE, PAUSED, COMPLETED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}