package com.mourya.subguard.repository;

import com.mourya.subguard.entity.Subscription;
import com.mourya.subguard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUser(User user);

    Optional<Subscription> findByServiceNameAndUser(String serviceName, User user);

    boolean existsByServiceNameAndUser(String serviceName, User user);

    boolean existsByServiceNameAndAmountAndUser(
            String serviceName,
            double amount,
            User user
    );
}