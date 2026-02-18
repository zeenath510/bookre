import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "@/pages/ProtectedRoute";
import EditBook from "./pages/dashboard/editbook";
import LandingPage from "./pages/LandingPage";
import UserHome from "./pages/user/UserHome";
import BookDetails from "./pages/user/BookDetails";
import UserRecommendation from "./pages/user/UserRecommendation";
import Feedback from "./pages/user/Feedback";

import { useMaterialTailwindController } from "@/context";

function App() {
  const [controller] = useMaterialTailwindController();
  const { darkMode } = controller;

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/user/home" element={<UserHome />} />
      <Route path="/user/book/:id" element={<BookDetails />} />
      <Route path="/user/recommendation" element={<UserRecommendation />} />
      <Route path="/user/feedback" element={<Feedback />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editbook/:id"
        element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        }
      />

      {/* Auth Pages */}
      <Route path="/auth/*" element={<Auth />} />

      {/* Unknown URLs → back to LandingPage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
