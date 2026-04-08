package com.example.ecpms.policy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyResponse {


	private Long id;
    private String policyCode;
    private String policyName;
    private String description;
    private Integer version;
    private String status;
}
