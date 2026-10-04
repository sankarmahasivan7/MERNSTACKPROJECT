const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const getNextId = require("../utils/getNextId");

// GET /budgets - List budgets
router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.userId) filter.userId = Number(req.query.userId);
        if (req.query.month) filter.month = req.query.month;

        const budgets = await Budget.find(filter).sort({ id: 1 });
        res.status(200).json({ success: true, data: budgets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /budgets - Add budget
router.post("/", async (req, res) => {
    try {
        const { category, month, amount, userId } = req.body;
        if (!category || !month || amount === undefined) {
            return res.status(400).json({ success: false, message: "Category, month, and amount are required." });
        }

        const id = await getNextId(Budget, "id");
        const newBudget = new Budget({
            id,
            userId: userId ? Number(userId) : undefined,
            category,
            month,
            amount: Number(amount)
        });
        await newBudget.save();

        res.status(201).json({ success: true, message: "Budget set successfully.", data: newBudget });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /budgets/:id - Edit budget
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { category, month, amount } = req.body;

        const updateData = {};
        if (category) updateData.category = category;
        if (month) updateData.month = month;
        if (amount !== undefined) updateData.amount = Number(amount);

        const updated = await Budget.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Budget not found." });
        }

        res.status(200).json({ success: true, message: "Budget updated.", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /budgets/:id - Delete budget
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleted = await Budget.findOneAndDelete({ id });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Budget not found." });
        }

        res.status(200).json({ success: true, message: "Budget deleted." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
