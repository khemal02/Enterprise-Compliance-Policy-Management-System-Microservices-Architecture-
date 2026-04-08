package com.example.ecpms.employee.dto;

import lombok.Data;

@Data
public class CreateEmployeeRequest {

	private String employeeCode;
    private String name;
    private String email;
    private String department;
    private Long managerId;
}
