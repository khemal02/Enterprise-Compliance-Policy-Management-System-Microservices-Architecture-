package com.example.ecpms.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ComplianceResponse {

	 private Long id;
	 private Long employeeId;
	 private Long policyId;
	 private String status;
	 private String remarks;
}
