# SubGuard 

## Overview
SubGuard is a full-stack subscription tracking system that analyzes transaction data (CSV) to automatically detect recurring subscriptions and help users manage their expenses.

The system identifies patterns in transaction history to detect subscriptions such as Netflix, Spotify, etc., and provides insights into active and inactive services.

---

## Features

### Transaction Management
- Upload transaction data via CSV
- Add transactions manually
- Duplicate transaction prevention

### Subscription Detection
- Automatic detection of recurring subscriptions
- Supports monthly and yearly billing cycles
- Handles real-world variations (28–32 day billing tolerance)
- Ignores one-time transactions

### Subscription Management
- View subscriptions with status:
  - ACTIVE
  - INACTIVE
  - CANCELLED
- Delete subscriptions
- Manual subscription creation

###  Smart Logic
- Uses transaction patterns (frequency + recency)
- Prevents false positives
- Handles multiple subscriptions from same service

### Automation
- Daily scheduler updates subscription status
- Email reminders before billing dates

---

## How It Works

1. User uploads CSV transaction data  
2. Transactions are stored in PostgreSQL  
3. System analyzes recurring patterns  
4. Subscriptions are automatically generated  
5. Frontend dashboard displays results  

---

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS

---

## 📡 API Endpoints

### User
- `POST /users`

### Transactions
- `POST /transactions/{userId}`
- `POST /transactions/upload/{userId}`
- `GET /transactions/{userId}`

### Subscriptions
- `GET /subscriptions/{userId}`
- `POST /subscriptions/manual/{userId}`
- `DELETE /subscriptions/{id}`

### Detection
- `POST /transactions/detect/{userId}`

---

## Edge Cases Handled

- Duplicate subscriptions avoided using service + amount + user
- Billing cycle tolerance (28–32 days)
- Multiple subscriptions for same service supported
- Invalid CSV rows safely ignored
- Insufficient data not falsely classified

---

## Future Improvements

- User authentication (login/signup)
- Analytics dashboard (monthly spending)
- Notification preferences (email/SMS)
- Improved UI/UX

---

##  Screenshots




<img width="1896" height="854" alt="Screenshot 2026-04-16 114326" src="https://github.com/user-attachments/assets/ca12e869-ee9b-4f9e-a46b-63746556d88c" />



---

##  Key Highlight

SubGuard treats **transactions as the source of truth** and derives subscriptions dynamically using pattern detection and heuristics.

---
