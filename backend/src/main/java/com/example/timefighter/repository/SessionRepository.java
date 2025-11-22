package com.example.timefighter.repository;

import com.example.timefighter.model.Session;
import com.example.timefighter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByStatus(String status);
    List<Session> findByStatusIn(List<String> statuses);
    
    List<Session> findByUser(User user);
    List<Session> findByUserAndStatus(User user, String status);
    Optional<Session> findTopByUserAndStatusOrderByStartTimeDesc(User user, String status);
}