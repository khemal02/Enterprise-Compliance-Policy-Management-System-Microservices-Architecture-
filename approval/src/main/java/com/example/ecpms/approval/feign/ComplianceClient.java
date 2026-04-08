package com.example.ecpms.approval.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.ecpms.approval.dto.ComplianceResponse;

@FeignClient(name = "compliance-service", path = "/compliance")
public interface ComplianceClient {

	 @GetMapping("/{id}")
	    ComplianceResponse getComplianceById(@PathVariable("id") Long id);
}
