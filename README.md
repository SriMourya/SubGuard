# SubGuard 

SubGuard is a full-stack subscription tracking and recurring payment detection system that helps users monitor and manage their subscriptions intelligently.

The platform analyzes uploaded transaction history (CSV) and automatically detects recurring payments such as Netflix, Spotify, Amazon Prime, and other subscription-based services using transaction pattern analysis and recurring payment heuristics.

---

# Live Demo

https://sub-guard-delta.vercel.app


---

# Features

## Authentication
- JWT-based authentication
- Secure login & signup
- Secure API communication using JWT tokens

---

## Transaction Management
- Upload bank transaction CSV files
- Store and manage transactions
- Duplicate transaction prevention
- Manual transaction support

---

## Smart Subscription Detection
- Automatic recurring payment detection
- Monthly and yearly subscription support
- Flexible billing cycle tolerance (28–32 days)
- False-positive prevention logic
- Dynamic subscription generation from transaction history

---

## Subscription Management
- View detected subscriptions
- Add subscriptions manually
- Delete subscriptions
- Active/Inactive status tracking
- Upcoming billing date tracking

---

## Automation
- Scheduled subscription status updates
- Email reminders before billing dates
- Automated recurring analysis

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
- JWT-based authentication for secure API communication

---

# Tech Stack

## Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- PostgreSQL
- Maven
- Docker

---

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

---

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

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

```text
 ┌──────────────┐        HTTPS + JWT        ┌───────────────┐
 │   Frontend   │ ───────────────────────▶ │    Backend    │
 │   Next.js    │ ◀─────────────────────── │ Spring Boot   │
 └──────────────┘       JSON Response       └──────┬────────┘
                                                    │
                                                    │ SQL Queries
                                                    ▼
                                            ┌───────────────┐
                                            │ PostgreSQL DB │
                                            └───────────────┘
```

---

# Screenshots

## Login Page
<img width="1899" height="832" alt="image" src="https://github.com/user-attachments/assets/4e3c4737-678e-4f86-86f9-4a40ef24d1c4" />


## Dashboard
<img width="1896" height="825" alt="image" src="https://github.com/user-attachments/assets/37494c11-baa7-4fae-8ee5-51f79ac2e185" />

## CSV Upload
<img width="1876" height="840" alt="image" src="https://github.com/user-attachments/assets/811473b3-6d40-42ed-9265-7868c0de635e" />


## Add Subscription Page
<img width="1899" height="838" alt="image" src="https://github.com/user-attachments/assets/c4246685-eb92-4cee-93f7-286941e5398c" />

<img width="1912" height="853" alt="image" src="https://github.com/user-attachments/assets/7759a43f-e37b-4205-9e17-4195d71b1640" />

<img width="549" height="795" alt="image" src="https://github.com/user-attachments/assets/aa4733bd-e6ed-4066-a23e-2430b04dece5" />

<img width="1676" height="767" alt="image" src="https://github.com/user-attachments/assets/c4ae152b-8d50-4d19-a7af-256e7bf1ac4d" />


---

# Local Setup

## Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

# Environment Variables

## Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Backend (application.properties)

```properties
spring.datasource.url=YOUR_DB_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_APP_PASSWORD

jwt.secret=YOUR_SECRET_KEY
```

---

# Future Enhancements

- OAuth2 / Google Authentication
- Kafka-based event-driven transaction processing
- Redis caching for faster subscription retrieval
- AI-based subscription prediction and categorization
- Real-time notification system using WebSockets
- Kubernetes deployment support
- Microservices architecture for scalable transaction processing

---

# Key Highlight

SubGuard dynamically derives subscriptions from transaction history using recurring payment heuristics instead of relying on manually maintained subscription records.

