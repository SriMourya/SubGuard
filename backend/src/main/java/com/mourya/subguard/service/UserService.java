package com.mourya.subguard.service;

import com.mourya.subguard.entity.User;
import com.mourya.subguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mourya.subguard.dtos.LoginRequest;
import com.mourya.subguard.security.JwtUtil;
import com.mourya.subguard.dtos.LoginResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public User saveUser(User user) {

        //  Check if email already exists
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("User with this email already exists");
        });

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public LoginResponse login(LoginRequest request) {

        System.out.println("LOGIN REQUEST EMAIL: " + request.getEmail());
        System.out.println("LOGIN REQUEST PASSWORD: " + request.getPassword());

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        System.out.println("USER FROM DB: " + user);

        if (user != null) {
            System.out.println("DB PASSWORD: " + user.getPassword());
        }

        if (user != null && user.getPassword().equals(request.getPassword())) {


//            String token = jwtUtil.generateToken(user.getEmail());
//            System.out.println("TOKEN GENERATED: " + token);

            return new LoginResponse("token", user.getId());
        }

        throw new RuntimeException("Invalid credentials");
    }
}