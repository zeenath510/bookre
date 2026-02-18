const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    genre: { type: String },
    description: { type: String },
    publisher: { type: String },
    published_year: { type: String }, // Kept as String to match potential "1950" input
    language: { type: String },
    isbn: { type: String },
    page_count: { type: Number },
    cover_image: { type: String },
    book_file: { type: String },
    tags: { type: String },
});

// Virtual for 'bid'
bookSchema.virtual('bid').get(function () {
    return this._id;
});

bookSchema.set('toJSON', {
    virtuals: true,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
