🚀 Enterprise Compliance & Policy Management System (ECPMS)

📌 Overview
   A scalable microservices-based backend system built using Spring Boot and Spring Cloud to manage compliance, approvals,
  authentication, and audit tracking in an enterprise environment.

🏗️ Architecture
Microservices Architecture
API Gateway for centralized routing
Service Discovery using Eureka
Inter-service communication using OpenFeign
Each service independently deployable

⚙️ Tech Stack
Backend: Java, Spring Boot, Spring Cloud
Security: JWT Authentication, Role-Based Access Control (RBAC)
Database: MySQL, Spring Data JPA (Hibernate)
DevOps & Tools:Git, Postman, Swagger

🔧 Microservices Included
🔐 Auth Service – User registration, login, JWT authentication
📋 Compliance Service – Manage compliance records and status
✅ Approval Service – Approval workflows (approve/reject)
📝 Audit Service – Tracks system actions and logs
🔔 Notification Service – Handles notifications (extendable)
🌐 API Gateway – Central entry point for all services

🔄 Key Features
✔️ Secure authentication using JWT
✔️ Role-Based Access Control (ADMIN / USER)
✔️ Dynamic service registration with Eureka
✔️ Centralized routing via API Gateway
✔️ Inter-service communication using OpenFeign
✔️ Audit logging for tracking system activities
✔️ Scalable and loosely coupled architecture

🚀 Getting Started
  Prerequisites
    .Java 21+
    .MySQL
    .Maven
  Run Steps
   1.Start Eureka Server
   2. Start all microservices:
      .Auth Service
      .Employee Service
      .Compliance Service
      .policy Service
      .Approval Service
      .Audit Service
      .Notification Service
   3. Start API Gateway
   4. Access APIs via:
          http://localhost:8080

🧪 Testing
    .Use Postman or Swagger UI for API testing
    .Validate JWT tokens for secured endpoints
    
🛠️ Challenges Solved
     .Fixed service discovery & DNS resolution issues
     .Handled inter-service communication failures
     .Designed resilient microservices architecture
