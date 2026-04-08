package com.example.ecpms.audit.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuditResponse {

	    private Long id;
	    private String action;
	    private String performedBy;
	    private String serviceName;
	    private LocalDateTime timestamp;
	    private String details;
		
}
