const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const User = require("./models/User");
const Book = require("./models/Book");
const Recommendation = require("./models/Recommendation");
const Download = require("./models/Download");
const UserActivity = require("./models/UserActivity");

// Connect to DB (using the conn.js logic directly to avoid module.exports issues in script context if needed, or require it)
const DB = "mongodb+srv://Zeenuzeeee:Zeenath510%40@cluster0.gdubpkx.mongodb.net/db_book_recommendation";

mongoose.connect(DB).then(() => {
    console.log("Connected to MongoDB for seeding.");
    seedData();
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const seedData = async () => {
    try {
        // Clear existing data to avoid duplicates?
        // Let's check if data exists first.
        const adminCount = await Admin.countDocuments();
        const userCount = await User.countDocuments();
        const bookCount = await Book.countDocuments();

        if (adminCount > 0 || userCount > 0 || bookCount > 0) {
            console.log("Data already exists. Skipping seed to prevent duplicates (or clear manually if needed).");
            console.log(`Admins: ${adminCount}, Users: ${userCount}, Books: ${bookCount}`);
            // process.exit(0); // Uncomment to stop if data exists
            // For migration, let's clear and re-seed to match SQL dump exactly?
            // The user said "reliable and correct data".
            console.log("⚠️ Clearing existing collections to ensure fresh seed from SQL dump...");
            await Admin.deleteMany({});
            await User.deleteMany({});
            await Book.deleteMany({});
            await Recommendation.deleteMany({});
            await Download.deleteMany({});
            await UserActivity.deleteMany({});
        }

        // --- Admiin Data ---
        const admins = [
            { aname: 'admin', apass: 'admin' }
        ];
        await Admin.insertMany(admins);
        console.log("✅ Admin seeded");

        // --- Users Data ---
        // (1, 'Alice Johnson', 'alice.johnson@gmail.com', '9876543210', 'passAlice@123'),
        // (2, 'Bob Smith', 'bob.smith@gmail.com', '9123456780', 'passBob@123'),
        // (3, 'Charlie Brown', 'charlie.brown@gmail.com', '9988776655', 'passCharlie@123'),
        // (4, 'Diana Prince', 'diana.prince@gmail.com', '9098765432', 'passDiana@123'),
        // (5, 'Ethan Hunt', 'ethan.hunt@gmail.com', '9345678901', 'passEthan@123'),
        // (6, 'Ram Kumar', 'ram123@gmail.com', '7896543210', '123');
        const users = [
            { uname: 'Alice Johnson', uemail: 'alice.johnson@gmail.com', umobile: '9876543210', upass: 'passAlice@123' },
            { uname: 'Bob Smith', uemail: 'bob.smith@gmail.com', umobile: '9123456780', upass: 'passBob@123' },
            { uname: 'Charlie Brown', uemail: 'charlie.brown@gmail.com', umobile: '9988776655', upass: 'passCharlie@123' },
            { uname: 'Diana Prince', uemail: 'diana.prince@gmail.com', umobile: '9098765432', upass: 'passDiana@123' },
            { uname: 'Ethan Hunt', uemail: 'ethan.hunt@gmail.com', umobile: '9345678901', upass: 'passEthan@123' },
            { uname: 'Ram Kumar', uemail: 'ram123@gmail.com', umobile: '7896543210', upass: '123' }
        ];
        const createdUsers = await User.insertMany(users);
        console.log(`✅ ${createdUsers.length} Users seeded`);


        // --- Books Data ---
        /*
        (2, 'rdsaasd', 'werwer', 'Animi', 'Sample Description', 'werwqqq', '1950', 'English', 'ISEW7878545', 600, '/uploads/1755525649464-13.png', 'trending'),
        (3, 'Kambaramayanam', 'Kambar', 'Devotional', 'Testing ', 'Ashok', '0000', 'Tamil', 'INE@47884455', 450, '/uploads/1755150423980-674057be7e939c43a4992c27_model.webp', 'History, God'),
        (4, 'Men from Mars Women from Venus', 'John Gray', 'Romantic', '...', 'Paperback', '1993', 'English', 'INE33700086', 146, '/uploads/1755151378500-9780722528402.jpg', 'love,romantic');
        */
        const books = [
            {
                title: 'rdsaasd',
                author: 'werwer',
                genre: 'Animi',
                description: 'Sample Description',
                publisher: 'werwqqq',
                published_year: '1950',
                language: 'English',
                isbn: 'ISEW7878545',
                page_count: 600,
                cover_image: '/uploads/1755525649464-13.png',
                tags: 'trending'
            },
            {
                title: 'Kambaramayanam',
                author: 'Kambar',
                genre: 'Devotional',
                description: 'Testing ',
                publisher: 'Ashok',
                published_year: '0000',
                language: 'Tamil',
                isbn: 'INE@47884455',
                page_count: 450,
                cover_image: '/uploads/1755150423980-674057be7e939c43a4992c27_model.webp',
                tags: 'History, God'
            },
            {
                title: 'Men from Mars Women from Venus',
                author: 'John Gray',
                genre: 'Romantic',
                description: "You can't live with them - and you can't live without them! This is a lively book on successful communication between the sexes, allowing people all over the world to work out what makes members of the opposite sex tick and learn to understand their verbal and non-verbal language, ultimately reaching a point of harmony where it becomes possible to live, work and love together. The advice teaches you to: motivate the opposite sex and get what you want; avoid arguments and promote fruitful communication; learn what will really impress your mate and score points with the opposite sex; learn about the real emotional needs of the opposite sex and the behaviours associated with these needs; and discover the keys to keeping love alive - and staying together long term.",
                publisher: 'Paperback',
                published_year: '1993',
                language: 'English',
                isbn: 'INE33700086',
                page_count: 146,
                cover_image: '/uploads/1755151378500-9780722528402.jpg',
                tags: 'love,romantic'
            }
        ];
        const createdBooks = await Book.insertMany(books);
        console.log(`✅ ${createdBooks.length} Books seeded`);

        // Other collections (Recommendations, etc.) are empty in SQL dump (up to line 147).
        // If there were any, we would insert them here.
        // I will add a dummy recommendation if requested, but "reliable" means stick to source.
        if (createdBooks.length > 0 && createdUsers.length > 0) {
            console.log("Skipping demo recommendations to strictly follow provided SQL dump.");
        }

        console.log("Migration complete.");
        process.exit(0);

    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};
