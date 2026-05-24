package com.mourya.subguard.service;

import com.mourya.subguard.entity.User;
import com.mourya.subguard.repository.UserRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumerService {

    private final EmailService emailService;
    private final UserRepository userRepository;

    public NotificationConsumerService(
            EmailService emailService,
            UserRepository userRepository) {

        this.emailService = emailService;
        this.userRepository = userRepository;
    }

//
//    @KafkaListener(
//            topics = "subscription-events",
//            groupId = "notification-group")
    public void consume(String message) {

        Long userId = Long.parseLong(message);

        User user = userRepository.findById(userId)
                .orElseThrow();

        emailService.sendEmail(
                user.getEmail(),
                "Subscription Detection Completed",
                "Hi " + user.getName() +
                        ", your subscriptions were detected successfully!"
        );

        System.out.println(
                "EMAIL SENT TO: " + user.getEmail());
    }
}