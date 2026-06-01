# SubGuard

SubGuard is a full-stack subscription tracking platform that helps users identify, monitor, and manage recurring subscriptions from transaction data.

---
## Problem Statement

Many users unknowingly spend money on subscriptions they no longer use because recurring payments are scattered across bank statements and difficult to track manually. Existing banking applications often provide limited visibility into subscription spending, making it easy to miss upcoming renewals, duplicate subscriptions, or unnecessary recurring charges.

As the number of subscription-based services continues to grow, users need a simple way to identify recurring payments, monitor subscription expenses, and receive timely reminders before billing dates.

---
## Solution

SubGuard addresses this problem by analyzing transaction history and automatically detecting recurring payments using transaction pattern analysis and recurring payment heuristics. The platform converts raw transaction data into actionable subscription insights by identifying recurring charges, tracking active subscriptions, visualizing spending trends, and sending automated reminders before upcoming billing cycles.

Using an event-driven architecture powered by Apache Kafka, SubGuard processes transactions asynchronously, enabling scalable subscription detection, automated notifications, and intelligent subscription management.

---
# Live Demo

Frontend: https://sub-guard-delta.vercel.app

> Note: The backend is hosted on Render free tier and may take a few seconds to respond on the first request due to cold-start behavior.

---

# Features

## Authentication
- Secure JWT-based authentication and authorization
- Secure login & signup
- Protected frontend routes using session storage
- Secure API communication using Bearer tokens

---

## Transaction Management
- Upload bank transaction CSV files
- Store and manage transactions
- Duplicate transaction prevention
- Manual transaction support
- Dynamic transaction processing

---

## Smart Subscription Detection
- Automatic recurring payment detection
- Monthly and yearly subscription support
- Flexible billing cycle tolerance (28–32 days)
- False-positive prevention logic
- Dynamic subscription generation from transaction history
- Recurring payment heuristic analysis

---

## Subscription Management
- View detected subscriptions
- Add subscriptions manually
- Delete subscriptions
- Active/Inactive subscription tracking
- Upcoming billing date tracking

---

## Analytics Dashboard
- Monthly and yearly subscription insights
- Interactive charts using Recharts
- Spending visualization dashboard
- Subscription breakdown analytics

---

## Automation & Notifications
- Daily scheduled subscription status updates at 9:00 AM
- Automated recurring analysis
- Email reminders before billing dates
- Kafka-based asynchronous event processing
- Event-driven notification workflows
- Async subscription detection pipeline

---

# Event-Driven Workflow

SubGuard uses Apache Kafka for asynchronous event-driven processing.

Workflow:

1. User uploads transaction CSV
2. Backend publishes Kafka event
3. Kafka consumers process transaction events asynchronously
4. Subscription detection service analyzes recurring payments
5. Notification consumer triggers email alerts
6. Scheduler manages recurring reminder workflows

Kafka is deployed locally using Docker Compose.

---

# Detection Logic

SubGuard treats transactions as the source of truth and derives subscriptions dynamically using recurring transaction pattern analysis.

The detection engine analyzes:

- Transaction frequency
- Merchant/service similarity
- Amount consistency
- Billing intervals
- Transaction recency

This helps identify recurring subscriptions while avoiding one-time payments.

---

# Edge Cases Handled

- Duplicate subscription prevention
- Invalid CSV row handling
- Multiple subscriptions from same service
- Flexible billing cycle handling
- Insufficient recurring pattern filtering
- JWT-secured API communication
- Duplicate transaction prevention
- Async event handling using Kafka

---

# Tech Stack

## Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- PostgreSQL
- Apache Kafka
- Spring Kafka
- Maven
- Docker
- Docker Compose

---

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

---

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL
- Kafka: Docker Compose (Local)

---

# API Endpoints

## Authentication & Users

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Register user |
| POST | `/users/login` | Login user |

---

## Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions/upload/{userId}` | Upload transaction CSV |
| GET | `/transactions/{userId}` | Get transactions |
| POST | `/transactions/detect/{userId}` | Detect recurring subscriptions |

---

## Subscriptions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/subscriptions/{userId}` | Get subscriptions |
| POST | `/subscriptions/manual/{userId}` | Add manual subscription |
| DELETE | `/subscriptions/{id}` | Delete subscription |

---

# Project Architecture

## Architecture Diagram

<img width="1600" height="845" alt="image" src="https://github.com/user-attachments/assets/058f40e1-8622-4783-9b00-400290121ccb" />


# Screenshots

## Login Page

<p align="center">
 <img width="1911" height="845" alt="image" src="https://github.com/user-attachments/assets/91aa742c-b64c-4f2a-890c-cc3062b2197a" />

</p>

---

## Dashboard

<p align="center">
  <img width="1851" height="836" alt="image" src="https://github.com/user-attachments/assets/52d170e8-2498-4ce2-80c9-c1ea0b99c25e" />

</p>

---

## CSV Upload

<p align="center">
  <img width="1746" height="691" alt="image" src="https://github.com/user-attachments/assets/9a308427-72a4-4836-9133-2a2f82b2cec9" />
</p>

---

## Add Subscription Page

<p align="center">
  <img width="1892" height="821" alt="image" src="https://github.com/user-attachments/assets/9f3ee84b-af10-4c7d-a34c-b806203b70f4" />
</p>

---

## Analytics

<p align="center">
  "<img width="1912" height="739" alt="image" src="https://github.com/user-attachments/assets/a8a2ac3b-60a2-420b-80ba-7a18bc27d1ab" />

</p>

---

# Local Setup
# Docker & Kafka Setup

Kafka and Zookeeper are deployed locally using Docker Compose.

## Start Kafka Services

```bash
docker compose up -d
```

## Verify Running Containers

```bash
docker ps
```

This starts:
- Apache Kafka
- Zookeeper

used for asynchronous event-driven transaction processing.

---

## Important Note

Kafka consumers are enabled using `@KafkaListener`.

If you want to run Kafka workflows locally:
- ensure Docker containers are running
- ensure Kafka listeners are uncommented in the backend controllers/services

Example:

```java
kafkaProducerService.sendMessage(userId.toString());

kafkaProducerService.sendNotificationEvent(userId.toString());
```

Kafka listeners handle:
- asynchronous transaction processing
- subscription detection events
- notification workflows
- email event handling
