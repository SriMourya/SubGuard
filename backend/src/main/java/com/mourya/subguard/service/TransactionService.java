package com.mourya.subguard.service;

import com.mourya.subguard.entity.Subscription;
import com.mourya.subguard.entity.Transaction;
import com.mourya.subguard.entity.User;
import com.mourya.subguard.exception.DuplicateTransactionException;
import com.mourya.subguard.service.SubscriptionService;
import com.mourya.subguard.repository.SubscriptionRepository;
import com.mourya.subguard.repository.TransactionRepository;
import com.mourya.subguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    // Add transaction
    public Transaction addTransaction(Long userId, Transaction transaction) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        transaction.setUser(user);

        boolean exists = transactionRepository
                .existsByDateAndAmountAndMerchantAndUser(
                        transaction.getDate(),
                        transaction.getAmount(),
                        transaction.getMerchant(),
                        user
                );
        if (exists) {
            throw new DuplicateTransactionException("Duplicate transaction detected");
        }

        // STEP 1: Save transaction FIRST
        Transaction savedTransaction = transactionRepository.save(transaction);

        // STEP 2: ADD YOUR SUBSCRIPTION LOGIC HERE

        Subscription sub = subscriptionRepository
                .findByServiceNameAndUser(transaction.getMerchant(), user)
                .orElse(null);

        if (sub == null) {
            sub = new Subscription();
            sub.setServiceName(transaction.getMerchant());
            sub.setAmount(transaction.getAmount());
            sub.setUser(user);
            sub.setSource("AUTO");
        }

        sub.setLastPaymentDate(transaction.getDate());
        sub.setNextBillingDate(transaction.getDate().plusDays(30));
        sub.setBillingCycle("MONTHLY");
        sub.setStatus("ACTIVE");

        subscriptionRepository.save(sub);

        // STEP 3: Return transaction
        return savedTransaction;
    }
    //for processing csv files
    public void processCSV(MultipartFile file, Long userId) {

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            String line;

            // skip header
            reader.readLine();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            while ((line = reader.readLine()) != null) {

                if (line.trim().isEmpty()) continue;

                String[] data = line.split(",");

                if (data.length < 3) continue;

                Transaction transaction = new Transaction();

                transaction.setDate(LocalDate.parse(data[0].trim()));
                transaction.setAmount(Double.parseDouble(data[1].trim()));
                transaction.setMerchant(data[2].trim());
                transaction.setUser(user);

                boolean exists = transactionRepository
                        .existsByDateAndAmountAndMerchantAndUser(
                                transaction.getDate(),
                                transaction.getAmount(),
                                transaction.getMerchant(),
                                user
                        );

                if (!exists) {
                    transactionRepository.save(transaction);
                } else {
                    System.out.println("Duplicate skipped: " + transaction.getMerchant());
                }
            }

            // AUTO DETECT SUBSCRIPTIONS
            subscriptionService.detectSubscriptions(userId);

        } catch (Exception e) {
            throw new RuntimeException("Error processing CSV file", e);
        }
    }


    // Get all transactions of user
    public List<Transaction> getTransactions(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUser(user);
    }
}