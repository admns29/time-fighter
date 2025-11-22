package com.example.timefighter.dto;

import java.util.Map;

public class StatisticsDTO {
    private long totalTimeToday;
    private long totalTimeThisWeek;
    private String mostStudiedCategory;
    private int currentStreak;
    private Map<String, Long> timePerCategory;

    public StatisticsDTO(long totalTimeToday, long totalTimeThisWeek, String mostStudiedCategory, int currentStreak, Map<String, Long> timePerCategory) {
        this.totalTimeToday = totalTimeToday;
        this.totalTimeThisWeek = totalTimeThisWeek;
        this.mostStudiedCategory = mostStudiedCategory;
        this.currentStreak = currentStreak;
        this.timePerCategory = timePerCategory;
    }

    public long getTotalTimeToday() {
        return totalTimeToday;
    }

    public void setTotalTimeToday(long totalTimeToday) {
        this.totalTimeToday = totalTimeToday;
    }

    public long getTotalTimeThisWeek() {
        return totalTimeThisWeek;
    }

    public void setTotalTimeThisWeek(long totalTimeThisWeek) {
        this.totalTimeThisWeek = totalTimeThisWeek;
    }

    public String getMostStudiedCategory() {
        return mostStudiedCategory;
    }

    public void setMostStudiedCategory(String mostStudiedCategory) {
        this.mostStudiedCategory = mostStudiedCategory;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Map<String, Long> getTimePerCategory() {
        return timePerCategory;
    }

    public void setTimePerCategory(Map<String, Long> timePerCategory) {
        this.timePerCategory = timePerCategory;
    }
}
