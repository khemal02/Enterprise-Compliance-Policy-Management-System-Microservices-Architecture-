package com.example.ecpms.audit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecpms.audit.model.AuditLog;

@Repository
public interface AuditRepository extends JpaRepository<AuditLog, Long>{

}
