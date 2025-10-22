# 🔗 Webhook Queue Manager

A production‑ready **Webhook Queue Manager** that decouples applications by managing webhook events through a reliable queue system.  

Webhooks are powerful, but they tightly couple two applications: if the destination is down, the source fails. This project solves that by introducing a **queue manager** that sits in between. It ensures events are captured, retried, and delivered reliably — while giving you a full admin panel to monitor and control the flow.

---

## ✨ Features

- **Decoupling**: Source applications don’t need to worry about destination availability.
- **Admin Panel**: Configure sources, destinations, and projects with ease.
- **Replay Events**: Re‑trigger failed or completed events manually.
- **Delivery Tracking**: Inspect every delivery attempt, including response status, body, and timing.
- **Scalable Architecture**: Built with Node.js, TypeScript, React, BullMQ, and Redis.
- **Deployment Ready**: Includes `docker-compose.yml` for quick setup.

---

## 📸 Screenshots

### Dashboard
- View **event statistics**, **delivery details**, and **graphs/cards**.
- Configurable widgets for monitoring system health.

![Dashboard Screenshot](/screenshots/dashboard.png)

---

### Project Page
- Create and delete projects.
- Visualize events and destinations on a **canvas with nodes**.
- Change **priority of events and destinations** interactively.

![Project Screenshot](/screenshots/project.png)
![Project Screenshot](/screenshots/project-edit.png)

---

### Sources Page
- Manage webhook **sources**.
- Configure authentication, tokens, and URL paths.

![Sources Screenshot](/screenshots/sources.png)

---

### Destinations Page
- Manage webhook **destinations**.
- Add additional delivery details (headers, retry policies, etc.).

![Destinations Screenshot](/screenshots/destinations.png)

---

### Events Page
- Inspect all events received.
- Drill down into **event details** and **delivery attempts**.
- Replay events with a single click.

![Events Screenshot](/screenshots/events.png)
![Events Screenshot](/screenshots/events-view.png)

---

## 🏗️ Project Structure

The repository is split into two independent directories:

/frontend → React + TypeScript admin panel 

/backend → Node.js + TypeScript API server


This separation allows independent development and deployment of frontend and backend.

---

## ⚡ Getting Started

### Prerequisites
- **Node.js v22**
- **npm** or **yarn**
- **Redis** (for queue management)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohammedmarvan/webhook-queue-manager.git
   cd webhook-queue-manager
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   npm run dev
   ```

### 🚀 Deployment

1. Ensure Docker and Docker Compose are installed.
2. Run:
   ```bash
   docker-compose up -d
   ```
3. Access the admin panel at http://localhost:3000.

---

### 🛠️ Tech Stack

Frontend: React, TypeScript, TailwindCSS, shadcn/ui

Backend: Node.js, TypeScript, Prisma, Express

Queue: BullMQ + Redis

Database: PostgreSQL (via Prisma ORM)

Deployment: Docker, docker-compose

---

### 🙌 Acknowledgements

This project was built to solve a common pain point developers face when working with webhooks: tight coupling between services. With the Webhook Queue Manager, you can finally decouple, monitor, and control your webhook flows with confidence.
