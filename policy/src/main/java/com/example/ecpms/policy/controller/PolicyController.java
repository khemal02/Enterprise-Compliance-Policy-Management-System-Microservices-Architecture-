package com.example.ecpms.policy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

	    @PostMapping
	    public ResponseEntity<PolicyResponse> create( @RequestBody PolicyRequest request) {
	        return ResponseEntity.ok(policyService.createPolicy(request));
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<PolicyResponse> getById(@PathVariable Long id) {
	        return ResponseEntity.ok(policyService.getPolicyById(id));
	    }

	    @PutMapping("/{id}/activate")
	    public ResponseEntity<PolicyResponse> activate(@PathVariable Long id) {
	        return ResponseEntity.ok(policyService.activatePolicy(id));
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> delete(@PathVariable Long id) {
	    	policyService.deletePolicy(id);
	        return ResponseEntity.noContent().build();
	    }
}
