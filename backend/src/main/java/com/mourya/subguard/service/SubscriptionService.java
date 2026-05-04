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

    public Subscription addManualSubscription(Long userId, Subscription sub) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        sub.setUser(user);
        sub.setStatus("ACTIVE");
        sub.setSource("MANUAL");

        return subscriptionRepository.save(sub);
    }
    public List<Subscription> getSubscriptions(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findByUser(user);
    }
    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public void detectSubscriptions(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions = transactionRepository.findByUser(user);

        Map<String, List<Transaction>> grouped =
                transactions.stream()
                        .collect(Collectors.groupingBy(
                                t -> t.getMerchant() + "_" + t.getAmount()
                        ));

        for (List<Transaction> txns : grouped.values()) {

            if (txns.size() < 2) continue;

            txns.sort((a, b) -> a.getDate().compareTo(b.getDate()));

            boolean isMonthly = false;
            boolean isYearly = false;

            for (int i = 1; i < txns.size(); i++) {
                long diff = ChronoUnit.DAYS.between(
                        txns.get(i - 1).getDate(),
                        txns.get(i).getDate()
                );

                if (diff >= 28 && diff <= 32) isMonthly = true;
                if (diff >= 360 && diff <= 370) isYearly = true;
            }

            if (!isMonthly && !isYearly) continue;

            String merchant = txns.get(0).getMerchant();
            double amount = txns.get(0).getAmount();

            Subscription sub = subscriptionRepository
                    .findByServiceNameAndAmountAndUser(merchant, amount, user)
                    .orElse(null);

            LocalDate lastDate = txns.get(txns.size() - 1).getDate();

            if (sub == null) {
                sub = new Subscription();
                sub.setServiceName(merchant);
                sub.setAmount(amount);
                sub.setUser(user);
                sub.setSource("AUTO");
            }

            sub.setLastPaymentDate(lastDate);


            if (isMonthly) {
                sub.setBillingCycle("MONTHLY");
                sub.setNextBillingDate(lastDate.plusDays(30));
            } else {
                sub.setBillingCycle("YEARLY");
                sub.setNextBillingDate(lastDate.plusDays(365));
            }


            subscriptionRepository.save(sub);

            updateUsageStatus();
        }
    }
    public void updateUsageStatus() {

        List<Subscription> subs = subscriptionRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Subscription sub : subs) {

            if (sub.getLastPaymentDate() == null) continue;

            long days = ChronoUnit.DAYS.between(sub.getLastPaymentDate(), today);

            if ("MONTHLY".equals(sub.getBillingCycle())) {

                if (days <= 40) {
                    sub.setStatus("ACTIVE");
                } else if (days <= 70) {
                    sub.setStatus("POSSIBLY_UNUSED");
                } else {
                    sub.setStatus("LIKELY_UNUSED");
                }

            } else if ("YEARLY".equals(sub.getBillingCycle())) {

                if (days <= 380) {
                    sub.setStatus("ACTIVE");
                } else if (days <= 420) {
                    sub.setStatus("POSSIBLY_UNUSED");
                } else {
                    sub.setStatus("LIKELY_UNUSED");
                }
            }

            subscriptionRepository.save(sub);
        }
    }


}
