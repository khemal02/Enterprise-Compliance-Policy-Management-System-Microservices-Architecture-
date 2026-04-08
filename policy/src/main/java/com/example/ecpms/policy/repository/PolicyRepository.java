package com.example.ecpms.policy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecpms.policy.model.Policy;
import com.example.ecpms.policy.model.PolicyStatus;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

	 Optional<Policy> findByPolicyCode(String policyCode);

	    Page<Policy> findByStatus(PolicyStatus status, Pageable pageable);
}
