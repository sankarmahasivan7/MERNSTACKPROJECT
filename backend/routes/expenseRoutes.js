const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const getNextId = require("../utils/getNextId");

// GET /expenses - List expenses
router.get("/", async (req, res) => {
    try {
        const filter = { type: "expense" };
        if (req.query.userId) filter.userId = Number(req.query.userId);

        const expenses = await Transaction.find(filter).sort({ id: -1 });
        res.status(200).json({ success: true, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /expenses - Add new expense
router.post("/", async (req, res) => {
    try {
        const { category, amount, description, userId, date } = req.body;
        if (!category || amount === undefined) {
            return res.status(400).json({ success: false, message: "Category and amount are required." });
        }

        const id = await getNextId(Transaction, "id");
        const newExpense = new Transaction({
            id,
            userId: userId ? Number(userId) : undefined,
            type: "expense",
            category,
            amount: Number(amount),
            description: description || "",
            date: date ? new Date(date) : new Date()
        });
        await newExpense.save();

        res.status(201).json({ success: true, message: "Expense added successfully.", data: newExpense });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /expenses/:id - Edit an expense
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { category, amount, description, date } = req.body;

        const updateData = {};
        if (category) updateData.category = category;
        if (amount !== undefined) updateData.amount = Number(amount);
        if (description !== undefined) updateData.description = description;
        if (date) updateData.date = new Date(date);

        const updated = await Transaction.findOneAndUpdate(
            { id, type: "expense" },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Expense not found." });
        }

        res.status(200).json({ success: true, message: "Expense updated.", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /expenses/:id - Delete an expense
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleted = await Transaction.findOneAndDelete({ id, type: "expense" });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Expense not found." });
        }

        res.status(200).json({ success: true, message: "Expense deleted." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
