package com.example.ecpms.approval.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ecpms.approval.dto.NotificationRequest;

@FeignClient(name = "notification-service", path = "/notification")
public interface NotificationClient {

	  @PostMapping
	    void sendNotification(@RequestBody NotificationRequest request);
}
