package com.example.timefighter.dto;

import com.example.timefighter.model.Category;

public class CategoryMapper {
    
    public static CategoryResponseDTO toResponseDTO(Category category) {
        return new CategoryResponseDTO(
            category.getId(),
            category.getName(),
            category.getColor(),
            category.getIcon(),
            category.getDefaultGoalDuration()
        );
    }
}