# Pasar Antar Development Guide

## 🎯 Project Core

* **App:** Pasar Antar
* **Scope:** Backend, Frontend, API, Database Schema, Queue, Realtime, Authorization, Business Logic.
* **Constraint:** NO new features, NO business flow changes, NO payment gateway integration, NO accounting system, NO architecture changes without explicit approval.

## ⚠️ Hard Rules

* **Architecture:** Laravel Monolith ONLY.
* **Roles:** ONLY Buyer, Joki, Admin.
* **Order Lifecycle:** MUST follow approved status flow.
* **Aggregation:** Maximum 5 orders per Master Checklist.
* **Settlement:** Simple calculation ONLY (`estimated_amount`, `actual_amount`, `refund_amount`, `additional_payment`).
* **Accounting:** DO NOT implement double-entry ledger, wallet, balance sheet, journal, or accounting modules.
* **Authorization:** All sensitive actions MUST be protected by Policy and Middleware.
* **Database Integrity:** Use Foreign Keys and Transactions for critical operations.
* **Business Logic:** MUST NOT be placed in Controllers.

## 🏗️ RBAC & Access

### Buyer

* Register
* Login
* Manage profile
* Create order
* View own orders
* View settlement
* View receipts

### Joki

* Login
* View available orders
* Accept order
* View assigned orders
* Update order status
* Upload receipt
* Input actual shopping amount

### Admin

* Manage users
* Manage markets
* Monitor orders
* Monitor joki activities
* Monitor master checklists
* View activity logs

## 🗄️ Database & Logic

### Users

* id
* name
* email
* password
* role
* phone_number
* is_active

### Markets

* id
* name
* address
* is_active

### Orders

* id
* order_number
* buyer_id
* market_id
* assigned_joki_id
* status
* estimated_amount
* actual_amount
* refund_amount
* additional_payment

### Order Items

* id
* order_id
* product_name
* quantity
* notes

### Master Checklists

* id
* market_id
* assigned_joki_id
* status

### Master Checklist Items

* id
* checklist_id
* item_name
* total_quantity

### Receipts

* id
* order_id
* image_url
* uploaded_by

### Activity Logs

* id
* user_id
* action
* metadata

## 🚀 Execution Flow

### 1. Authentication

* Register
* Login
* Role Authorization

### 2. Order Creation

Buyer:

* Select market
* Create order
* Add order items
* Input estimated amount

Status:

WAITING_FOR_JOKI

### 3. Order Assignment

Joki:

* View available orders
* Accept order

Status:

ASSIGNED

### 4. Shopping

Joki starts shopping.

Status:

SHOPPING

### 5. Settlement

Joki:

* Upload receipt
* Input actual amount

System:

* Calculate refund
* Calculate additional payment

### 6. Delivery

Status:

DELIVERING

### 7. Completion

Status:

COMPLETED

### 8. Aggregation

Background Job:

* Group orders by market
* Maximum 5 orders
* Generate Master Checklist

## 📡 Realtime Rules

Events:

* OrderAssigned
* ShoppingStarted
* ReceiptUploaded
* Delivering
* Completed

Realtime MUST be implemented using Laravel Reverb.

Do NOT create custom websocket infrastructure.

## 🔒 Security Rules

* Authorization required on all protected routes.
* Buyers may access ONLY their own orders.
* Joki may access ONLY assigned orders.
* Admin has full access.
* Validate all request payloads using Form Requests.
* Never trust frontend validation.

## ⚙️ Technical Standards

### Backend

* Laravel 13
* Service Layer preferred
* Form Requests required
* Policies required
* Database Transactions for critical operations

### Frontend

* React
* Inertia.js
* TypeScript preferred
* Reusable components

### Database

* PostgreSQL
* Proper indexing
* Foreign Keys enabled

### Queue

* Redis Queue

### Realtime

* Laravel Reverb

### Deployment

* Docker Compose

## 🚫 Forbidden Changes

Do NOT introduce:

* Microservices
* Event Sourcing
* CQRS
* GraphQL
* Wallet System
* Double Entry Accounting
* Dynamic Pricing
* Multi Tenant Architecture
* Marketplace Vendor System
* Subscription System
* AI Features

Unless explicitly requested.

## ✅ Expected Output

Production-ready code.

Requirements:

* Follow existing architecture.
* Prefer modification over recreation.
* Keep code concise.
* Minimize complexity.
* Maintain consistency.
* Use existing domain language.
* Preserve business rules.
* Avoid speculative improvements.

Rules:

* Code first.
* Be concise.
* Do not explain unless asked.
* Avoid tutorials.
* Avoid unnecessary refactoring.
* Avoid changing business flow.
* Focus only on requested task.
* Minimize token usage.
