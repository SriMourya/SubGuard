package com.mourya.subguard.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String message) {
        kafkaTemplate.send("transactions-uploaded", message);

        System.out.println("MESSAGE SENT: " + message);
    }

    public void sendNotificationEvent(String message) {

        kafkaTemplate.send(
                "subscription-events",
                message);

        System.out.println(
                "NOTIFICATION EVENT SENT: " + message);
    }
}