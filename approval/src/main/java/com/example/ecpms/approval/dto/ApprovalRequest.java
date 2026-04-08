package com.example.ecpms.approval.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {

	private Long complianceId;
    private Long approverId;
    private String remarks;
}
