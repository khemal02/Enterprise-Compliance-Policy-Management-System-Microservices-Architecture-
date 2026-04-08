package com.example.ecpms.policy.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PolicyRequest {

	 private String policyName;
	 private String description;
	 private LocalDate effectiveDate;
	 private LocalDate expiryDate;
}
