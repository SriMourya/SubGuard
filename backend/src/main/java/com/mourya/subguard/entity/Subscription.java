package com.mourya.subguard.entity;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;   // Netflix, Spotify

    private Double amount;

    private String billingCycle;  // MONTHLY / YEARLY

    private LocalDate nextBillingDate;

    private String status;  // ACTIVE / POSSIBLY_UNUSED / LIKELY_UNUSED

    private LocalDate lastPaymentDate;

    private String source; // AUTO / MANUAL


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}