const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
