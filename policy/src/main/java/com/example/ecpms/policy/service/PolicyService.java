package com.example.ecpms.policy.service;

import org.springframework.data.domain.Page;

import com.example.ecpms.policy.dto.PolicyRequest;
import com.example.ecpms.policy.dto.PolicyResponse;

public interface PolicyService {

	    PolicyResponse createPolicy(PolicyRequest request);

	    PolicyResponse getPolicyById(Long id);

	    Page<PolicyResponse> getAllPolicies(int page, int size);

	    PolicyResponse activatePolicy(Long id);

	    void deletePolicy(Long id);

}
