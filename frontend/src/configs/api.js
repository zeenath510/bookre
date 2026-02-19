
let API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Handle Render's internal hostname (e.g., "book-re-backend") by appending the public domain
if (API_URL && !API_URL.includes(".") && !API_URL.includes("localhost")) {
    API_URL += ".onrender.com";
}

if (!API_URL.startsWith("http")) {
    API_URL = `https://${API_URL}`;
}

export default API_URL;
