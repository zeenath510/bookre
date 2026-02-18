const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    activity_type: { type: String }, // e.g., 'view', 'download', 'like'
    created_at: { type: Date, default: Date.now },
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
