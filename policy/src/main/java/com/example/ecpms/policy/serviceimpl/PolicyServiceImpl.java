package com.example.ecpms.policy.serviceimpl;

import java.time.LocalDateTime;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ecpms.policy.dto.PolicyRequest;
import com.example.ecpms.policy.dto.PolicyResponse;
import com.example.ecpms.policy.feign.AuditClient;
import com.example.ecpms.policy.model.Policy;
import com.example.ecpms.policy.model.PolicyStatus;
import com.example.ecpms.policy.repository.PolicyRepository;
import com.example.ecpms.policy.service.PolicyService;

@Service
public class PolicyServiceImpl implements PolicyService {
   
	 private final PolicyRepository policyRepository;
	 private final AuditClient auditClient;

	    public PolicyServiceImpl(PolicyRepository policyRepository,AuditClient auditClient) {
	        this.policyRepository = policyRepository;
	        this.auditClient = auditClient;
	    }

	    @Override
	    public PolicyResponse createPolicy(PolicyRequest request) {

	        Policy policy = new Policy();
	        policy.setPolicyCode("POL-" + UUID.randomUUID().toString().substring(0, 6));
	        policy.setPolicyName(request.getPolicyName());
	        policy.setDescription(request.getDescription());
	        policy.setVersion(1);
	        policy.setStatus(PolicyStatus.DRAFT);
	        policy.setEffectiveDate(request.getEffectiveDate());
	        policy.setExpiryDate(request.getExpiryDate());
	        policy.setCreatedAt(LocalDateTime.now());

	        Policy saved = policyRepository.save(policy);

	        // Audit log
	        try {
	            auditClient.log(
	                    com.example.ecpms.policy.dto.AuditRequest.builder()
	                            .action("CREATE_POLICY")
	                            .performedBy("ADMIN")
	                            .serviceName("policy-service")
	                            .details("Policy created with code: " + saved.getPolicyCode())
	                            .build()
	            );
	        } catch (Exception e) {
	            System.out.println("Audit failed: " + e.getMessage());
	        }

	        return mapToResponse(saved);
	    }
	    
	    @Override
	    public PolicyResponse getPolicyById(Long id) {
                  Policy policy = policyRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Policy not found with id: "+ id));
              return mapToResponse(policy);
	    }
	    
	    @Override
	    public Page<PolicyResponse> getAllPolicies(int page, int size) {

	        Pageable pageable = PageRequest.of(page, size);

	        return policyRepository.findAll(pageable)
	                .map(this::mapToResponse);
	    }

	    @Override
	    public PolicyResponse activatePolicy(Long id) {

	        Policy policy = policyRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Policy not found with id: "+ id));

	        policy.setStatus(PolicyStatus.ACTIVE);
	        policy.setVersion(policy.getVersion() + 1);
	        policy.setUpdatedAt(LocalDateTime.now());

	        Policy updated = policyRepository.save(policy);

	        //Audit Log
	        try {
	            auditClient.log(
	                    com.example.ecpms.policy.dto.AuditRequest.builder()
	                            .action("ACTIVATE_POLICY")
	                            .performedBy("ADMIN")
	                            .serviceName("policy-service")
	                            .details("Policy activated with code: " + updated.getPolicyCode())
	                            .build()
	            );
	        } catch (Exception e) {
	            System.out.println("Audit failed: " + e.getMessage());
	        }

	        return mapToResponse(updated);
	    }

	    private PolicyResponse mapToResponse(Policy policy) {
	        return new PolicyResponse(
	                policy.getId(),
	                policy.getPolicyCode(),
	                policy.getPolicyName(),
	                policy.getDescription(),
	                policy.getVersion(),
	                policy.getStatus().name()
	        );
	    }
	    
	    @Override
	    public void deletePolicy(Long id) {

	        Policy policy = policyRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Policy not found with id: "+ id));

	        policyRepository.delete(policy);
	        
	     //Audit Log
	        try {
	            auditClient.log(
	                    com.example.ecpms.policy.dto.AuditRequest.builder()
	                            .action("DELETE_POLICY")
	                            .performedBy("ADMIN")
	                            .serviceName("policy-service")
	                            .details("Policy deleted with id: " + id)
	                            .build()
	            );
	        } catch (Exception e) {
	            System.out.println("Audit failed: " + e.getMessage());
	        }
	    }
}
