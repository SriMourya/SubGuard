package com.mourya.subguard.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

//    @KafkaListener(
//            topics = "transactions-uploaded",
//            groupId = "subguard-group")
    public void consume(String message) {

        System.out.println("MESSAGE RECEIVED: " + message);
    }
}