package com.example.timefighter.repository;

import com.example.timefighter.model.Session;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByStatus(String status);
    // Provides built-in CRUD methods for Session entities 
    // (save, findById, findAll, deleteById, etc.)
    // Add custom query methods here if needed (e.g., findByUserId, findByStatus)
}