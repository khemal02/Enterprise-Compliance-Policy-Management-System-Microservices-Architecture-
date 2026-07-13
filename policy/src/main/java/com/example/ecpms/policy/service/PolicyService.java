package com.example.ecpms.policy.service;

import org.springframework.data.domain.Page;

import com.example.ecpms.policy.dto.PolicyRequest;
import com.example.ecpms.policy.dto.PolicyResponse;

public interface PolicyService {

	    PolicyResponse createPolicy(PolicyRequest request);

	    Page<PolicyResponse> getAllPolicies(int page, int size);
	    
	    PolicyResponse getPolicyById(Long id);
	    
	    PolicyResponse updatePolicy(Long id, PolicyRequest request);
	    
	    PolicyResponse activatePolicy(Long id);

	    void deletePolicy(Long id);

		

}
