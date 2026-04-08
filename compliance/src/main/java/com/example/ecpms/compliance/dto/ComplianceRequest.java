package com.example.ecpms.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComplianceRequest {

	 private Long employeeId;
	 private Long policyId;
	 private String remarks;
}
