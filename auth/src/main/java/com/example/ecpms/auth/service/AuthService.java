package com.example.ecpms.auth.service;

import com.example.ecpms.auth.dto.LoginRequest;
import com.example.ecpms.auth.dto.LoginResponse;
import com.example.ecpms.auth.dto.RegisterRequest;
import com.example.ecpms.auth.model.User;

public interface AuthService {

	void register(RegisterRequest request);

	LoginResponse login(LoginRequest request);

	User getCurrentUser();

	void changePassword(String password);
	
	boolean validateToken(String token);



}
