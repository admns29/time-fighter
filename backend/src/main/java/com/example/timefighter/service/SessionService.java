package com.example.timefighter.service;

import com.example.timefighter.dto.StatisticsDTO;
import com.example.timefighter.model.Session;
import com.example.timefighter.model.User;
import com.example.timefighter.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public List<Session> getAllSessions(User user) {
        return sessionRepository.findByUser(user);
    }

    public Session startSession(String category, Long goalDuration, User user) {
        Optional<Session> activeSession = sessionRepository.findTopByUserAndStatusOrderByStartTimeDesc(user, "ACTIVE");
        if (activeSession.isPresent()) {
            throw new RuntimeException("There is already an active session");
        }

        Session session = new Session();
        session.setCategory(category);
        session.setStartTime(LocalDateTime.now());
        session.setStatus("ACTIVE");
        session.setDuration(0L);
        session.setGoalDuration(goalDuration);
        session.setUser(user);

        return sessionRepository.save(session);
    }

    public Session stopSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!"ACTIVE".equals(session.getStatus()) && !"PAUSED".equals(session.getStatus())) {
            throw new RuntimeException("Session is not active or paused");
        }

        session.setEndTime(LocalDateTime.now());
        
        // If active, add the final segment duration
        if ("ACTIVE".equals(session.getStatus()) && session.getStartTime() != null) {
             long currentSegmentDuration = Duration.between(session.getStartTime(), session.getEndTime()).getSeconds();
             session.setDuration((session.getDuration() == null ? 0 : session.getDuration()) + currentSegmentDuration);
        }

        session.setStatus("COMPLETED");
        return sessionRepository.save(session);
    }
    
    public Session pauseSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!"ACTIVE".equals(session.getStatus())) {
             throw new RuntimeException("Session is not active");
        }
        
        // Calculate duration for the current active segment
        if (session.getStartTime() != null) {
            long currentSegmentDuration = Duration.between(session.getStartTime(), LocalDateTime.now()).getSeconds();
            session.setDuration((session.getDuration() == null ? 0 : session.getDuration()) + currentSegmentDuration);
        }
        
        session.setStartTime(LocalDateTime.now()); // Start new segment
        session.setStatus("PAUSED");
        return sessionRepository.save(session);
    }
    
    public Session resumeSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!"PAUSED".equals(session.getStatus())) {
             throw new RuntimeException("Session is not paused");
        }
        
        session.setStartTime(LocalDateTime.now()); // Start new segment
        session.setStatus("ACTIVE");
        return sessionRepository.save(session);
    }

    public Session getCurrentSession(User user) {
        return sessionRepository.findTopByUserAndStatusOrderByStartTimeDesc(user, "ACTIVE")
                .orElse(sessionRepository.findTopByUserAndStatusOrderByStartTimeDesc(user, "PAUSED").orElse(null));
    }
    
    public Session updateSession(Long id, Session sessionDetails) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setDuration(sessionDetails.getDuration());
        return sessionRepository.save(session);
    }

    public StatisticsDTO getStatistics(User user) {
        List<Session> sessions = sessionRepository.findByUser(user);
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();

        long totalTimeToday = 0;
        long totalTimeThisWeek = 0;
        Map<String, Long> timePerCategory = new HashMap<>();

        for (Session session : sessions) {
            if (session.getStartTime() == null) continue;
            
            long duration = session.getDuration() != null ? session.getDuration() : 0;
            
            // Total time today
            if (session.getStartTime().isAfter(startOfDay)) {
                totalTimeToday += duration;
            }
            
            // Total time this week
            if (session.getStartTime().isAfter(startOfWeek)) {
                totalTimeThisWeek += duration;
            }
            
            // Time per category
            timePerCategory.put(session.getCategory(), timePerCategory.getOrDefault(session.getCategory(), 0L) + duration);
        }

        String mostStudiedCategory = timePerCategory.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        // Calculate streak (simplified: consecutive days with at least one session)
        int currentStreak = calculateStreak(sessions);

        return new StatisticsDTO(totalTimeToday, totalTimeThisWeek, mostStudiedCategory, currentStreak, timePerCategory);
    }

    private int calculateStreak(List<Session> sessions) {
        if (sessions.isEmpty()) return 0;

        List<LocalDate> sessionDates = sessions.stream()
                .map(s -> s.getStartTime().toLocalDate())
                .distinct()
                .sorted((d1, d2) -> d2.compareTo(d1)) // Descending order
                .collect(Collectors.toList());

        if (sessionDates.isEmpty()) return 0;

        int streak = 0;
        LocalDate today = LocalDate.now();
        LocalDate checkDate = today;

        // Check if there's a session today, if not, check yesterday to start streak
        if (!sessionDates.contains(today)) {
            checkDate = today.minusDays(1);
            if (!sessionDates.contains(checkDate)) {
                return 0;
            }
        }

        for (LocalDate date : sessionDates) {
            if (date.equals(checkDate)) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else if (date.isBefore(checkDate)) {
                break; // Gap found
            }
        }
        return streak;
    }
}