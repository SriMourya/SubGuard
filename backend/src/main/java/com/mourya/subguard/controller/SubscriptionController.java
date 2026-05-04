package com.mourya.subguard.controller;

import com.mourya.subguard.entity.Subscription;
import com.mourya.subguard.entity.User;
import com.mourya.subguard.service.SubscriptionService;
import com.mourya.subguard.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/{userId}")
    public String detect(@PathVariable Long userId) {

        subscriptionService.detectSubscriptions(userId);

        return "Detection completed";
    }

    @PostMapping("/manual/{userId}")
    public Subscription addManualSubscription(
            @PathVariable Long userId,
            @RequestBody Subscription sub) {

        return subscriptionService.addManualSubscription(userId, sub);
    }

    @GetMapping("/{userId}")
    public List<Subscription> getSubscriptions(@PathVariable Long userId) {
        return subscriptionService.getSubscriptions(userId);
    }

    @DeleteMapping("/{id}")
    public String deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return "Deleted successfully";
    }
}