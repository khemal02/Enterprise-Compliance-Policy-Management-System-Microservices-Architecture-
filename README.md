# 🚀 Enterprise Compliance & Policy Management System (ECPMS)

## 📌 Overview
A microservices-based backend built with **Spring Boot** and **Spring Cloud** that helps an organization manage its policies,
track employee compliance against those policies, and run an approval workflow — with audit logging and notifications
for every decision.

## 🏗️ Architecture
- **API Gateway** (Spring Cloud Gateway) — single entry point, routing, global CORS, aggregated Swagger UI
- **Service Discovery** (Netflix Eureka) — services register by name and are resolved via `lb://` load-balanced routes
- **Inter-service communication** via OpenFeign
- **Database per service** — each service owns its own MySQL schema
- Each service is independently deployable and containerized with Docker

```
Client ──► API Gateway (8088) ──► Eureka (8761) lookup
                │
                ├──► Auth Service
                ├──► Employee Service
                ├──► Policy Service
                ├──► Compliance Service
                ├──► Approval Service ──Feign──► Compliance / Notification / Audit
                ├──► Audit Service
                └──► Notification Service
```

## ⚙️ Tech Stack
- **Backend:** Java 21, Spring Boot 3.2, Spring Cloud (Gateway, Eureka, OpenFeign)
- **Security:** Spring Security, JWT (jjwt), BCrypt password hashing, Role-Based Access Control
- **Database:** MySQL 8, Spring Data JPA (Hibernate)
- **API Docs:** Springdoc OpenAPI / Swagger UI
- **DevOps & Tools:** Docker, Docker Compose, Maven, Git, Postman

## 🔧 Microservices

| Service | Port | Database | Responsibility |
|---|---|---|---|
| Eureka Server | 8761 | — | Service registry |
| API Gateway | 8088 | — | Routing, CORS, Swagger aggregation |
| 🔐 Auth Service | 8081 | `auth_db` | Registration, login, JWT issuance, profile, change password |
| 📝 Audit Service | 8082 | `audit_db` | Records system actions (who did what, from which service) |
| ✅ Approval Service | 8083 | `approval_db` | Approve / reject compliance records; triggers notification + audit |
| 📋 Compliance Service | 8084 | `compliance_db` | Employee ↔ policy compliance records (PENDING / APPROVED / REJECTED) |
| 👤 Employee Service | 8085 | `employee_db` | Employee records, department, manager hierarchy |
| 📜 Policy Service | 8086 | `policy_db` | Versioned policies with lifecycle (DRAFT / ACTIVE / INACTIVE / EXPIRED) |
| 🔔 Notification Service | 8087 | `notification_db` | Stores and serves user notifications |

## 👥 Roles
| Role | Access |
|---|---|
| `ADMIN` | Full access, including employee management, audit logs and deletes |
| `MANAGER` | Approve / reject compliance records |
| `EMPLOYEE` | Own profile, compliance and notifications |

## 🔄 Key Features
- ✔️ Stateless authentication using JWT (24h expiry, role carried as a token claim)
- ✔️ Role-Based Access Control (ADMIN / MANAGER / EMPLOYEE) enforced in every service
- ✔️ Dynamic service registration and client-side load balancing with Eureka
- ✔️ Centralized routing and CORS via API Gateway
- ✔️ Inter-service communication using OpenFeign
- ✔️ Audit logging for approval actions
- ✔️ Policy versioning and lifecycle management
- ✔️ Single aggregated Swagger UI for all services
- ✔️ One-command startup with Docker Compose

## 🔁 Approval Workflow
1. Admin creates a **policy** and registers **employees**
2. A **compliance record** links an employee to a policy (status `PENDING`)
3. A manager calls `PUT /approval/{id}/approve` or `PUT /approval/{id}/reject`
4. Approval Service verifies the compliance record via Feign, updates the approval status,
   sends a notification and writes an audit log entry

## 🚀 Getting Started

### Option 1 — Docker Compose (recommended)
```bash
# build the jars
cd <service> && ./mvnw clean package -DskipTests   # repeat for each service

# start everything (MySQL, Eureka, all services, Gateway)
docker-compose up --build
```
MySQL is exposed on host port `3307`; the databases are created automatically by `mysql-init/init.sql`.

### Option 2 — Run locally
**Prerequisites:** Java 21+, Maven, MySQL 8

1. Create the databases listed in `mysql-init/init.sql`
2. Start **Eureka Server**
3. Start the microservices with the `dev` profile (`SPRING_PROFILES_ACTIVE=dev`):
   Auth, Employee, Policy, Compliance, Approval, Audit, Notification
4. Start the **API Gateway**

### Access
- API Gateway: **http://localhost:8088**
- Eureka Dashboard: http://localhost:8761
- Swagger UI (aggregated): http://localhost:8088/swagger-ui.html

## 🧪 Testing
1. `POST /auth/register` → `POST /auth/login` to obtain a JWT
2. Send `Authorization: Bearer <token>` on all other requests
3. Use Postman or Swagger UI to exercise the endpoints

## 🛠️ Challenges Solved
- Fixed service discovery / DNS resolution issues between containers (Docker-specific Spring profile using service names instead of `localhost`)
- Handled inter-service communication through Feign with Eureka-based name resolution
- Designed loosely coupled services with a database-per-service approach

## 🗺️ Roadmap
- Forward JWT on Feign calls via a `RequestInterceptor`
- Sync compliance status automatically when an approval is approved / rejected
- Resilience4j circuit breakers and fallbacks for inter-service calls
- Asynchronous audit and notification events (Kafka / RabbitMQ)
- Externalized secrets (environment variables / Spring Cloud Config / Vault)
- Global exception handling, request validation, and unit / integration tests
- Distributed tracing (Micrometer Tracing + Zipkin)
