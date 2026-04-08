package com.example.ecpms.policy.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "policies")
@Data
public class Policy {
	

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(unique = true)
	    private String policyCode;

	    private String policyName;

	    private String description;

	    private Integer version;

	    @Enumerated(EnumType.STRING)
	    private PolicyStatus status;

	    private LocalDate effectiveDate;
	    private LocalDate expiryDate;

	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	
}
