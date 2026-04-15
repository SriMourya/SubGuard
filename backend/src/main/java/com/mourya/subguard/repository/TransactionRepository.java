package com.mourya.subguard.repository;

import com.mourya.subguard.entity.Transaction;
import com.mourya.subguard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Get all transactions of a user
    List<Transaction> findByUser(User user);

    // Get transactions between dates (for analysis)
    List<Transaction> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    // Get transactions by merchant (important for subscription detection)
    List<Transaction> findByUserAndMerchant(User user, String merchant);

    boolean existsByDateAndAmountAndMerchantAndUser(
            LocalDate date,
            Double amount,
            String merchant,
            User user
    );


}