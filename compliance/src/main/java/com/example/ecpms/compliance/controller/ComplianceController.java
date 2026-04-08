package com.example.ecpms.compliance.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.compliance.dto.ComplianceRequest;
import com.example.ecpms.compliance.dto.ComplianceResponse;
import com.example.ecpms.compliance.service.ComplianceService;

@RestController
@RequestMapping("/compliance")
public class ComplianceController {

	private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @PostMapping
    public ComplianceResponse create(@RequestBody ComplianceRequest request) {
        return complianceService.createCompliance(request);
    }

    @GetMapping("/{id}")
    public ComplianceResponse getById(@PathVariable Long id) {
        return complianceService.getComplianceById(id);
    }

    @GetMapping
    public List<ComplianceResponse> getAll() {
        return complianceService.getAllCompliances();
    }
    
    @PutMapping("/{id}/status")
    public ComplianceResponse updateStatus(@PathVariable Long id, @RequestParam String status) {
        return complianceService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
    	complianceService.deleteCompliance(id);
    }
}
