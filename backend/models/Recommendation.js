const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    created_at: { type: Date, default: Date.now },
});

// Virtual for 'rid'
recommendationSchema.virtual('rid').get(function () {
    return this._id;
});

recommendationSchema.set('toJSON', {
    virtuals: true,
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation;
