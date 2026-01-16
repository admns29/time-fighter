package com.example.timefighter.controller;

import com.example.timefighter.dto.StatisticsDTO;
import com.example.timefighter.model.Session;
import com.example.timefighter.model.User;
import com.example.timefighter.repository.UserRepository;
import com.example.timefighter.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for handling Session-related API requests.
 * This class exposes endpoints that the Frontend can call to manage sessions.
 * 
 * @RestController indicates that this class handles HTTP requests and returns JSON responses.
 * @RequestMapping("/api/sessions") sets the base URL for all endpoints in this class.
 */
@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*") // Allows requests from any domain (useful for development)
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Helper method to retrieve the User entity from the authenticated UserDetails.
     * UserDetails is provided by Spring Security.
     */
    private User getUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * GET /api/sessions
     * Retrieves all sessions for the currently logged-in user.
     */
    @GetMapping
    public List<Session> getAllSessions(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return sessionService.getAllSessions(user);
    }

    /**
     * GET /api/sessions/statistics
     * Calculates and returns statistics (streak, total time, etc.) for the user.
     */
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDTO> getStatistics(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        StatisticsDTO stats = sessionService.getStatistics(user);
        return ResponseEntity.ok(stats);
    }

    /**
     * POST /api/sessions/start
     * Starts a new session. Expects a JSON body with 'category' and optional 'goalDuration'.
     */
    @PostMapping("/start")
    public ResponseEntity<?> startSession(@RequestBody Map<String, Object> payload, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String category = (String) payload.get("category");
            // Safely cast the number to Long
            Long goalDuration = payload.get("goalDuration") != null ? ((Number) payload.get("goalDuration")).longValue() : null;
            User user = getUser(userDetails);
            return ResponseEntity.ok(sessionService.startSession(category, goalDuration, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/sessions/{id}/stop
     * Stops the session with the given ID.
     */
    @PostMapping("/{id}/stop")
    public ResponseEntity<?> stopSession(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(sessionService.stopSession(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * POST /api/sessions/{id}/pause
     * Pauses the session.
     */
    @PostMapping("/{id}/pause")
    public ResponseEntity<?> pauseSession(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(sessionService.pauseSession(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error pausing session: " + e.getMessage());
        }
    }
    
    /**
     * POST /api/sessions/{id}/resume
     * Resumes a paused session.
     */
    @PostMapping("/{id}/resume")
    public ResponseEntity<?> resumeSession(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(sessionService.resumeSession(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/sessions/current
     * Checks if there is any active or paused session currently running.
     * Useful for restoring state when the user refreshes the page.
     */
    @GetMapping("/current")
    public ResponseEntity<Session> getCurrentSession(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        Session session = sessionService.getCurrentSession(user);
        if (session != null) {
            return ResponseEntity.ok(session);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session sessionDetails) {
        try {
            Session updatedSession = sessionService.updateSession(id, sessionDetails);
            return ResponseEntity.ok(updatedSession);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}