import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"; // download icon
import API_URL from "../../configs/api";

export default function UserRecommendation() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth/user-sign-in");
      return;
    }
    fetchRecommendations();
  }, [search]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/users/${user.uid}/recommendations`,
        { params: { search } }
      );
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (book) => {
    try {
      // 1. Record download in DB
      await axios.post(`${API_URL}/books/download/${book.bid}/${user.uid}`);

      // 2. Trigger actual download
      const link = document.createElement("a");
      link.href = `${API_URL}/books/download/${book.bid}`;
      link.target = "_blank";
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download the book.");
    }
  };

  return (
    <div>
      <UserNavbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Recommended Books</h1>

            {/* 🔍 Search box */}
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 mb-6 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />

            {loading ? (
              <p>Loading...</p>
            ) : books.length === 0 ? (
              <p>No books found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book.bid}
                    className="bg-white shadow-md rounded-lg p-4 flex flex-col dark:bg-gray-800 dark:border-gray-700"
                  >
                    <img
                      src={`${API_URL}${book.cover_image}`}
                      alt={book.title}
                      className="h-48 w-full object-cover rounded mb-4"
                    />
                    <h2 className="text-lg font-semibold dark:text-white">{book.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Genre:</strong> {book.genre}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/user/book/${book.bid}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                      >
                        View Details
                      </button>

                      {/* Download button */}
                      <button
                        onClick={() => handleDownload(book)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
