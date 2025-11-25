package com.example.timefighter.repository;

import com.example.timefighter.model.Session;
import com.example.timefighter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Session entity.
 * By extending JpaRepository, we get standard CRUD operations (save, findById, delete, etc.) for free.
 * We can also define custom queries by simply naming the methods correctly (Spring Data JPA magic).
 */
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByStatus(String status);
    List<Session> findByStatusIn(List<String> statuses);
    
    // Find all sessions belonging to a specific user
    List<Session> findByUser(User user);
    
    // Find sessions for a user with a specific status
    List<Session> findByUserAndStatus(User user, String status);
    
    // Find the most recent session for a user with a specific status
    // This is used to check if the user has an active or paused session
    Optional<Session> findTopByUserAndStatusOrderByStartTimeDesc(User user, String status);
}