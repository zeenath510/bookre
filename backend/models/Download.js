const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    times: { type: Number, default: 0 },
});

const Download = mongoose.model("Download", downloadSchema);

module.exports = Download;
