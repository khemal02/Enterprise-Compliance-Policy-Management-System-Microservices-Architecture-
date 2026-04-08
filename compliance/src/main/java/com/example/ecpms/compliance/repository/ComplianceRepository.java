package com.example.ecpms.compliance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ecpms.compliance.model.Compliance;

public interface ComplianceRepository extends JpaRepository<Compliance, Long> {

	
}
