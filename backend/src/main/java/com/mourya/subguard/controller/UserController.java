package com.mourya.subguard.controller;


import com.mourya.subguard.service.UserService;
import com.mourya.subguard.entity.User;
import com.mourya.subguard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mourya.subguard.dtos.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "*")
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
//    @PostMapping("/login")
//    public User login(@RequestBody LoginRequest request) {
//
//        User user = userService.findByEmail(request.getEmail());
////        System.out.println("INPUT EMAIL: " + request.getEmail());
////        System.out.println("INPUT PASSWORD: " + request.getPassword());
////
////        User user = userService.findByEmail(request.getEmail());
////
////        System.out.println("DB USER: " + user);
////
////        if (user != null) {
////            System.out.println("DB PASSWORD: " + user.getPassword());
////        }
//
//        if (user != null && user.getPassword() != null
//                && user.getPassword().equals(request.getPassword())) {
//            return user; // contains id
//        } else {
//            throw new RuntimeException("Invalid credentials");
//        }
//    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {

        try {
            String token = userService.login(request);
            return ResponseEntity.ok(token);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }
    }

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