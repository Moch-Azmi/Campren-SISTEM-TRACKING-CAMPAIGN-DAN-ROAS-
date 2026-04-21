package com.example.controller;

import com.example.model.Pelanggan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import com.example.repository.PelangganRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // VERY IMPORTANT (allow frontend)
public class AuthController {

    @Autowired
    private PelangganRepository userRepository;

    @PostMapping("/login")
public String login(@RequestBody Pelanggan loginRequest) {

    System.out.println("Input email: " + loginRequest.getEmail());
    System.out.println("Input password: " + loginRequest.getPassword());

    Optional<Pelanggan> user = userRepository.findByEmail(loginRequest.getEmail());

    if (user.isPresent()) {
        System.out.println("Database password: " + user.get().getPassword());
    } else {
        System.out.println("User not found in database.");
    }

    if (user.isPresent() &&
        user.get().getPassword().equals(loginRequest.getPassword())) {
        return "registered";
    }

    return "not registered";
    }
    
}