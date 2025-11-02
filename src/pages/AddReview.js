import React, { useState } from "react";
import api, { getAuthHeader } from "../api";
import { auth } from "../firebase";
import Spinner from "../components/Spinner";
import ToastMessage from "../components/ToastMessage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddReview() {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieId, setMovieId] = useState(""); // optional
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  // --- Search OMDb ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTitle)
      return setToast({ message: "Enter a movie title to search", type: "error" });

    try {
      setSearchLoading(true);
      setSearchResults([]);
      const res = await axios.get(
        `https://test-uiyf.onrender.com/movies?title=${encodeURIComponent(searchTitle)}`
      );
      setSearchResults([res.data]);
    } catch (err) {
      console.error(err);
      setToast({ message: "Movie not found or API error", type: "error" });
    } finally {
      setSearchLoading(false);
    }
  };

  const selectMovie = (movie) => {
    setMovieTitle(movie.Title);
    setMovieId(movie.imdbID);
    setSearchResults([]);
    setSearchTitle("");
  };

  // --- Submit Review ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user)
      return setToast({ message: "You must be logged in to add a review", type: "error" });

    try {
      setLoading(true);
      const headers = await getAuthHeader();
      const payload = { movieTitle, movieId, rating: Number(rating), comment };
      await api.post("/reviews", payload, { headers }); // fixed endpoint
      setToast({ message: "Review added successfully", type: "success" });

      // reset form
      setMovieTitle("");
      setMovieId("");
      setComment("");
      setRating(5);

      navigate("/my-reviews");
    } catch (err) {
      console.error(err);
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

      {/* Search Form */}
      <form onSubmit={handleSearch} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search movie..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button className="btn btn-dark" type="submit" disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-3">
          {searchResults.map((movie) => (
            <div key={movie.imdbID} className="card p-2 mb-2 d-flex flex-row align-items-center">
              <img
                src={movie.Poster}
                alt={movie.Title}
                style={{ width: "80px", marginRight: "10px" }}
              />
              <div className="flex-grow-1">
                <strong>
                  {movie.Title} ({movie.Year})
                </strong>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => selectMovie(movie)}>
                Select
              </button>
            </div>
          ))}
        </div>
      )}

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
