package com.example.ecpms.audit.dto;

import lombok.Data;

@Data
public class AuditRequest {

	private String action;
    private String performedBy;
    private String serviceName;
    private String details;

}
