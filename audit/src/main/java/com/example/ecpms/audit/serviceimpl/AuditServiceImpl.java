package com.example.ecpms.audit.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ecpms.audit.dto.AuditRequest;
import com.example.ecpms.audit.dto.AuditResponse;
import com.example.ecpms.audit.model.AuditLog;
import com.example.ecpms.audit.repository.AuditRepository;
import com.example.ecpms.audit.service.AuditService;

@Service
public class AuditServiceImpl implements AuditService {

	 private final AuditRepository auditRepository;

	    public AuditServiceImpl(AuditRepository auditRepository) {
	        this.auditRepository = auditRepository;
	    }
	    
	    @Override
	    public AuditResponse createAudit(AuditRequest request) {

	        AuditLog log = new AuditLog();
	        log.setAction(request.getAction());
	        log.setPerformedBy(request.getPerformedBy());
	        log.setServiceName(request.getServiceName());
	        log.setDetails(request.getDetails());
	        log.setTimestamp(LocalDateTime.now());

	        return map(auditRepository.save(log));
	    }
	    
	    @Override
	    public List<AuditResponse> getAllAudits() {

	        return auditRepository.findAll()
	                .stream()
	                .map(this::map)
	                .collect(Collectors.toList());
	    }
	    
	    @Override
	    public AuditResponse getAuditById(Long id) {

	        AuditLog log = auditRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Audit not found"));

	        return map(log);
	    }
	    
	    private AuditResponse map(AuditLog log) {

	        AuditResponse res = new AuditResponse();
	        res.setId(log.getId());
	        res.setAction(log.getAction());
	        res.setPerformedBy(log.getPerformedBy());
	        res.setServiceName(log.getServiceName());
	        res.setTimestamp(log.getTimestamp());
	        res.setDetails(log.getDetails());

	        return res;
	    }
}
