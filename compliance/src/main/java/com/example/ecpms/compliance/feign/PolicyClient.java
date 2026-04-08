package com.example.ecpms.compliance.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.ecpms.compliance.dto.PolicyResponse;

@FeignClient(name = "policy-service",path = "/policy")
public interface PolicyClient {

	 @GetMapping("/{id}")
	  PolicyResponse getPolicyById(@PathVariable("id") Long id);
}
