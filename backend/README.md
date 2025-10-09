# Webhook Queue Manager Service (Backend)

## 📖 Description

The **Webhook Queue Manager Service** is responsible for managing all webhook workflows in a project.  
It provides a reliable and scalable backend for:

1. **Creation** – registering new webhook events and destinations
2. **Processing events** – queueing and delivering events to destinations
3. **Updating** – managing event and destination states
4. **Logging** – tracking deliveries, retries, and failures

This service is built with **Node.js v22** and **TypeScript**, leveraging Redis and queues for robust event delivery.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 22](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A running **PostgreSQL** database
- A running **Redis** instance

---

### 🔧 Setup & Run

1. Copy the environment sample file:
   ```bash
   cp .env-sample .env
   npm install
   npm run dev
   ```

### 🧹 Code Quality

Before committing code, ensure formatting is correct:

1. Check formatting:

```bash
npm run format:check
```

2. Automatically format code:

```bash
npm run format
```

---

### 📂 Tech Stack

**Node.js 22**

**TypeScript**

**Redis (queue management)**

**PostgreSQL (persistent storage)**

---

### 📝 Notes

Jobs are processed asynchronously using queues for reliability.

Retries and backoff strategies are configurable per destination.

Logging is centralised for observability and debugging.
