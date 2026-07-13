package com.example.ecpms.employee.service;

import java.util.List;

import com.example.ecpms.employee.dto.CreateEmployeeRequest;
import com.example.ecpms.employee.dto.EmployeeResponse;

public interface EmployeeService {

	
	EmployeeResponse createEmployee(CreateEmployeeRequest request);
	
	EmployeeResponse updateEmployee(Long id,CreateEmployeeRequest request);

    EmployeeResponse getEmployee(Long id);
	
	List<EmployeeResponse> getAllEmployees(); 

	List<EmployeeResponse> getEmployeesByManager(Long managerId);

	void deleteEmployee(Long id);

	
	

}
