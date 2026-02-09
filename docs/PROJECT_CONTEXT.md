# PROJECT_CONTEXT.md

**CIS 453 – Model Project (Food Delivery Application)**

---

## 1. Project Overview

**Project Name:** Food Delivery Web Application (Model Project)

This project is a **browser-based food delivery application** developed as part of the CIS 453 Model Project. The goal of the project is to apply the **Software Development Life Cycle (SDLC)** by planning, designing, and prototyping a realistic but scoped-down system.

The application allows customers to browse restaurants, place food orders, and track order status. Restaurants can manage menus and incoming orders. An administrator role is included to manage restaurants and system-level functionality.

The emphasis of this project is on **process, system decomposition, and architectural decisions**, not on building a production-ready system.

---

## 2. Scope Definition

### In Scope

* Customer browsing of restaurants and menus
* Order placement with **simulated payment**
* Order status tracking
* Restaurant order management
* Restaurant menu management
* Admin oversight of restaurants and users
* Role-based access control
* Browser-based user interface

### Out of Scope

* Delivery driver application
* Real-time GPS routing or navigation
* Real-world payment processing (Stripe, PayPal, etc.)
* Mobile-native applications (iOS/Android)
* External restaurant data ingestion
* SMS/email notifications

Delivery is **simulated** using order status transitions rather than a driver system.

---

## 3. Actors / Roles

The system supports the following user roles:

* **Customer**

  * Browses restaurants and menus
  * Places food orders
  * Simulates payment
  * Views order status and order history

* **Restaurant**

  * Manages menu items
  * Views incoming orders
  * Updates order status (Placed → Accepted → Preparing → Ready → Completed)

* **Administrator**

  * Creates and manages restaurant profiles
  * Creates restaurant user accounts
  * Views users and restaurants
  * Enables or disables restaurants

All roles use a **shared authentication system** with role-based permissions.

---

## 4. Location & Service Area Assumptions

* The system is scoped to a **Syracuse service area**.
* Restaurant data is **seeded** manually for the prototype.
* Each restaurant has a stored latitude and longitude.
* The application may optionally use **browser geolocation** to:

  * Estimate distance between the user and restaurants
  * Sort restaurants by proximity
* If a user denies location access, restaurants are still displayed without distance information.

No real-time tracking or mapping is implemented.

---

## 5. Technology Stack (Finalized)

### Frontend

* **React**
* Runs in the browser
* Responsible for UI, routing, and user interactions

### Backend

* **Node.js + Express**
* Provides REST API endpoints
* Handles authentication, business logic, and database access

### Database

* **SQLite**
* File-based database stored on the backend server
* Persists data across server restarts
* Used for users, restaurants, menus, and orders

Users do **not** connect to the database directly; all access occurs through the backend API.

---

## 6. Data Persistence Model

* The Express backend opens and manages a SQLite database file (e.g., `app.db`)
* All create/update actions (orders, menus, users) write to this file
* As long as the file remains, data persists across restarts
* This approach is sufficient and appropriate for a prototype-scale system

---

## 7. Development Approach

* Incremental and iterative development
* Core functionality implemented first
* Features refined as time permits
* Emphasis on alignment between:

  * Requirements
  * Design
  * Implementation

---

## 8. Current Project Status

* **Week 1:** Completed

  * Initial Plan
  * Requirements Document
  * Technology Stack Justification

* **Week 2:** In Progress

  * System Design
  * UML Diagrams
  * Mapping requirements to design decisions

---

## 9. Explicit Design Constraints

* No driver-related features or workflows
* No real payment validation
* No production-scale performance guarantees
* Prototype-level UI and functionality only

---

## 10. Instructions for Continuation

This document should be treated as the **authoritative source of truth** for:

* Project scope
* Architectural decisions
* Technology choices
* Explicit exclusions

Future work should **not reintroduce** excluded features such as drivers, GPS routing, or real payment systems.
