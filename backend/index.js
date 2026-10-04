const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ==========================================
// 1. IMPORT MODULAR ROUTERS
// ==========================================
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ==========================================
// 2. MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ==========================================
// 3. MONGODB CONNECTION
// ==========================================
const MONGO_URI = "mongodb://127.0.0.1:27017/expense_management";

mongoose.connect(MONGO_URI)
    .then(() => console.log(" Connected to MongoDB Compass (expense_management)"))
    .catch((err) => console.error(" MongoDB connection error:", err));

// ==========================================
// 4. MOUNT ROUTES
// 4. API HEALTH CHECK ROUTE
// ==========================================
app.get("/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
        0: "Disconnected",
        1: "Connected",
        2: "Connecting",
        3: "Disconnecting"
    };

    res.status(200).json({
        status: "OK",
        message: "Expense Management Backend is healthy and running.",
        uptime: `${Math.floor(process.uptime())} seconds`,
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatusMap[dbState] || "Unknown",
            name: mongoose.connection.name || "expense_management",
            host: "127.0.0.1:27017"
        }
    });
});

// ==========================================
// 5. MOUNT ROUTES
// ==========================================
// Authentication (Register & Login - No Password Hashing)
app.use("/", authRoutes);

// A. Categories (Add / List / Edit / Delete)
app.use("/categories", categoryRoutes);

// B. Expenses (Add / List / Edit / Delete)
app.use("/expenses", expenseRoutes);

// C. Income (Add / List / Edit / Delete)
app.use("/income", incomeRoutes);

// D. Budgets (Add / List / Edit / Delete)
app.use("/budgets", budgetRoutes);

// E. Reports (Summary & Budget Comparison)
app.use("/reports", reportRoutes);

// ==========================================
// 5. SERVER LISTENER
// 6. SERVER LISTENER
// ==========================================
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Expense Management Backend running on http://localhost:${PORT}`);
});