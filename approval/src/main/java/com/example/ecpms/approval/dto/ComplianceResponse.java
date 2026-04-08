package com.example.ecpms.approval.dto;

import lombok.Data;

@Data
public class ComplianceResponse {

	private Long id;
    private Long employeeId;
    private Long policyId;
    private String status;
    private String remarks;
}
