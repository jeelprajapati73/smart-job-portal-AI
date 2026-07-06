import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

import API from "../services/api";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await API.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role || "user");

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="auth-container">

        {/* LEFT PANEL */}

        <div className="auth-left">

          <div className="hero-logo">
            <FiBriefcase />
          </div>

          <span className="hero-brand">
            Smart Job Portal
          </span>

          <h1 className="hero-title">
            Find Your Dream Job with AI
          </h1>

          <p className="hero-text">
            AI-powered resume matching that connects talented
            candidates with verified companies and exciting
            career opportunities.
          </p>

          <div className="feature-list">

            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>

              <div>
                <h4>AI Resume Matching</h4>
                <p>
                  Get personalized job recommendations instantly.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiShield />
              </div>

              <div>
                <h4>Verified Companies</h4>
                <p>
                  Apply confidently to trusted employers.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp />
              </div>

              <div>
                <h4>Career Growth</h4>
                <p>
                  Track applications and grow your career.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="auth-right">

          <div className="login-card">

            <span className="brand-name">
              Smart Job Portal
            </span>

            <h2 className="login-title">
              Welcome Back
            </h2>

            <p className="login-subtitle">
              Sign in to continue your career journey.
            </p>

            <form
              onSubmit={handleLogin}
              autoComplete="off"
            >

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              <input
                type="text"
                name="fakeusernameremembered"
                style={{ display: "none" }}
              />

              <input
                type="password"
                name="fakepasswordremembered"
                style={{ display: "none" }}
              />

              <div className="input-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              <div className="forgot-password">
                Forgot Password?
              </div>

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight />
                  </>
                )}
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="login-footer">

              <p>
                Don't have an account?
              </p>

              <Link to="/register">
                Create Account
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;