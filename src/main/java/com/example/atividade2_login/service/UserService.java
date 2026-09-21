package com.example.atividade2_login.service;

import com.example.atividade2_login.dto.RegisterDTO;
import com.example.atividade2_login.model.User;
import com.example.atividade2_login.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (userRepository.count() == 0) {
            // Conta de Administrador de exemplo
            User admin = new User(
                    null,
                    "Administrador PUC Minas",
                    "admin",
                    "admin@pucminas.br",
                    passwordEncoder.encode("puc123")
            );
            userRepository.save(admin);

            // Conta de Aluno de exemplo
            User aluno = new User(
                    null,
                    "Aluno Engenharia de Software",
                    "aluno",
                    "aluno@sga.pucminas.br",
                    passwordEncoder.encode("puc123")
            );
            userRepository.save(aluno);
        }
    }

    public User registerUser(RegisterDTO dto) {
        User user = new User();
        user.setName(dto.getName().trim());
        user.setUsername(dto.getUsername().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<User> findByUsernameOrEmail(String identifier) {
        return userRepository.findByUsernameOrEmail(identifier);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
