package com.mourya.subguard.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class DetectionConsumerService {

    private final SubscriptionService subscriptionService;

    public DetectionConsumerService(
            SubscriptionService subscriptionService) {

        this.subscriptionService = subscriptionService;
    }

//    @KafkaListener(
//            topics = "transactions-uploaded",
//            groupId = "detection-group")
    public void consume(String message) {

        System.out.println("DETECTION EVENT: " + message);

        Long userId = Long.parseLong(message);

        subscriptionService.detectSubscriptions(userId);

        System.out.println("Detection completed");
    }
}