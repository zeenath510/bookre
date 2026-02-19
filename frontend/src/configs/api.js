
let API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

if (!API_URL.startsWith("http")) {
    API_URL = `https://${API_URL}`;
}

export default API_URL;
