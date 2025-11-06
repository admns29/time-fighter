package com.example.timefighter.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.timefighter.dto.CategoryMapper;
import com.example.timefighter.dto.CategoryRequestDTO;
import com.example.timefighter.dto.CategoryResponseDTO;
import com.example.timefighter.exception.InvalidSessionStateException;
import com.example.timefighter.exception.ResourceNotFoundException;
import com.example.timefighter.model.Category;
import com.example.timefighter.model.Session;
import com.example.timefighter.repository.CategoryRepository;
import com.example.timefighter.repository.SessionRepository;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final SessionRepository sessionRepository;

    public CategoryService(CategoryRepository categoryRepository, SessionRepository sessionRepository) {
        this.categoryRepository = categoryRepository;
        this.sessionRepository = sessionRepository;
    }
    
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryResponseDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return CategoryMapper.toResponseDTO(category);
    }
    
    public CategoryResponseDTO createCategory(CategoryRequestDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new InvalidSessionStateException("Category with name '" + dto.getName() + "' already exists.");
        }
        
        Category category = new Category();
        category.setName(dto.getName());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        category.setDefaultGoalDuration(dto.getDefaultGoalDuration());
        
        Category saved = categoryRepository.save(category);
        return CategoryMapper.toResponseDTO(saved);
    }
    
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        if (!category.getName().equals(dto.getName()) && categoryRepository.existsByName(dto.getName())) {
            throw new InvalidSessionStateException("Category with name '" + dto.getName() + "' already exists.");
        }
        
        category.setName(dto.getName());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        category.setDefaultGoalDuration(dto.getDefaultGoalDuration());
        
        Category saved = categoryRepository.save(category);
        return CategoryMapper.toResponseDTO(saved);
    }
    
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        List<Session> sessions = sessionRepository.findAll().stream()
        .filter(s -> s.getCategory().equals(category.getName()))
        .toList();
        if (!sessions.isEmpty()) {
            throw new InvalidSessionStateException("Cannot delete category linked to existing sessions.");
        }

        categoryRepository.delete(category);
    }
}