package com.example.timefighter.repository;

import com.example.timefighter.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Find category by name 
    Optional<Category> findByName(String name);
    
    // Check if category name exists 
    boolean existsByName(String name);
}