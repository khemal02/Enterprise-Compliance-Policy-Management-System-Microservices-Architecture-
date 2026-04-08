package com.example.ecpms.audit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.audit.dto.AuditRequest;
import com.example.ecpms.audit.dto.AuditResponse;
import com.example.ecpms.audit.service.AuditService;

@RestController
@RequestMapping("/audit")
public class AuditController {

	private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @PostMapping
    public AuditResponse create(@RequestBody AuditRequest request) {
        return auditService.createAudit(request);
    }

    @GetMapping
    public List<AuditResponse> getAll() {
        return auditService.getAllAudits();
    }
    
    @GetMapping("/{id}")
    public AuditResponse get(@PathVariable Long id) {
        return auditService.getAuditById(id);
    }
}
