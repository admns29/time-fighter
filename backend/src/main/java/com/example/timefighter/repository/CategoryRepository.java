package com.example.timefighter.repository;

import com.example.timefighter.model.Category;
import com.example.timefighter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    
    List<Category> findByUser(User user);
    Optional<Category> findByNameAndUser(String name, User user);
    boolean existsByNameAndUser(String name, User user);
}