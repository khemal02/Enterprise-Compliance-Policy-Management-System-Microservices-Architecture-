package com.example.ecpms.employee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.employee.dto.CreateEmployeeRequest;
import com.example.ecpms.employee.dto.EmployeeResponse;
import com.example.ecpms.employee.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {


	private final EmployeeService service;

	public EmployeeController(EmployeeService service) {
	    this.service = service;
	}
	
    @PostMapping
    public ResponseEntity<EmployeeResponse> create(@RequestBody CreateEmployeeRequest request) {
        return ResponseEntity.ok(service.createEmployee(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEmployee(id));
    }
    
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<EmployeeResponse>> getByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(service.getEmployeesByManager(managerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteEmployee(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
