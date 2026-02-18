const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uname: { type: String, required: true },
    uemail: { type: String, required: true },
    umobile: { type: String },
    upass: { type: String, required: true },
    genre_like: { type: [String], default: [] }, // Array of strings
});

// Virtual for 'uid'
userSchema.virtual('uid').get(function () {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
