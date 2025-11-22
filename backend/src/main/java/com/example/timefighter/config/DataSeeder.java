package com.example.timefighter.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.timefighter.model.Category;
import com.example.timefighter.model.User;
import com.example.timefighter.repository.CategoryRepository;
import com.example.timefighter.repository.UserRepository;

@Configuration
public class DataSeeder {
    
    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default user if not exists
            User user = userRepository.findByUsername("admin").orElseGet(() -> {
                User newUser = new User("admin", passwordEncoder.encode("password"), "admin@example.com");
                return userRepository.save(newUser);
            });

            // Only seed if no categories exist
            if (categoryRepository.count() == 0) {
                // Create default categories
                createCategory(categoryRepository, "LeetCode", "#FFA116", "💻", 3600L, user);
                createCategory(categoryRepository, "JavaScript", "#3776AB", "🐍", 3600L, user);
                createCategory(categoryRepository, "Java", "#007396", "☕", 3600L, user);
                createCategory(categoryRepository, "Cybersecurity", "#00B4D8", "🔒", 3600L, user);
                createCategory(categoryRepository, "Web Development", "#ab01faff", "🌐", 3600L, user);

                System.out.println("✅ Default categories seeded successfully for user: " + user.getUsername());
            }
        };
    }

    private void createCategory(CategoryRepository repository, String name, String color, String icon, Long duration, User user) {
        Category category = new Category(name, color, icon, duration);
        category.setUser(user);
        repository.save(category);
    }
}