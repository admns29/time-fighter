import api from './axiosConfig';

// Base URL for API (Vite proxy will forward /api to http://localhost:8080/api)
const API_BASE_URL = '/api/sessions';

// Start a new session
// Takes a category string (e.g., "LeetCode")
// Returns: Promise with session data
export const startSession = async (category, goalDuration = null) => {
  try {
    const body = { category };
    if (goalDuration != null) body.goalDuration = goalDuration;
    const response = await api.post(`${API_BASE_URL}/start`, body);
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
    throw error;
  }
};

// Pause an active session
// Takes: sessionId (number)
// Returns: Promise with updated session data
export const pauseSession = async (sessionId) => {
  try {
    const response = await api.post(`${API_BASE_URL}/${sessionId}/pause`);
    return response.data;
  } catch (error) {
    console.error('Error pausing session:', error);
    throw error;
  }
};

// Resume a paused session
export const resumeSession = async (sessionId) => {
  try {
    const response = await api.post(`${API_BASE_URL}/${sessionId}/resume`);
    return response.data;
  } catch (error) {
    console.error('Error resuming session:', error);
    throw error;
  }
};

// Stop/complete a session
export const stopSession = async (sessionId) => {
  try {
    const response = await api.post(`${API_BASE_URL}/${sessionId}/stop`);
    return response.data;
  } catch (error) {
    console.error('Error stopping session:', error);
    throw error;
  }
};

// Get all sessions (for history)
export const getAllSessions = async () => {
  try {
    const response = await api.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

// Get the current session (active or paused)
export const getCurrentSession = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/current`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching current session:', error);
    return null; // Return null instead of throwing
  }
  
};

// Set goal duration for a session
export const setGoalDuration = async (sessionId, goalDuration = null) => {
  try {
    const response = await api.post(`${API_BASE_URL}/${sessionId}/goal`, {
      goalDuration 
    });
    return response.data;
  } catch (error) {
    console.error('Error setting goal duration:', error);
    throw error;
  }
};

// Get statistics
export const getStatistics = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};