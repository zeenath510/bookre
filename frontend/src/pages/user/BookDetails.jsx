import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";
import API_URL from "../../configs/api";

export function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/books/${id}`),
          axios.get(`${API_URL}/books/${id}/reviews`),
        ]);
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load details");
        navigate("/user/home");
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndReviews();
  }, [id, navigate]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to review");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/reviews`, {
        uid: user.uid,
        bid: id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      toast.success("Review submitted!");
      setReviews([res.data.review, ...reviews]); // Prepend new review
      setNewReview({ rating: 5, comment: "" }); // Reset form
      // Re-fetch to get populated user name if needed (or manually struct)
      // For simplicity, we might need to manually add uname to the new review obj for display immediately
      // or just reload. Let's start with basic prepend.
      // Ideally backend returns populated or we fake it:
      // setReviews([{ ...res.data.review, uid: { uname: user.uname } }, ...reviews]);
      setReviews([{ ...res.data.review, uid: { uname: user.uname } }, ...reviews]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <UserNavbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center dark:bg-gray-900">
          <div className="w-full bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800 dark:text-white">
            <div className="grid grid-cols-12 gap-6">
              {/* Left side - Book Image */}
              <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                <img
                  src={`${API_URL}${book.cover_image}`}
                  alt={book.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded"
                />
              </div>

              {/* Right side - Book Details */}
              <div className="col-span-12 md:col-span-6">
                <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                <p className="mb-2"><strong>Author:</strong> {book.author}</p>
                <p className="mb-2"><strong>Genre:</strong> {book.genre}</p>
                <p className="mb-2"><strong>Publisher:</strong> {book.publisher}</p>
                <p className="mb-2"><strong>Published Year:</strong> {book.published_year}</p>
                <p className="mb-2"><strong>Language:</strong> {book.language}</p>
                <p className="mb-2"><strong>ISBN:</strong> {book.isbn}</p>
                <p className="mb-2"><strong>Pages:</strong> {book.page_count}</p>
                <p className="mb-2"><strong>Tags:</strong> {book.tags}</p>
                <p className="mt-4 text-gray-700 dark:text-gray-300">{book.description}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="w-full bg-white shadow-lg rounded-lg p-6 mt-8 dark:bg-gray-800 dark:text-white">
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

            {/* Review Form */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`w-6 h-6 ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  rows="3"
                  placeholder="Share your thoughts about this book..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                ></textarea>
                <button
                  onClick={handleSubmitReview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition self-start"
                >
                  Submit Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-lg">
                          {review.uid?.uname || "Anonymous"}
                        </div>
                        <div className="flex text-yellow-400 text-sm">
                          {"★".repeat(review.rating)}
                          <span className="text-gray-300">
                            {"★".repeat(5 - review.rating)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookDetails;
