const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    aname: {
        type: String,
        required: true,
    },
    apass: {
        type: String,
        required: true,
    },
});

// Virtual for 'aid' to match MySQL schema
adminSchema.virtual('aid').get(function () {
    return this._id;
});

// Ensure virtual fields are serialized
adminSchema.set('toJSON', {
    virtuals: true,
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
