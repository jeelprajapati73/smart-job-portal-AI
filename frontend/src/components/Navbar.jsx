import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Left - Logo */}
      <div className="nav-logo">
        SmartJob<span>Portal</span>
      </div>

      {/* Center - Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/applications">My Applications</Link>

      </div>

      {/* Right - Actions */}
      <div className="nav-actions">

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

      </div>

    </nav>
  );
}