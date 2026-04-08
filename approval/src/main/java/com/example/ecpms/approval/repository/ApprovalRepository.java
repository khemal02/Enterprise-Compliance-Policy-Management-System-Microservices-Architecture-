package com.example.ecpms.approval.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecpms.approval.model.Approval;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long>{

}
