package com.mourya.subguard.repository;

import com.mourya.subguard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (very important for real apps)
    Optional<User> findByEmail(String email);
}