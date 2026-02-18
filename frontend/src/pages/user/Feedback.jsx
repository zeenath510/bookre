import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";

export default function Feedback() {
    const [type, setType] = useState("feedback");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login first");
            return;
        }
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:3000/feedback", {
                uid: user.uid,
                type,
                message,
            });
            toast.success("Feedback submitted successfully!");
            setMessage("");
            setType("feedback");
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <UserNavbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <main className="flex-grow pt-24 pb-12 px-6 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg dark:bg-gray-800 dark:text-white">
                    <h1 className="text-3xl font-bold mb-2">We value your opinion</h1>
                    <p className="text-gray-600 mb-8 dark:text-gray-300">
                        Have a suggestion or found a bug? Let us know!
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Type</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="feedback"
                                        checked={type === "feedback"}
                                        onChange={(e) => setType(e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>General Feedback</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="report"
                                        checked={type === "report"}
                                        onChange={(e) => setType(e.target.value)}
                                        className="text-red-600 focus:ring-red-500"
                                    />
                                    <span>Report Issue</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="font-semibold text-gray-700 dark:text-gray-200">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows="5"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Details..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-6 rounded-lg text-white font-bold tracking-wide transition-all ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                                }`}
                        >
                            {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
