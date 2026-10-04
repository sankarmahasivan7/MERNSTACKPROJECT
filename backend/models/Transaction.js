const mongoose = require("mongoose");

// COLLECTION - TRANSACTIONS
// ID - NUMBER, CATEGORY - STRING, AMOUNT - NUMBER, TYPE - STRING (expense / income)
const transactionSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    userId: { type: Number },
    type: { type: String, enum: ["expense", "income"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema, "transactions");
