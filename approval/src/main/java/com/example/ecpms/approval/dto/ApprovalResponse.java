package com.example.ecpms.approval.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApprovalResponse {

	private Long id;
    private Long complianceId;
    private Long approverId;
    private String status;
    private String remarks;
}
