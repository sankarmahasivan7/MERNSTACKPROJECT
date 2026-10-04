const mongoose = require("mongoose");

// COLLECTION - CATEGORIES
// CATEGORYID - NUMBER, CATEGORYNAME - STRING
const categorySchema = new mongoose.Schema({
    categoryId: { type: Number, unique: true },
    categoryName: { type: String, required: true },
    userId: { type: Number }
});

module.exports = mongoose.model("Category", categorySchema, "categories");
