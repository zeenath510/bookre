const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Database Connection
require("./db/conn");

// Models
const Admin = require("./models/Admin");
const Book = require("./models/Book");
const User = require("./models/User");
const Recommendation = require("./models/Recommendation");
const Download = require("./models/Download");
const UserActivity = require("./models/UserActivity");
const Review = require("./models/Review");
const Feedback = require("./models/Feedback");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Admin Login
app.post("/login", async (req, res) => {
  const { aname, apass } = req.body;

  if (!aname || !apass) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const admin = await Admin.findOne({ aname, apass });
    if (admin) {
      return res.status(200).json({ message: "Login successful", user: admin.aname });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Accept multiple fields: cover_image (image), book_file (PDF)
app.post(
  "/books",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "book_file", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      title,
      author,
      genre,
      description,
      publisher,
      published_year,
      language,
      isbn,
      page_count,
      tags,
    } = req.body;

    const coverImagePath = req.files["cover_image"]
      ? `/uploads/${req.files["cover_image"][0].filename}`
      : null;

    const bookFilePath = req.files["book_file"]
      ? `/uploads/${req.files["book_file"][0].filename}`
      : null;

    try {
      const newBook = await Book.create({
        title,
        author,
        genre,
        description,
        publisher,
        published_year,
        language,
        isbn,
        page_count,
        cover_image: coverImagePath,
        book_file: bookFilePath,
        tags,
      });
      res.status(201).json({ message: "Book added", bookId: newBook._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }
);

// Read - Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Read - Get book by ID
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Update - Update book by ID
app.put("/books/:id", upload.single("cover_image"), async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (req.file) {
    updateData.cover_image = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Delete - Delete book by ID
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// User Login
app.post("/users/login", async (req, res) => {
  const { uname, upass } = req.body;

  if (!uname || !upass) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    console.log("Login attempt:", { uname, upass }); // DEBUG Log
    // Check for user by username OR email
    const user = await User.findOne({
      $or: [{ uname: uname }, { uemail: uname }],
      upass: upass
    });
    console.log("User found:", user ? "Yes" : "No"); // DEBUG Log
    if (user) {
      return res.status(200).json({
        message: "Login successful",
        user: {
          uid: user._id,
          uname: user.uname,
          uemail: user.uemail,
          umobile: user.umobile,
        },
      });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// CREATE a new user
app.post("/users", async (req, res) => {
  const { uname, uemail, umobile, upass, genre_like } = req.body;

  try {
    // Note: genre_like might come in as array or stringified JSON depending on frontend
    let parsedGenreLike = genre_like;
    if (typeof genre_like === 'string') {
      try {
        parsedGenreLike = JSON.parse(genre_like);
      } catch (e) {
        parsedGenreLike = []; // Fallback
      }
    }

    const newUser = await User.create({
      uname,
      uemail,
      umobile,
      upass,
      genre_like: parsedGenreLike,
    });
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// READ all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ single user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Reports & Analytics
app.get("/reports/most-recommended", async (req, res) => {
  try {
    // Aggregation to count recommendations per book
    const results = await Recommendation.aggregate([
      {
        $group: {
          _id: "$bid",
          recommend_count: { $sum: 1 },
        },
      },
      { $sort: { recommend_count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book_details",
        },
      },
      { $unwind: "$book_details" },
      {
        $project: {
          bid: "$_id",
          title: "$book_details.title",
          author: "$book_details.author",
          genre: "$book_details.genre",
          recommend_count: 1,
        },
      },
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

app.get("/reports/popular-genres", async (req, res) => {
  try {
    // Note: UserActivity might be empty, so this might return empty results until populated
    const results = await UserActivity.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bid",
          foreignField: "_id",
          as: "book_details",
        },
      },
      { $unwind: "$book_details" },
      {
        $group: {
          _id: "$book_details.genre",
          activity_count: { $sum: 1 },
        },
      },
      { $sort: { activity_count: -1 } },
      { $limit: 5 },
      {
        $project: {
          genre: "$_id",
          activity_count: 1,
          _id: 0,
        },
      },
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Get book recommendations for a user with optional search
app.get("/users/:uid/recommendations", async (req, res) => {
  const { uid } = req.params;
  const { search } = req.query;

  try {
    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ error: "User not found" });

    let query = {};
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      query = {
        $or: [
          { title: regex },
          { author: regex },
          { description: regex },
          { genre: regex },
        ],
      };
    } else if (user.genre_like && user.genre_like.length > 0) {
      query = { genre: { $in: user.genre_like } };
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const total_users = await User.countDocuments();
    const total_books = await Book.countDocuments();
    res.json({ total_users, total_books });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------- Recommendation Routes -------------------------------//
// GET all recommendations
app.get("/", async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .sort({ created_at: -1 })
      .populate("uid", "first_name last_name") // Check if User model has first_name/last_name or uname. Original code used u.first_name.
      .populate("bid", "title");

    // Map to match original response format if needed
    const structured = recommendations.map(rec => ({
      rid: rec._id,
      uid: rec.uid?._id,
      bid: rec.bid?._id,
      created_at: rec.created_at,
      // first_name/last_name might need adjustment based on User model (which has uname)
      // Assuming for now we send uname if first/last missing, or update User model.
      // SQL had first_name, but User table only had uname??
      // Looking at SQL schema: `tbl_users` has `uname`, `uemail`... NO `first_name`!
      // The original SQL inner join for recommendations selected `u.first_name`, but `tbl_users` dump didn't show it.
      // Likely `uname` is what we have.
      first_name: rec.uid?.uname?.split(" ")[0] || "Unknown",
      last_name: rec.uid?.uname?.split(" ")[1] || "",
      book_title: rec.bid?.title,
    }));

    res.json(structured);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET recommendations by user
app.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const recommendations = await Recommendation.find({ uid })
      .sort({ created_at: -1 })
      .populate("bid", "title");

    const structured = recommendations.map(rec => ({
      rid: rec._id,
      uid: rec.uid,
      bid: rec.bid?._id,
      created_at: rec.created_at,
      book_title: rec.bid?.title,
    }));
    res.json(structured);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET recommendations by book
app.get("/book/:bid", async (req, res) => {
  const { bid } = req.params;
  try {
    const recommendations = await Recommendation.find({ bid })
      .sort({ created_at: -1 })
      .populate("uid", "uname");

    const structured = recommendations.map(rec => ({
      rid: rec._id,
      uid: rec.uid?._id,
      bid: rec.bid,
      created_at: rec.created_at,
      first_name: rec.uid?.uname?.split(" ")[0] || "Unknown",
      last_name: rec.uid?.uname?.split(" ")[1] || "",
    }));
    res.json(structured);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST: Add a new recommendation
app.post("/", async (req, res) => {
  const { uid, bid } = req.body;

  if (!uid || !bid) {
    return res
      .status(400)
      .json({ message: "User ID (uid) and Book ID (bid) are required" });
  }

  try {
    const newRec = await Recommendation.create({ uid, bid });
    res.status(201).json({
      message: "Recommendation added successfully",
      recommendation_id: newRec._id,
      uid,
      bid,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/books/download/:bid", async (req, res) => {
  const { bid } = req.params;
  try {
    const book = await Book.findById(bid);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.book_file) return res.status(404).json({ error: "No file associated with this book" });

    const filePath = path.join(__dirname, book.book_file); // stored as /uploads/...
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });

    res.download(filePath, `${book.title}.pdf`, (err) => {
      if (err) console.error("Error downloading file:", err);
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /books/download/:bid/:uid
app.post("/books/download/:bid/:uid", async (req, res) => {
  const { bid, uid } = req.params;
  try {
    let download = await Download.findOne({ uid, bid });
    if (download) {
      download.times += 1;
      await download.save();
    } else {
      await Download.create({ uid, bid, times: 1 });
    }
    // Also log activity
    await UserActivity.create({ uid, bid, activity_type: 'download' });

    res.json({ message: "Download recorded" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;

// ----------------- Reviews -------------------------------//
// POST: Add a review
app.post("/reviews", async (req, res) => {
  const { uid, bid, rating, comment } = req.body;
  try {
    const newReview = await Review.create({ uid, bid, rating, comment });
    res.status(201).json({ message: "Review added", review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get reviews for a book
app.get("/books/:bid/reviews", async (req, res) => {
  const { bid } = req.params;
  try {
    const reviews = await Review.find({ bid }).populate("uid", "uname").sort({ created_at: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Feedback -------------------------------//
// POST: Submit feedback
app.post("/feedback", async (req, res) => {
  const { uid, type, message } = req.body;
  try {
    await Feedback.create({ uid, type, message });
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
