package com.example.ecpms.compliance.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuditRequest {

	private String action;
    private String performedBy;
    private String serviceName;
    private String details;
}
