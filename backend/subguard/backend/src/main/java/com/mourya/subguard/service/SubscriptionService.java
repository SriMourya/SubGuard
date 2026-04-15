package com.mourya.subguard.service;

import com.mourya.subguard.entity.Subscription;
import com.mourya.subguard.entity.User;
import com.mourya.subguard.repository.TransactionRepository;
import com.mourya.subguard.repository.SubscriptionRepository;
import com.mourya.subguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.mourya.subguard.entity.Transaction;


import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public void detectSubscriptions(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions = transactionRepository.findByUser(user);

        // group by merchant
        Map<String, List<Transaction>> grouped =
                transactions.stream()
                        .collect(Collectors.groupingBy(Transaction::getMerchant));

        for (String merchant : grouped.keySet()) {

            List<Transaction> txns = grouped.get(merchant);

            // only consider if recurring (at least 2 transactions)
            if (txns.size() < 2) continue;

            double amount = txns.get(0).getAmount();

            // check if already exists
            boolean exists = subscriptionRepository
                    .existsByServiceNameAndAmountAndUser(merchant, amount, user);

            if (!exists) {

                Subscription sub = new Subscription();
                sub.setServiceName(merchant);
                sub.setAmount(amount);
                sub.setUser(user);
                sub.setStatus("ACTIVE");
                sub.setSource("AUTO");

                sub.setLastPaymentDate(
                        txns.get(txns.size() - 1).getDate()
                );

                sub.setNextBillingDate(
                        sub.getLastPaymentDate().plusMonths(1)
                );

                subscriptionRepository.save(sub);

                System.out.println("Detected subscription: " + merchant);
            }
        }
    }


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

    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
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