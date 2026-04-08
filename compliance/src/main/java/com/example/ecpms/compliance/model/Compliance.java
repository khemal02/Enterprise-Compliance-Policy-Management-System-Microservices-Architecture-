package com.example.ecpms.compliance.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Compliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;

    private Long policyId;;

    private String status;   // PENDING / APPROVED / REJECTED

    private String remarks;
}