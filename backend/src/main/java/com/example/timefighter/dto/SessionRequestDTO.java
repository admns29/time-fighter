package com.example.timefighter.dto;

import jakarta.validation.constraints.NotBlank;

public class SessionRequestDTO {
    
    @NotBlank(message = "Category is required")
    private String category;
    
    public SessionRequestDTO() {}
    
    public SessionRequestDTO(String category) {
        this.category = category;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}