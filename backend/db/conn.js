const mongoose = require("mongoose");

const DB = "mongodb+srv://Zeenuzeeee:Zeenath510%40@cluster0.gdubpkx.mongodb.net/db_book_recommendation";

mongoose.connect(DB, {
    serverSelectionTimeoutMS: 5000 // Timeout faster to fail faster if network issue
}).then(() => {
    console.log("Connected to MongoDB database.");
}).catch((err) => {
    console.log("MongoDB connection FAILED:", err);
});

mongoose.connection.on('connected', () => console.log('Mongoose connected to DB Cluster'));
mongoose.connection.on('error', (err) => console.log('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

module.exports = mongoose;
