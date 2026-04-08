package com.example.ecpms.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecpms.notification.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
