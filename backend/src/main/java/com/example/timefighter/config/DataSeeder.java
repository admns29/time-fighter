package com.example.timefighter.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.timefighter.model.Category;
import com.example.timefighter.repository.CategoryRepository;

@Configuration
public class DataSeeder {
    
    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository) {
        return args -> {
            // Only seed if no categories exist
            if (categoryRepository.count() == 0) {
                // Create default categories
                categoryRepository.save(new Category("LeetCode", "#FFA116", "💻", 3600L));
                categoryRepository.save(new Category("JavaScript", "#3776AB", "🐍", 3600L));
                categoryRepository.save(new Category("Java", "#007396", "☕", 3600L));
                categoryRepository.save(new Category("Cybersecurity", "#00B4D8", "🔒", 3600L));
                categoryRepository.save(new Category("Web Development", "#ab01faff", "🌐", 3600L));

                
                System.out.println("✅ Default categories seeded successfully!");
            }
        };
    }
}