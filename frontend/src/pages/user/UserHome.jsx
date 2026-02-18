import Footer from "@/components/Footer";
import UserNavbar from "@/components/UserNavbar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export function UserHome() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth/user-sign-in");
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/books");
        const allBooks = response.data;

        setBooks(allBooks);

        // extract unique authors & genres
        setAuthors([...new Set(allBooks.map((b) => b.author))]);
        setGenres([...new Set(allBooks.map((b) => b.genre))]);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [navigate, user]);

  // ✅ useMemo for filtering (authors, genres, search)
  const filteredBooks = useMemo(() => {
    let result = books;

    if (selectedAuthors.length > 0) {
      result = result.filter((b) => selectedAuthors.includes(b.author));
    }

    if (selectedGenres.length > 0) {
      result = result.filter((b) => selectedGenres.includes(b.genre));
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.genre.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [books, selectedAuthors, selectedGenres, searchQuery]);

  // toggle author filter
  const handleAuthorChange = (author) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  // toggle genre filter
  const handleGenreChange = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div>
      <UserNavbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
          <ToastContainer position="top-right" autoClose={3000} />

          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="grid grid-cols-12 gap-8">
              {/* Sidebar: Authors, Genres, Search */}
              <aside className="col-span-12 md:col-span-3">
                <div className="bg-white shadow-lg rounded-xl p-6 sticky top-24 border border-blue-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-blue-gray-900 mb-4 border-b pb-2 dark:text-white dark:border-gray-700">Filters</h2>

                  {/* Search Box */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-blue-gray-700 mb-2 uppercase tracking-wider dark:text-gray-300">Search</h3>
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-blue-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  {/* Authors */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-blue-gray-700 mb-3 uppercase tracking-wider dark:text-gray-300">Authors</h3>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                      {authors.map((author) => (
                        <label key={author} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                            checked={selectedAuthors.includes(author)}
                            onChange={() => handleAuthorChange(author)}
                          />
                          <span className="text-sm text-gray-600 group-hover:text-brand-600 transition-colors dark:text-gray-300 dark:group-hover:text-brand-400">{author}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <h3 className="text-sm font-semibold text-blue-gray-700 mb-3 uppercase tracking-wider dark:text-gray-300">Genres</h3>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                      {genres.map((genre) => (
                        <label key={genre} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                            checked={selectedGenres.includes(genre)}
                            onChange={() => handleGenreChange(genre)}
                          />
                          <span className="text-sm text-gray-600 group-hover:text-brand-600 transition-colors dark:text-gray-300 dark:group-hover:text-brand-400">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Book Cards */}
              <section className="col-span-12 md:col-span-9">
                {filteredBooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.bid}
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-blue-gray-50 overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={`http://localhost:3000${book.cover_image}`}
                            alt={book.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white font-medium text-sm bg-brand-600 px-3 py-1 rounded-full shadow-lg">
                              {book.genre}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <h2 className="text-lg font-bold text-blue-gray-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors dark:text-white dark:group-hover:text-brand-400">
                            {book.title}
                          </h2>
                          <p className="text-sm text-blue-gray-500 mb-3 font-medium dark:text-gray-400">
                            by {book.author}
                          </p>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow dark:text-gray-300">
                            {book.description}
                          </p>
                          <button
                            onClick={() => navigate(`/user/book/${book.bid}`)}
                            className="w-full mt-auto bg-gray-50 text-blue-gray-900 font-semibold py-2.5 rounded-lg border border-gray-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-brand-600"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserHome;
