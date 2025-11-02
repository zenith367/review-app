// src/components/ToastMessage.jsx
import React from "react";

export default function ToastMessage({ message, type = "success", onClose }) {
  if (!message) return null;
  const bg = type === "error" ? "bg-danger text-white" : "bg-success text-white";
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div className={`toast show ${bg}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
}
