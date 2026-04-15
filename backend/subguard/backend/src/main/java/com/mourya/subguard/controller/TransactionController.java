package com.mourya.subguard.controller;

import com.mourya.subguard.entity.Transaction;
import com.mourya.subguard.service.TransactionService;
import com.mourya.subguard.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private SubscriptionService subscriptionService;

    // Add transaction
    @PostMapping("/{userId}")
    public Transaction addTransaction(
            @PathVariable Long userId,
            @RequestBody Transaction transaction) {

        return transactionService.addTransaction(userId, transaction);
    }

    //get transaction details from the csv file
    @PostMapping(value = "/upload/{userId}", consumes = "multipart/form-data")
    public String uploadTransactions(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long userId) {

        System.out.println(" Upload API hit");

        transactionService.processCSV(file, userId);
        return "File uploaded successfully!";
    }

//    //detect subscriptions
//    @PostMapping("/detect/{userId}")
//    public String detect(@PathVariable Long userId) {
//
//        transactionService.detectSubscriptions(userId);
//        return "Subscriptions detected!";
//    }
    @PostMapping("/detect/{userId}")
    public String detect(@PathVariable Long userId) {

        System.out.println("DETECT API HIT");

        subscriptionService.detectSubscriptions(userId);
        return "Subscriptions detected!";
    }

    // Get transactions
    @GetMapping("/{userId}")
    public List<Transaction> getTransactions(@PathVariable Long userId) {

        return transactionService.getTransactions(userId);
    }
}