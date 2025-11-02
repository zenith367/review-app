// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import ToastMessage from "../components/ToastMessage";
import bannerImg from "../pages/moviebanner.jpg"; // you can change the path

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/reviews");
        setReviews(res.data || []);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load reviews", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // helper to safely format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = date?.toDate ? date.toDate() : new Date(date);
      return d.toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="home-page">
      {/* 🎬 Hero Section */}
      <div className="hero-section">
        <img src={bannerImg} alt="Movie Banner" className="hero-image" />
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to MovieHub</h1>
          <p className="hero-subtitle">Discover. Review. Enjoy. 🎥</p>
        </div>
      </div>

      {/* 📝 Reviews Section */}
      <div className="container mt-5">
        <h2 className="text-center mb-4 text-warning">All Reviews</h2>

        {loading && <Spinner text="Loading reviews..." />}
        {toast && <ToastMessage {...toast} onClose={() => setToast(null)} />}
        {!loading && reviews.length === 0 && (
          <div className="alert alert-info text-center">No reviews yet.</div>
        )}

        <div className="mt-3">
          {reviews.map((r) => (
            <div key={r.id || r._id || r.movieId} className="card mb-3 p-3 shadow-sm">
              <div className="d-flex justify-content-between">
                <h5 className="mb-1">{r.movieTitle || `Movie ${r.movieId || ""}`}</h5>
                <small className="text-muted">{formatDate(r.createdAt)}</small>
              </div>
              <p className="mb-1">{r.comment || r.reviewText || "No comment"}</p>
              <small>Rating: ⭐ {r.rating || "N/A"}</small>
              <div className="mt-2">
                <small className="text-muted">By: {r.userId || "Anonymous"}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
