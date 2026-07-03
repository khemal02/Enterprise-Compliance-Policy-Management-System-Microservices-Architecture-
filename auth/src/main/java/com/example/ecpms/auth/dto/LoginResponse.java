package com.example.ecpms.auth.dto;

import lombok.Data;

@Data
public class LoginResponse {
   
	
	private String token;
    private String role;
}
