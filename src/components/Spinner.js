// src/components/Spinner.jsx
import React from "react";

export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-4">
      <div className="spinner-border" role="status" aria-hidden="true"></div>
      <span className="ms-2">{text}</span>
    </div>
  );
}
