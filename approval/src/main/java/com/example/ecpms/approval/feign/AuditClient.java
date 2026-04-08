package com.example.ecpms.approval.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ecpms.approval.dto.AuditRequest;

@FeignClient(name = "audit-service", path = "/audit")
public interface AuditClient {

     @PostMapping
	    void log(@RequestBody AuditRequest request);
}
