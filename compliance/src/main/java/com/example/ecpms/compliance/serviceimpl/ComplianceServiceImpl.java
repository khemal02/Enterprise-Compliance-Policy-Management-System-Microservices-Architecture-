package com.example.ecpms.compliance.serviceimpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ecpms.compliance.dto.ComplianceRequest;
import com.example.ecpms.compliance.dto.ComplianceResponse;
import com.example.ecpms.compliance.dto.EmployeeResponse;
import com.example.ecpms.compliance.dto.PolicyResponse;
import com.example.ecpms.compliance.feign.AuditClient;
import com.example.ecpms.compliance.feign.EmployeeClient;
import com.example.ecpms.compliance.feign.PolicyClient;
import com.example.ecpms.compliance.model.Compliance;
import com.example.ecpms.compliance.repository.ComplianceRepository;
import com.example.ecpms.compliance.service.ComplianceService;

@Service
public class ComplianceServiceImpl implements ComplianceService {

	 private final ComplianceRepository complianceRepository;
	 private final PolicyClient policyClient;
	 private final EmployeeClient employeeClient;
	 private final AuditClient auditClient;
	 
	 public ComplianceServiceImpl(ComplianceRepository complianceRepository,PolicyClient policyClient,
			                             EmployeeClient employeeClient,AuditClient auditClient) {
	       this.complianceRepository = complianceRepository;
	       this.policyClient = policyClient;
	       this.employeeClient= employeeClient;
	       this.auditClient= auditClient;
	    }

	    @Override
	    public ComplianceResponse createCompliance(ComplianceRequest request) {

	    	 EmployeeResponse employee = employeeClient.getEmployeeById(request.getEmployeeId());

	    	    if (employee == null) {
	    	        throw new RuntimeException("Employee not found");
	    	    }
	    	    
	    	 PolicyResponse policy = policyClient.getPolicyById(request.getPolicyId());

	    	    if (policy == null) {
	    	        throw new RuntimeException("Policy not found");
	    	    }
	    	    
	        Compliance compliance = Compliance.builder()
	                .employeeId(request.getEmployeeId())
	                .policyId(request.getPolicyId())
	                .remarks(request.getRemarks())
	                .status("PENDING")
	                .build();
	        
	        Compliance saved = complianceRepository.save(compliance);
	        
	        auditClient.log(
	                com.example.ecpms.compliance.dto.AuditRequest.builder()
	                        .action("CREATE_COMPLIANCE")
	                        .performedBy(String.valueOf(request.getEmployeeId()))
	                        .serviceName("compliance-service")
	                        .details("Compliance created with id: " + saved.getId())
	                        .build()
	        );

	        return mapToResponse(saved);
	    }

	    @Override
	    public ComplianceResponse getComplianceById(Long id) {
	        Compliance compliance = complianceRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Compliance not found"));
	        return mapToResponse(compliance);
	    }

	    @Override
	    public List<ComplianceResponse> getAllCompliances() {
	        return complianceRepository.findAll()
	                .stream()
	                .map(this::mapToResponse)
	                .collect(Collectors.toList());
	    }

	    @Override
	    public ComplianceResponse updateStatus(Long id, String status) {
	        Compliance compliance = complianceRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Compliance not found"));
	        compliance.setStatus(status);
	        Compliance updated = complianceRepository.save(compliance);
	        
	        auditClient.log(
	                com.example.ecpms.compliance.dto.AuditRequest.builder()
	                        .action("UPDATE_COMPLIANCE")
	                        .performedBy(String.valueOf(compliance.getEmployeeId()))
	                        .serviceName("compliance-service")
	                        .details("Compliance status updated to: " + status)
	                        .build()
	        );
	        
	        return mapToResponse(updated);
	    }

	    @Override
	    public void deleteCompliance(Long id) {
	    	complianceRepository.deleteById(id);
	    	
	    	auditClient.log(
	                com.example.ecpms.compliance.dto.AuditRequest.builder()
	                        .action("DELETE_COMPLIANCE")
	                        .performedBy("SYSTEM")
	                        .serviceName("compliance-service")
	                        .details("Compliance deleted with id: " + id)
	                        .build()
	        );
	    }

	    //Mapping Method
	    private ComplianceResponse mapToResponse(Compliance compliance) {
	        return ComplianceResponse.builder()
	                .id(compliance.getId())
	                .employeeId(compliance.getEmployeeId())
	                .policyId(compliance.getPolicyId())
	                .status(compliance.getStatus())
	                .remarks(compliance.getRemarks())
	                .build();
	    }
}
