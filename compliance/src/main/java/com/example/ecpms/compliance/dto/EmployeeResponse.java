package com.example.ecpms.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeResponse {

	private Long id;
    private String employeeCode;
    private String name;
    private String email;
    private String department;
    private Long managerId;
}
