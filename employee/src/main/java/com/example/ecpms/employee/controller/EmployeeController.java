package com.example.ecpms.employee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.employee.dto.CreateEmployeeRequest;
import com.example.ecpms.employee.dto.EmployeeResponse;
import com.example.ecpms.employee.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {


	private final EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
	    this.employeeService = employeeService;
	}
	
    @PostMapping
    public ResponseEntity<EmployeeResponse> create(@RequestBody CreateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> update(@PathVariable Long id,@RequestBody CreateEmployeeRequest request) {

        return ResponseEntity.ok(employeeService.updateEmployee(id, request));

    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployee(id));
    }
    
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<EmployeeResponse>> getByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(employeeService.getEmployeesByManager(managerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
    	employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
