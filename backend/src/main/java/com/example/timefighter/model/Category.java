package com.example.timefighter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "user_id"})
})
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String color;

    @Column(nullable = true)
    private String icon;

    @Column(nullable = true)
    private Long defaultGoalDuration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Category() {}

    public Category(String name, String color, String icon, Long defaultGoalDuration) {
        this.name = name;
        this.color = color;
        this.icon = icon;
        this.defaultGoalDuration = defaultGoalDuration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Long getDefaultGoalDuration() {
        return defaultGoalDuration;
    }
    
    public void setDefaultGoalDuration(Long defaultGoalDuration) {
        this.defaultGoalDuration = defaultGoalDuration;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}