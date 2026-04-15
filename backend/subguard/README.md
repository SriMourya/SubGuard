# SubGuard – Subscription Tracker Backend

SubGuard is a Spring Boot backend application that helps users track and manage their subscriptions by analyzing transaction data. It supports automatic detection of recurring payments, manual subscription management, and email reminders before billing dates.

---

## Features

* Upload transactions using CSV files
* Add transactions manually
* Detect subscriptions based on transaction patterns (monthly and yearly)
* Automatically update subscriptions from new transactions
* Manual subscription creation
* Email reminders before upcoming billing dates
* Subscription status tracking (ACTIVE, INACTIVE, CANCELLED)

---

## Edge Cases Covered

* Duplicate subscriptions are prevented using service name, amount, and user-based identification
* Monthly billing detection allows a tolerance range (28–32 days) to handle slight variations
* One-time transactions are ignored by requiring multiple occurrences for detection
* Subscriptions with insufficient transaction history are not falsely classified
* Inactive subscriptions are identified based on lack of recent transactions
* CSV upload validation ensures malformed or incomplete rows are safely skipped
* Multiple subscriptions from the same service (with different amounts) are handled separately

---

## Tech Stack

* Java 21
* Spring Boot
* Spring Data JPA
* PostgreSQL
* Lombok
* Maven

---

## API Endpoints

### User

* POST /users

### Transactions

* POST /transactions/{userId}
* POST /transactions/upload/{userId}
* GET /transactions/{userId}
* DELETE /transactions/{transactionId}

### Subscription

* GET /subscriptions/{userId}
* POST /subscriptions/manual/{userId}

### Detection

* POST /transactions/detect/{userId}

---

## Scheduler

* Runs daily to check upcoming billing dates
* Sends email reminders 3 days before the next billing date

---

## Core Concept

Transactions are treated as the source of truth, and subscriptions are derived dynamically based on transaction patterns and heuristics such as frequency and recency.

---

## Future Improvements

* Frontend dashboard (React or Next.js)
* Authentication and user login
* Subscription analytics (monthly spending insights)
* Notification preferences (email, SMS)

