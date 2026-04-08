package com.example.ecpms.compliance.service;

import java.util.List;

import com.example.ecpms.compliance.dto.ComplianceRequest;
import com.example.ecpms.compliance.dto.ComplianceResponse;

public interface ComplianceService {

	ComplianceResponse createCompliance(ComplianceRequest request);

    ComplianceResponse getComplianceById(Long id);

    List<ComplianceResponse> getAllCompliances();

    ComplianceResponse updateStatus(Long id, String status);

    void deleteCompliance(Long id);
}
