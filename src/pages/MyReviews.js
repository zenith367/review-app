// src/pages/MyReviews.jsx
import React, { useEffect, useState } from "react";
import api, { getAuthHeader } from "../api";
import { auth } from "../firebase";
import { doc, Timestamp } from "firebase/firestore"; // not needed but kept if you want
import Spinner from "../components/Spinner";
import ToastMessage from "../components/ToastMessage";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [toast, setToast] = useState(null);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      const all = res.data || [];
      const uid = auth.currentUser?.uid;
      const my = all.filter((r) => r.userId === uid);
      setReviews(my);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to fetch your reviews", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
    // also re-run when auth changes (optional)
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      setLoading(true);
      const headers = await getAuthHeader();
      await api.delete(`/${id}`, { headers });
      setToast({ message: "Review deleted" });
      await fetchMyReviews();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to delete", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({ rating: r.rating || 5, comment: r.comment || r.reviewText || "" });
  };

  const submitEdit = async (id) => {
    try {
      setLoading(true);
      const headers = await getAuthHeader();
      await api.put(`/${id}`, { rating: Number(form.rating), comment: form.comment }, { headers });
      setToast({ message: "Review updated" });
      setEditingId(null);
      await fetchMyReviews();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner text="Loading your reviews..." />;

  return (
    <div>
      <h2>My Reviews</h2>
      {toast && <ToastMessage {...toast} onClose={() => setToast(null)} />}
      {reviews.length === 0 && <div className="alert alert-info">You have no reviews yet.</div>}
      {reviews.map((r) => (
        <div key={r.id} className="card mb-3 p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">{r.movieTitle || `Movie ${r.movieId || ""}`}</h5>
              <p className="mb-1">{r.comment || r.reviewText}</p>
              <small>Rating: ⭐ {r.rating}</small>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(r)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          </div>

          {editingId === r.id && (
            <div className="mt-3">
              <input className="form-control mb-2" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              <textarea className="form-control mb-2" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              <div>
                <button className="btn btn-success me-2" onClick={() => submitEdit(r.id)}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
