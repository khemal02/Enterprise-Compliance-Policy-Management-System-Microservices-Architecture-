package com.example.ecpms.audit.service;

import java.util.List;

import com.example.ecpms.audit.dto.AuditRequest;
import com.example.ecpms.audit.dto.AuditResponse;

public interface AuditService {

	 AuditResponse createAudit(AuditRequest request);
     
	 List<AuditResponse> getAllAudits();
     
	 AuditResponse getAuditById(Long id);
}
