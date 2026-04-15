package com.mourya.subguard.service;

import com.mourya.subguard.entity.Subscription;
import com.mourya.subguard.entity.User;
import com.mourya.subguard.repository.SubscriptionRepository;
import com.mourya.subguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;


    public Subscription addManualSubscription(Long userId, Subscription sub) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        sub.setUser(user);
        sub.setStatus("ACTIVE");
        sub.setSource("MANUAL");

        return subscriptionRepository.save(sub);
    }

    //find all subs
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    //Get all subscriptions
    public List<Subscription> getSubscriptions(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findByUser(user);
    }


    public void updateUsageStatus() {

        List<Subscription> subs = subscriptionRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Subscription sub : subs) {

            long days = ChronoUnit.DAYS.between(sub.getLastPaymentDate(), today);

            if (days <= 30) {
                sub.setStatus("ACTIVE");
            } else if (days <= 60) {
                sub.setStatus("POSSIBLY_UNUSED");
            } else {
                sub.setStatus("LIKELY_UNUSED");
            }

            subscriptionRepository.save(sub);
        }
    }


}