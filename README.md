# ExpenseFlow - MERN Stack Expense & Budget Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed for personal finance and consumer expense management.

---

## 🌟 Features

### Consumer Role Capabilities
- **Expenses**: Add, view, edit, and delete daily expenditures with categorization and date tracking.
- **Income**: Track earnings across multiple income sources (salary, freelance, investments, etc.).
- **Categories**: Dynamic category management for personalized transaction categorization.
- **Budgets**: Set monthly spending limits per category and track utilization.
- **Reports & Dashboard**:
  - Real-time summary cards for Total Income, Total Expenses, and Net Balance / Savings.
  - Interactive **Budget vs Actual** monthly spending comparison with visual progress bars and budget status badges (`Within Budget` / `Over Budget`).
  - Category-wise spending breakdown with percentage distributions.

---

## 🏗️ Project Architecture

```
MERNSTACKPROJECT/
├── backend/
│   ├── models/             # Mongoose database models
│   │   ├── User.js         # Collection: users
│   │   ├── Category.js     # Collection: categories
│   │   ├── Transaction.js  # Collection: transactions (Expenses & Income)
│   │   └── Budget.js       # Collection: budgets
│   ├── routes/             # Modular Express routers
│   │   ├── authRoutes.js   # User registration and login
│   │   ├── categoryRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── reportRoutes.js
│   ├── utils/
│   │   └── getNextId.js    # Auto-incrementing numeric ID generator
│   ├── index.js            # Main backend server & MongoDB connection
│   └── package.json
│
├── frontend/               # Vite + React Modern SaaS Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx        # Split-screen Login & Register
│   │   │   ├── Reports.jsx     # Dashboard analytics & budget comparison
│   │   │   ├── Expenses.jsx    # Expenses CRUD
│   │   │   ├── Income.jsx      # Income CRUD
│   │   │   ├── Categories.jsx  # Categories CRUD
│   │   │   └── Budgets.jsx     # Monthly Budgets CRUD
│   │   ├── App.jsx             # Sidebar, topbar, and tab navigation
│   │   ├── App.css             # Modern SaaS design system
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🗄️ Database Schema & Collections

| Collection | Schema | Purpose |
| :--- | :--- | :--- |
| **`users`** | `userId` (Number), `username` (String), `passwordHash` (String) | User accounts & authentication |
| **`categories`** | `categoryId` (Number), `categoryName` (String), `userId` (Number) | Custom spending categories |
| **`transactions`** | `id` (Number), `category` (String), `amount` (Number), `type` ("expense" / "income"), `date`, `description`, `userId` | Unified transaction records |
| **`budgets`** | `id` (Number), `category` (String), `month` (String `YYYY-MM`), `amount` (Number), `userId` | Monthly spending caps |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Compass](https://www.mongodb.com/products/compass) or local MongoDB instance running on `localhost:27017`

### 1. Backend Setup
```bash
cd backend
npm install
node index.js
```
The backend server runs on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open the frontend in your browser at `http://localhost:5173` or `http://localhost:5174`.

---

## 📡 API Endpoints

- **Health Check**: `GET /health`
- **Auth**: `POST /register`, `POST /login`
- **Categories**: `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
- **Expenses**: `GET /expenses`, `POST /expenses`, `PUT /expenses/:id`, `DELETE /expenses/:id`
- **Income**: `GET /income`, `POST /income`, `PUT /income/:id`, `DELETE /income/:id`
- **Budgets**: `GET /budgets`, `POST /budgets`, `PUT /budgets/:id`, `DELETE /budgets/:id`
- **Reports**: `GET /reports/summary`, `GET /reports/budget-comparison?month=YYYY-MM`

---

## 📄 License
ISC License
