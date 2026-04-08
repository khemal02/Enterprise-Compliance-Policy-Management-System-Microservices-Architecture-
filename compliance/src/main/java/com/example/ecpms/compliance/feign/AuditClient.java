package com.example.ecpms.compliance.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ecpms.compliance.dto.AuditRequest;

@FeignClient(name = "audit-service", path = "/audit")
public interface AuditClient {

	@PostMapping
    void log(@RequestBody AuditRequest request);
}
