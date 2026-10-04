const mongoose = require("mongoose");

// COLLECTION - BUDGETS
// ID - NUMBER, CATEGORY - STRING, MONTH - STRING, AMOUNT - NUMBER
const budgetSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    userId: { type: Number },
    category: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true }
});

module.exports = mongoose.model("Budget", budgetSchema, "budgets");
