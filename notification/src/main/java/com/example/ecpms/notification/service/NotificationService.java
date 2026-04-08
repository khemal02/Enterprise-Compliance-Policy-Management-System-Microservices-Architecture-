package com.example.ecpms.notification.service;

import java.util.List;

import com.example.ecpms.notification.dto.NotificationRequest;
import com.example.ecpms.notification.dto.NotificationResponse;

public interface NotificationService {


    NotificationResponse createNotification(NotificationRequest request);

    NotificationResponse getNotification(Long id);

    List<NotificationResponse> getAllNotifications();
}
