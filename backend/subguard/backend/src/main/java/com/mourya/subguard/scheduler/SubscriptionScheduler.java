package com.mourya.subguard.scheduler;

import com.mourya.subguard.entity.Subscription;
import com.mourya.subguard.repository.SubscriptionRepository;
import com.mourya.subguard.service.EmailService;
import com.mourya.subguard.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class SubscriptionScheduler {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 9 * * ?") // daily at 9 AM
    public void checkUpcomingPayments() {

        List<Subscription> subs = subscriptionService.getAllSubscriptions();
        LocalDate today = LocalDate.now();

        for (Subscription sub : subs) {

            if (sub.getNextBillingDate() == null) continue;

            long daysLeft = ChronoUnit.DAYS.between(today, sub.getNextBillingDate());

            if (daysLeft == 3) {

                String email = sub.getUser().getEmail(); //  dynamic

                String subject = "Subscription Reminder";

                String body = "Hi " + sub.getUser().getName() + ",\n\n" +
                        "Your subscription for " + sub.getServiceName() +
                        " will renew in 3 days.\n" +
                        "Amount: ₹" + sub.getAmount() + "\n\n" +
                        "Please review if you still want to continue.\n\n" +
                        "Thanks,\nSubGuard Team";

                emailService.sendEmail(email, subject, body);

                System.out.println("Reminder sent: " + sub.getServiceName());
            }
        }
    }
}