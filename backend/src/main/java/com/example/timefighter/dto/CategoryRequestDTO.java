package com.example.timefighter.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequestDTO {
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String color;
    private String icon;
    private Long defaultGoalDuration;
    
    public CategoryRequestDTO() {}
    
    public CategoryRequestDTO(String name, String color, String icon, Long defaultGoalDuration) {
        this.name = name;
        this.color = color;
        this.icon = icon;
        this.defaultGoalDuration = defaultGoalDuration;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public Long getDefaultGoalDuration() {
        return defaultGoalDuration;
    }
    
    public void setDefaultGoalDuration(Long defaultGoalDuration) {
        this.defaultGoalDuration = defaultGoalDuration;
    }
}