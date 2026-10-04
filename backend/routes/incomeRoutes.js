const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const getNextId = require("../utils/getNextId");

// GET /income - List income entries
router.get("/", async (req, res) => {
    try {
        const filter = { type: "income" };
        if (req.query.userId) filter.userId = Number(req.query.userId);

        const incomeList = await Transaction.find(filter).sort({ id: -1 });
        res.status(200).json({ success: true, data: incomeList });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /income - Add new income
router.post("/", async (req, res) => {
    try {
        const { category, amount, description, userId, date } = req.body;
        if (!category || amount === undefined) {
            return res.status(400).json({ success: false, message: "Category and amount are required." });
        }

        const id = await getNextId(Transaction, "id");
        const newIncome = new Transaction({
            id,
            userId: userId ? Number(userId) : undefined,
            type: "income",
            category,
            amount: Number(amount),
            description: description || "",
            date: date ? new Date(date) : new Date()
        });
        await newIncome.save();

        res.status(201).json({ success: true, message: "Income added successfully.", data: newIncome });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /income/:id - Edit income
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
            { id, type: "income" },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Income record not found." });
        }

        res.status(200).json({ success: true, message: "Income record updated.", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /income/:id - Delete income
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleted = await Transaction.findOneAndDelete({ id, type: "income" });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Income record not found." });
        }

        res.status(200).json({ success: true, message: "Income record deleted." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
