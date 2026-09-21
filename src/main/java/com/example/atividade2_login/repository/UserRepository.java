package com.example.atividade2_login.repository;

import com.example.atividade2_login.model.User;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class UserRepository {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(1);

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idSequence.getAndIncrement());
        }
        users.put(user.getId(), user);
        return user;
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(users.get(id));
    }

    public Optional<User> findByUsername(String username) {
        if (username == null) return Optional.empty();
        return users.values().stream()
                .filter(u -> username.equalsIgnoreCase(u.getUsername()))
                .findFirst();
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return users.values().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst();
    }

    public Optional<User> findByUsernameOrEmail(String identifier) {
        if (identifier == null) return Optional.empty();
        return users.values().stream()
                .filter(u -> identifier.equalsIgnoreCase(u.getUsername()) || identifier.equalsIgnoreCase(u.getEmail()))
                .findFirst();
    }

    public boolean existsByUsername(String username) {
        if (username == null) return false;
        return users.values().stream()
                .anyMatch(u -> username.equalsIgnoreCase(u.getUsername()));
    }

    public boolean existsByEmail(String email) {
        if (email == null) return false;
        return users.values().stream()
                .anyMatch(u -> email.equalsIgnoreCase(u.getEmail()));
    }

    public long count() {
        return users.size();
    }
}
