package com.example.timefighter.dto;

import jakarta.validation.constraints.NotBlank;

public class SessionRequestDTO {
    
    @NotBlank(message = "Category is required")
    private String category;

    private Long goalDuration; //Optional goal duration in seconds
    
    public SessionRequestDTO() {}
    
    public SessionRequestDTO(String category, Long goalDuration) {
        this.category = category;
        this.goalDuration = goalDuration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getGoalDuration() {
        return goalDuration;
    }

    public void setGoalDuration(Long goalDuration) {
        this.goalDuration = goalDuration;
    }
}