package com.example.ecpms.notification.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ecpms.notification.dto.NotificationRequest;
import com.example.ecpms.notification.dto.NotificationResponse;
import com.example.ecpms.notification.feign.AuditClient;
import com.example.ecpms.notification.model.Notification;
import com.example.ecpms.notification.repository.NotificationRepository;
import com.example.ecpms.notification.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService{

	private final NotificationRepository notificationRepository;
	private final AuditClient auditClient; 

    public NotificationServiceImpl(NotificationRepository notificationRepository, AuditClient auditClient) {
        this.notificationRepository = notificationRepository;
        this.auditClient= auditClient;
    }
    
    @Override
    public NotificationResponse createNotification(NotificationRequest request) {

        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .sent(true)
                .createdAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);

        //Audit Log
        auditClient.log(
                com.example.ecpms.notification.dto.AuditRequest.builder()
                        .action("SEND_NOTIFICATION")
                        .performedBy(String.valueOf(saved.getUserId()))
                        .serviceName("notification-service")
                        .details("Notification sent with title: " + saved.getTitle())
                        .build()
        );

        return map(saved);
    }

    @Override
    public NotificationResponse getNotification(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        return map(notification);
    }
    
    @Override
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    private NotificationResponse map(Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .sent(notification.isSent())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
