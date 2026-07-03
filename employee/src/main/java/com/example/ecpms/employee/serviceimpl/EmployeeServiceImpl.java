package com.example.ecpms.employee.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ecpms.employee.dto.AuditRequest;
import com.example.ecpms.employee.dto.CreateEmployeeRequest;
import com.example.ecpms.employee.dto.EmployeeResponse;
import com.example.ecpms.employee.feign.AuditClient;
import com.example.ecpms.employee.model.Employee;
import com.example.ecpms.employee.repository.EmployeeRepository;
import com.example.ecpms.employee.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {
	
	    private final EmployeeRepository repository;
	    private final AuditClient auditClient; 
	    
	    public EmployeeServiceImpl(EmployeeRepository repository,
	                               AuditClient auditClient) {
	        this.repository = repository;
	        this.auditClient = auditClient;
	    }

	    @Override
	    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {

	        Employee emp = new Employee();
	        emp.setEmployeeCode(request.getEmployeeCode());
	        emp.setName(request.getName());
	        emp.setEmail(request.getEmail());
	        emp.setDepartment(request.getDepartment());
	        emp.setManagerId(request.getManagerId());
	        emp.setCreatedAt(LocalDateTime.now());

	        Employee saved = repository.save(emp);
	        
	        //Audit Log
	        auditClient.log(
	                AuditRequest.builder()
	                        .action("CREATE_EMPLOYEE")
	                        .performedBy(saved.getEmployeeCode()) // or "ADMIN"
	                        .serviceName("employee-service")
	                        .details("Employee created with id: " + saved.getId())
	                        .build()
	        );

	        return new EmployeeResponse(
	                emp.getId(),
	                emp.getEmployeeCode(),
	                emp.getName(),
	                emp.getEmail(),
	                emp.getDepartment(),
	                emp.getManagerId()
	        );
	    }

	    @Override
	    public EmployeeResponse getEmployee(Long id) {
	        Employee emp = repository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Employee not found"));

	        return new EmployeeResponse(
	                emp.getId(),
	                emp.getEmployeeCode(),
	                emp.getName(),
	                emp.getEmail(),
	                emp.getDepartment(),
	                emp.getManagerId()
	        );
	    }
	    
	    @Override
	    public List<EmployeeResponse> getAllEmployees() {

	        return repository.findAll()
	                .stream()
	                .map(emp -> new EmployeeResponse(
	                        emp.getId(),
	                        emp.getEmployeeCode(),
	                        emp.getName(),
	                        emp.getEmail(),
	                        emp.getDepartment(),
	                        emp.getManagerId()))
	                .toList();
	    }

	    @Override
	    public List<EmployeeResponse> getEmployeesByManager(Long managerId) {
	        return repository.findByManagerId(managerId)
	                .stream()
	                .map(emp -> new EmployeeResponse(
	                        emp.getId(),
	                        emp.getEmployeeCode(),
	                        emp.getName(),
	                        emp.getEmail(),
	                        emp.getDepartment(),
	                        emp.getManagerId()))
	                .toList();
	    }

	    @Override
	    public void deleteEmployee(Long id) {
	    	
	    	repository.deleteById(id);
	    	
	    	auditClient.log(
	                AuditRequest.builder()
	                        .action("DELETE_EMPLOYEE")
	                        .performedBy("ADMIN")
	                        .serviceName("employee-service")
	                        .details("Employee deleted with id: " + id)
	                        .build()
	        );
	    }
}
