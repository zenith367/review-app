import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import ToastMessage from "../components/ToastMessage";
import bannerImg from "../pages/moviebanner.jpg";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // ✅ Use your deployed backend URL
        const res = await axios.get("https://test-uiyf.onrender.com/api/reviews");
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

  return (
    <div className="home-page">
      <div className="hero-section">
        <img src={bannerImg} alt="Movie Banner" className="hero-image" />
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to MovieHub</h1>
          <p className="hero-subtitle">Discover. Review. Enjoy. 🎥</p>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="text-center mb-4 text-warning">All Reviews</h2>

        {loading && <Spinner text="Loading reviews..." />}
        {toast && <ToastMessage {...toast} onClose={() => setToast(null)} />}

        {!loading && reviews.length === 0 && (
          <div className="alert alert-info text-center">No reviews yet.</div>
        )}

        <div className="mt-3">
          {reviews.map((r) => (
            <div key={r.id} className="card mb-3 p-3 shadow-sm">
              <div className="d-flex justify-content-between">
                <h5 className="mb-1">{r.movieTitle || r.movieId}</h5>
                <small className="text-muted">
                  {new Date(r.createdAt._seconds * 1000).toLocaleString()}
                </small>
              </div>
              <p className="mb-1">{r.comment}</p>
              <small>Rating: ⭐ {r.rating}</small>
              <div className="mt-2">
                <small className="text-muted">By: {r.userId}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
