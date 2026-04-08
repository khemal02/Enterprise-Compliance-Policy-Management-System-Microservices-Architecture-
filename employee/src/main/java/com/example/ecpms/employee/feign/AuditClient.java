package com.example.ecpms.employee.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ecpms.employee.dto.AuditRequest;

@FeignClient(name = "audit-service", path = "/audit")
public interface AuditClient {

	 @PostMapping
	    void log(@RequestBody AuditRequest request);
}
