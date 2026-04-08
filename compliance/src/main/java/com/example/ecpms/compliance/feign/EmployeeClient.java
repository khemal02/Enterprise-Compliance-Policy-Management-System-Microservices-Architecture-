package com.example.ecpms.compliance.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.ecpms.compliance.dto.EmployeeResponse;

@FeignClient(name = "employee-service", path = "/employee")
public interface EmployeeClient {

	@GetMapping("/{id}")
    EmployeeResponse getEmployeeById(@PathVariable("id") Long id);
}
