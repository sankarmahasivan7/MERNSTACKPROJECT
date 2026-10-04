const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// GET /reports/summary - Overall Income, Expenses, and Balance
router.get("/summary", async (req, res) => {
    try {
        const filter = {};
        if (req.query.userId) filter.userId = Number(req.query.userId);

        const transactions = await Transaction.find(filter);

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryWiseExpense = {};

        transactions.forEach((item) => {
            if (item.type === "income") {
                totalIncome += item.amount;
            } else if (item.type === "expense") {
                totalExpense += item.amount;
                categoryWiseExpense[item.category] = (categoryWiseExpense[item.category] || 0) + item.amount;
            }
        });

        const netBalance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netBalance,
                categoryWiseExpense
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /reports/budget-comparison - Budget vs Actual Expenses for a Month
router.get("/budget-comparison", async (req, res) => {
    try {
        const { month, userId } = req.query;
        if (!month) {
            return res.status(400).json({ success: false, message: "Query parameter 'month' is required (e.g. ?month=2026-09)." });
        }

        const budgetFilter = { month };
        const transactionFilter = { type: "expense" };
        if (userId) {
            budgetFilter.userId = Number(userId);
            transactionFilter.userId = Number(userId);
        }

        const budgets = await Budget.find(budgetFilter);
        const expenses = await Transaction.find(transactionFilter);

        // Group actual expenses by category for the target month
        const categorySpent = {};
        expenses.forEach((item) => {
            const itemMonth = new Date(item.date).toISOString().slice(0, 7); // 'YYYY-MM'
            if (itemMonth === month) {
                categorySpent[item.category] = (categorySpent[item.category] || 0) + item.amount;
            }
        });

        // Compare budget vs actual spent
        const comparison = budgets.map((b) => {
            const spent = categorySpent[b.category] || 0;
            return {
                category: b.category,
                budgetAmount: b.amount,
                spentAmount: spent,
                remainingAmount: b.amount - spent,
                isOverBudget: spent > b.amount
            };
        });

        res.status(200).json({
            success: true,
            data: {
                month,
                comparison
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
