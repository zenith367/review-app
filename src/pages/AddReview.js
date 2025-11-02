// src/pages/AddReview.jsx
import React, { useState } from "react";
import api, { getAuthHeader } from "../api";
import { auth } from "../firebase";
import Spinner from "../components/Spinner";
import ToastMessage from "../components/ToastMessage";
import { useNavigate } from "react-router-dom";

export default function AddReview() {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieId, setMovieId] = useState(""); // optional
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // --- Submit Review ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      return setToast({ message: "You must be logged in to add a review", type: "error" });
    }

    if (!movieTitle || !comment) {
      return setToast({ message: "Movie title and review are required", type: "error" });
    }

    try {
      setLoading(true);

      const headers = await getAuthHeader();

      // payload ensures all Home.jsx fields exist
      const payload = {
        movieTitle,
        movieId: movieId || null,
        comment,
        rating: Number(rating) || 0,
        userId: user.uid, // needed by Home.jsx
        createdAt: new Date().toISOString() // ensures Home can format it
      };

      // POST to backend
      await api.post("/reviews", payload, { headers });

      setToast({ message: "Review added successfully" });

      // reset form
      setMovieTitle("");
      setMovieId("");
      setComment("");
      setRating(5);

      // navigate to My Reviews
      navigate("/my-reviews");
    } catch (err) {
      console.error("Add review error:", err);
      const msg = err.response?.data?.error || "Failed to add review";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add a Review</h2>
      {toast && <ToastMessage {...toast} onClose={() => setToast(null)} />}

      {/* Review Form */}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Movie Title"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          placeholder="Movie ID (optional)"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        />
        <textarea
          className="form-control mb-3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit Review"}
        </button>
      </form>

      {loading && <Spinner />}
    </div>
  );
}
