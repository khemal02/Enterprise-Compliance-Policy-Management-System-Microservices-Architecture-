package com.example.ecpms.approval.service;

import java.util.List;

import com.example.ecpms.approval.dto.ApprovalRequest;
import com.example.ecpms.approval.dto.ApprovalResponse;

public interface ApprovalService {

	 ApprovalResponse createApproval(ApprovalRequest request);

	    ApprovalResponse approve(Long id);

	    ApprovalResponse reject(Long id);

	    ApprovalResponse getApproval(Long id);

	    List<ApprovalResponse> getAllApprovals();
}
