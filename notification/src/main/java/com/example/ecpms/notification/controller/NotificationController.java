package com.example.ecpms.notification.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecpms.notification.dto.NotificationRequest;
import com.example.ecpms.notification.dto.NotificationResponse;
import com.example.ecpms.notification.service.NotificationService;

@RestController
@RequestMapping("/notification")
public class NotificationController {

	 private final NotificationService notificationService;

	    public NotificationController(NotificationService notificationService) {
	        this.notificationService = notificationService;
	    }
	    
	    @PostMapping
	    public NotificationResponse create(@RequestBody NotificationRequest request) {
	        return notificationService.createNotification(request);
	    }

	    @GetMapping("/{id}")
	    public NotificationResponse get(@PathVariable Long id) {
	        return notificationService.getNotification(id);
	    }

	    @GetMapping
	    public List<NotificationResponse> getAll() {
	        return notificationService.getAllNotifications();
	    }
}
