package com.mourya.subguard.controller;


import com.mourya.subguard.service.UserService;
import com.mourya.subguard.entity.User;
import com.mourya.subguard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")   // this creates /users endpoint
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE USER
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

//    @PostMapping
//    public String createUser(@RequestBody User user) {
//
//        return "Working";
//
//    }

//    // GET USER BY ID
//    @GetMapping("/{id}")
//    public User getUser(@PathVariable Long id) {
//        return userService.getUserById(id);
//    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        try {
            return userService.getUserById(id);
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            return null;
        }
    }
}