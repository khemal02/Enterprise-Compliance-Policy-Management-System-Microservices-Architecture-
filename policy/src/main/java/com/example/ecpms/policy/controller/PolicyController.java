package com.example.ecpms.policy.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecpms.policy.dto.PolicyRequest;
import com.example.ecpms.policy.dto.PolicyResponse;
import com.example.ecpms.policy.service.PolicyService;

@RestController
@RequestMapping("/policy")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    // Create Policy
    @PostMapping
    public ResponseEntity<PolicyResponse> create(@RequestBody PolicyRequest request) {
        return ResponseEntity.ok(policyService.createPolicy(request));
    }

    // Get All Policies
    @GetMapping
    public ResponseEntity<Page<PolicyResponse>> getAllPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(policyService.getAllPolicies(page, size));
    }

    // Get Policy By Id
    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    // Update Policy
    @PutMapping("/{id}")
    public ResponseEntity<PolicyResponse> update(
            @PathVariable Long id,
            @RequestBody PolicyRequest request) {

        return ResponseEntity.ok(policyService.updatePolicy(id, request));
    }

    // Activate Policy
    @PutMapping("/{id}/activate")
    public ResponseEntity<PolicyResponse> activate(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.activatePolicy(id));
    }

    // Delete Policy
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}