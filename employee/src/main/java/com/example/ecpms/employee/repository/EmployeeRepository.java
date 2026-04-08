package com.example.ecpms.employee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecpms.employee.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>{
     
	 Optional<Employee> findByEmployeeCode(String employeeCode);

	    List<Employee> findByManagerId(Long managerId);
}
