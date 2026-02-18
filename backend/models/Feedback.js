const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['feedback', 'report'], default: 'feedback' },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
