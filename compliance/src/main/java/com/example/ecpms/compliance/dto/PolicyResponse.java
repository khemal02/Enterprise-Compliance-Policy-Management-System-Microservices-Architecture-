package com.example.ecpms.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyResponse {

	    private Long id;
	    private String policyCode;
	    private String policyName;
	    private String description;
	    private int version;
	    private String status;
}
