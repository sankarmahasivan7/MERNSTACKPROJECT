const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const getNextId = require("../utils/getNextId");

// GET /categories - List categories
router.get("/", async (req, res) => {
    try {
        const filter = req.query.userId ? { userId: Number(req.query.userId) } : {};
        const categories = await Category.find(filter).sort({ categoryId: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /categories - Add new category
router.post("/", async (req, res) => {
    try {
        const { categoryName, userId } = req.body;
        if (!categoryName) {
            return res.status(400).json({ success: false, message: "Category name is required." });
        }

        const categoryId = await getNextId(Category, "categoryId");
        const category = new Category({
            categoryId,
            categoryName,
            userId: userId ? Number(userId) : undefined
        });
        await category.save();

        res.status(201).json({ success: true, message: "Category created.", data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /categories/:id - Edit category
router.put("/:id", async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const { categoryName } = req.body;

        const updatedCategory = await Category.findOneAndUpdate(
            { categoryId },
            { $set: { categoryName } },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        res.status(200).json({ success: true, message: "Category updated.", data: updatedCategory });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /categories/:id - Delete category
router.delete("/:id", async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const deleted = await Category.findOneAndDelete({ categoryId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        res.status(200).json({ success: true, message: "Category deleted." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
