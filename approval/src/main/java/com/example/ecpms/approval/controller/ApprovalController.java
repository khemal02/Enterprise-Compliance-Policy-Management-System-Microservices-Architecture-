package com.example.ecpms.approval.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.approval.dto.ApprovalRequest;
import com.example.ecpms.approval.dto.ApprovalResponse;
import com.example.ecpms.approval.service.ApprovalService;

@RestController
@RequestMapping("/approval")
public class ApprovalController {

	 private final ApprovalService approvalService;

	    public ApprovalController(ApprovalService approvalService) {
	        this.approvalService = approvalService;
	    }

	    @PostMapping
	    public ApprovalResponse create(@RequestBody ApprovalRequest request) {
	        return approvalService.createApproval(request);
	    }

	    @PutMapping("/{id}/approve")
	    public ApprovalResponse approve(@PathVariable Long id) {
	        return approvalService.approve(id);
	    }

	    @PutMapping("/{id}/reject")
	    public ApprovalResponse reject(@PathVariable Long id) {
	        return approvalService.reject(id);
	    }
	    
	    @GetMapping("/{id}")
	    public ApprovalResponse get(@PathVariable Long id) {
	        return approvalService.getApproval(id);
	    }

	    @GetMapping
	    public List<ApprovalResponse> getAll() {
	        return approvalService.getAllApprovals();
	    }
}
