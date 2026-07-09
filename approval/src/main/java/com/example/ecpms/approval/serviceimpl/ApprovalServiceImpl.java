package com.example.ecpms.approval.serviceimpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ecpms.approval.dto.ApprovalRequest;
import com.example.ecpms.approval.dto.ApprovalResponse;
import com.example.ecpms.approval.dto.AuditRequest;
import com.example.ecpms.approval.dto.ComplianceResponse;
import com.example.ecpms.approval.dto.NotificationRequest;
import com.example.ecpms.approval.feign.AuditClient;
import com.example.ecpms.approval.feign.ComplianceClient;
import com.example.ecpms.approval.feign.NotificationClient;
import com.example.ecpms.approval.model.Approval;
import com.example.ecpms.approval.repository.ApprovalRepository;
import com.example.ecpms.approval.service.ApprovalService;

import lombok.AllArgsConstructor;

@Service
public class ApprovalServiceImpl implements ApprovalService{

	 private final ApprovalRepository approvalRepository;
	 private final NotificationClient notificationClient;
	 private final ComplianceClient complianceClient;
	 private final AuditClient auditClient;

	    public ApprovalServiceImpl(ApprovalRepository approvalRepository,
	    		             NotificationClient notificationClient, 
	    		             ComplianceClient complianceClient,AuditClient auditClient) {
	        this.approvalRepository = approvalRepository;
	        this.notificationClient = notificationClient;
	        this.complianceClient = complianceClient;
	        this.auditClient = auditClient;
	    }

	    @Override
	    public ApprovalResponse createApproval(ApprovalRequest request) {

	        Approval approval = Approval.builder()
	                .complianceId(request.getComplianceId())
	                .approverId(request.getApproverId())
	                .remarks(request.getRemarks())
	                .status("PENDING")
	                .build();

	        return map(approvalRepository.save(approval));
	    }

	
	   @Override
	    public ApprovalResponse approve(Long id) {
	        Approval approval = getEntity(id);
	        
	        ComplianceResponse compliance =
	                complianceClient.getComplianceById(approval.getComplianceId());

	        if (compliance == null) {
	            throw new RuntimeException("Compliance not found");
	        }
	        approval.setStatus("APPROVED");
	        Approval saved = approvalRepository.save(approval);
	        
	     //Call Notification Service (Feign)
	        notificationClient.sendNotification(
	                NotificationRequest.builder()
	                        .userId(approval.getApproverId())
	                        .title("Compliance Approved")
	                        .message("Your compliance request has been approved")
	                        .type("APPROVAL")
	                        .build()
	        );
	        
	        auditClient.log(
	                AuditRequest.builder()
	                        .action("APPROVE_COMPLIANCE")
	                        .performedBy(String.valueOf(approval.getApproverId()))
	                        .serviceName("approval-service")
	                        .details("Compliance approved with id: " + approval.getComplianceId())
	                        .build()
	        );
	        return map(saved);
	    }

	    @Override
	    public ApprovalResponse reject(Long id) {
	        Approval approval = getEntity(id);
	        
	        ComplianceResponse compliance =
	                complianceClient.getComplianceById(approval.getComplianceId());

	        if (compliance == null) {
	            throw new RuntimeException("Compliance not found");
	        }
	        approval.setStatus("REJECTED");
	        Approval saved = approvalRepository.save(approval);
	     
	     //Call Notification Service (Feign)
	        notificationClient.sendNotification(
	                NotificationRequest.builder()
	                        .userId(approval.getApproverId())
	                        .title("Compliance Rejected")
	                        .message("Your compliance request has been rejected")
	                        .type("REJECTION")
	                        .build()
	        );
	        
	     //Audit Log
	        auditClient.log(
	                AuditRequest.builder()
	                        .action("REJECT_COMPLIANCE")
	                        .performedBy(String.valueOf(approval.getApproverId()))
	                        .serviceName("approval-service")
	                        .details("Compliance rejected with id: " + approval.getComplianceId())
	                        .build()
	        );  
	        return map(saved);
	    }

	    @Override
	    public ApprovalResponse getApproval(Long id) {
	        return map(getEntity(id));
	    }
	
        @Override
        public List<ApprovalResponse> getAllApprovals() {
           return approvalRepository.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
        }

        private Approval getEntity(Long id) {
            return approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found with id: " + id));
       }

       private ApprovalResponse map(Approval approval) {
            return ApprovalResponse.builder()
	                .id(approval.getId())
	                .complianceId(approval.getComplianceId())
	                .approverId(approval.getApproverId())
	                .status(approval.getStatus())
	                .remarks(approval.getRemarks())
	                .build();
    }
}
