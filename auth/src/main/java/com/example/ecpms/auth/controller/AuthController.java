package com.example.ecpms.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.auth.dto.LoginRequest;
import com.example.ecpms.auth.dto.LoginResponse;
import com.example.ecpms.auth.dto.RegisterRequest;
import com.example.ecpms.auth.model.User;
import com.example.ecpms.auth.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	 @Autowired
	    private AuthService authService;

	    @PostMapping("/register")
	    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
	        authService.register(request);
	        return ResponseEntity.ok("User registered successfully");
	    }

	    @PostMapping("/login")
	    public ResponseEntity<LoginResponse> login(
	            @RequestBody LoginRequest request) {
	        return ResponseEntity.ok(authService.login(request));
	    }

	    @GetMapping("/profile")
	    public ResponseEntity<User> profile() {
	        return ResponseEntity.ok(authService.getCurrentUser());
	    }

	    @PutMapping("/change-password")
	    public ResponseEntity<String> changePassword(
	            @RequestParam String password) {
	        authService.changePassword(password);
	        return ResponseEntity.ok("Password updated");
	    }

	    @GetMapping("/validate")
	    public ResponseEntity<Boolean> validate(
	            @RequestParam String token) {
	        return ResponseEntity.ok(authService.validateToken(token));
	    }
}
