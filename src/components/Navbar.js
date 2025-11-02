import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">🎬 Movie Reviews</Link>
        <div>
          <Link className="btn btn-outline-light mx-2" to="/">Home</Link>
          <Link className="btn btn-outline-light mx-2" to="/add-review">Add Review</Link>
          <Link className="btn btn-outline-light mx-2" to="/my-reviews">My Reviews</Link>
          <Link className="btn btn-outline-light mx-2" to="/login">Login</Link>
          <Link className="btn btn-outline-light mx-2" to="/signup">Signup</Link>
          <button className="btn btn-danger mx-2" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
