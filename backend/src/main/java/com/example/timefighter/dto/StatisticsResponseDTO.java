package com.example.timefighter.dto;

import java.util.Map;

public class StatisticsResponseDTO {
    
    private Long totalTimeToday; // in seconds
    private Long totalTimeThisWeek; // in seconds
    private Map<String, Long> timePerCategory; // category name -> total seconds
    private String mostStudiedCategory;
    private Integer currentStreak; // days
    
    public StatisticsResponseDTO() {}
    
    public StatisticsResponseDTO(Long totalTimeToday, Long totalTimeThisWeek, 
                                 Map<String, Long> timePerCategory, String mostStudiedCategory, 
                                 Integer currentStreak) {
        this.totalTimeToday = totalTimeToday;
        this.totalTimeThisWeek = totalTimeThisWeek;
        this.timePerCategory = timePerCategory;
        this.mostStudiedCategory = mostStudiedCategory;
        this.currentStreak = currentStreak;
    }
    
    // Getters and Setters
    public Long getTotalTimeToday() {
        return totalTimeToday;
    }
    
    public void setTotalTimeToday(Long totalTimeToday) {
        this.totalTimeToday = totalTimeToday;
    }
    
    public Long getTotalTimeThisWeek() {
        return totalTimeThisWeek;
    }
    
    public void setTotalTimeThisWeek(Long totalTimeThisWeek) {
        this.totalTimeThisWeek = totalTimeThisWeek;
    }
    
    public Map<String, Long> getTimePerCategory() {
        return timePerCategory;
    }
    
    public void setTimePerCategory(Map<String, Long> timePerCategory) {
        this.timePerCategory = timePerCategory;
    }
    
    public String getMostStudiedCategory() {
        return mostStudiedCategory;
    }
    
    public void setMostStudiedCategory(String mostStudiedCategory) {
        this.mostStudiedCategory = mostStudiedCategory;
    }
    
    public Integer getCurrentStreak() {
        return currentStreak;
    }
    
    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }
}