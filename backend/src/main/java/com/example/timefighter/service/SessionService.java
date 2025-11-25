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

/**
 * Service class for managing study sessions.
 * This class contains the business logic for starting, stopping, pausing, and resuming sessions.
 * It also handles the calculation of statistics.
 * 
 * @Service marks this class as a Spring Service, allowing it to be injected into Controllers.
 * @Transactional ensures that database operations are atomic (all or nothing).
 */
@Service
@Transactional
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    /**
     * Retrieves all sessions for a specific user.
     */
    public List<Session> getAllSessions(User user) {
        return sessionRepository.findByUser(user);
    }

    /**
     * Starts a new study session.
     * Checks if there is already an active session to prevent duplicates.
     */
    public Session startSession(String category, Long goalDuration, User user) {
        // Check if the user already has an active session
        Optional<Session> activeSession = sessionRepository.findTopByUserAndStatusOrderByStartTimeDesc(user, "ACTIVE");
        if (activeSession.isPresent()) {
            throw new RuntimeException("There is already an active session");
        }

        Session session = new Session();
        session.setCategory(category);
        session.setStartTime(LocalDateTime.now());
        session.setStatus("ACTIVE");
        session.setDuration(0L); // Initialize duration to 0
        session.setGoalDuration(goalDuration);
        session.setUser(user);

        return sessionRepository.save(session);
    }

    /**
     * Stops an active or paused session.
     * Calculates the final duration and marks the session as COMPLETED.
     */
    public Session stopSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!"ACTIVE".equals(session.getStatus()) && !"PAUSED".equals(session.getStatus())) {
            throw new RuntimeException("Session is not active or paused");
        }

        session.setEndTime(LocalDateTime.now());
        
        // If the session was active, we need to add the time elapsed since the last start time
        if ("ACTIVE".equals(session.getStatus()) && session.getStartTime() != null) {
             long currentSegmentDuration = Duration.between(session.getStartTime(), session.getEndTime()).getSeconds();
             session.setDuration((session.getDuration() == null ? 0 : session.getDuration()) + currentSegmentDuration);
        }

        session.setStatus("COMPLETED");
        return sessionRepository.save(session);
    }
    
    /**
     * Pauses an active session.
     * Accumulates the time spent so far into the 'duration' field.
     */
    public Session pauseSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!"ACTIVE".equals(session.getStatus())) {
             throw new RuntimeException("Session is not active");
        }
        
        // Calculate how much time passed since the session started (or was last resumed)
        if (session.getStartTime() != null) {
            long currentSegmentDuration = Duration.between(session.getStartTime(), LocalDateTime.now()).getSeconds();
            // Add this segment to the total duration
            session.setDuration((session.getDuration() == null ? 0 : session.getDuration()) + currentSegmentDuration);
        }
        
        // We update startTime to now() just to satisfy database constraints, 
        // but effectively the timer is "stopped" until resumed.
        session.setStartTime(LocalDateTime.now()); 
        session.setStatus("PAUSED");
        return sessionRepository.save(session);
    }
    
    /**
     * Resumes a paused session.
     * Sets the status back to ACTIVE and resets the start time to now.
     */
    public Session resumeSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!"PAUSED".equals(session.getStatus())) {
             throw new RuntimeException("Session is not paused");
        }
        
        // Reset start time to now, so we can calculate the new segment duration later
        session.setStartTime(LocalDateTime.now()); 
        session.setStatus("ACTIVE");
        return sessionRepository.save(session);
    }

    /**
     * Finds the currently active or paused session for the user.
     * Used to restore the timer state when the user refreshes the page.
     */
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

    /**
     * Calculates statistics for the user (Daily total, Weekly total, Streaks, etc.)
     */
    public StatisticsDTO getStatistics(User user) {
        List<Session> sessions = sessionRepository.findByUser(user);
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        // Find the Monday of the current week
        LocalDateTime startOfWeek = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();

        long totalTimeToday = 0;
        long totalTimeThisWeek = 0;
        Map<String, Long> timePerCategory = new HashMap<>();

        for (Session session : sessions) {
            if (session.getStartTime() == null) continue;
            
            long duration = session.getDuration() != null ? session.getDuration() : 0;
            
            // Add to today's total if the session started today
            if (session.getStartTime().isAfter(startOfDay)) {
                totalTimeToday += duration;
            }
            
            // Add to this week's total if the session started this week
            if (session.getStartTime().isAfter(startOfWeek)) {
                totalTimeThisWeek += duration;
            }
            
            // Group time by category
            timePerCategory.put(session.getCategory(), timePerCategory.getOrDefault(session.getCategory(), 0L) + duration);
        }

        // Find the category with the most time spent
        String mostStudiedCategory = timePerCategory.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        // Calculate streak (consecutive days with at least one session)
        int currentStreak = calculateStreak(sessions);

        return new StatisticsDTO(totalTimeToday, totalTimeThisWeek, mostStudiedCategory, currentStreak, timePerCategory);
    }

    /**
     * Helper method to calculate the current streak of consecutive study days.
     */
    private int calculateStreak(List<Session> sessions) {
        if (sessions.isEmpty()) return 0;

        // Get a list of unique dates where the user had a session, sorted newest first
        List<LocalDate> sessionDates = sessions.stream()
                .map(s -> s.getStartTime().toLocalDate())
                .distinct()
                .sorted((d1, d2) -> d2.compareTo(d1)) // Descending order
                .collect(Collectors.toList());

        if (sessionDates.isEmpty()) return 0;

        int streak = 0;
        LocalDate today = LocalDate.now();
        LocalDate checkDate = today;

        // Check if there's a session today. If not, check yesterday to see if the streak is still alive.
        if (!sessionDates.contains(today)) {
            checkDate = today.minusDays(1);
            if (!sessionDates.contains(checkDate)) {
                return 0; // No session today or yesterday, streak is broken
            }
        }

        // Iterate backwards through dates to count consecutive days
        for (LocalDate date : sessionDates) {
            if (date.equals(checkDate)) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else if (date.isBefore(checkDate)) {
                break; // Gap found, stop counting
            }
        }
        return streak;
    }
}