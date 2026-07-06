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
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";

import API from "../services/api";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Registration failed."
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
            Start Your Career Today
          </h1>

          <p className="hero-text">
            Create your account and unlock AI-powered
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
                  Get personalized job
                  recommendations instantly.
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
                  Apply only to trusted employers.
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
                  Build your profile and
                  grow professionally.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="auth-right">

          <div className="register-card">

            <span className="brand-name">
              Smart Job Portal
            </span>

            <h2 className="login-title">
              Create Account
            </h2>

            <p className="login-subtitle">
              Join thousands of professionals
              finding jobs with AI.
            </p>

            <form
              onSubmit={handleRegister}
              autoComplete="off"
            >

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              {success && (
                <div className="success-box">
                  {success}
                </div>
              )}

                            <div className="input-group">

                <label>Full Name</label>

                <div className="input-icon-wrapper">

                  {/* <FiUser className="input-icon" /> */}

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="input-group">

                <label>Email Address</label>

                <div className="input-icon-wrapper">

                  {/* <FiMail className="input-icon" /> */}

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="password-wrapper">

                  {/* <FiLock className="input-icon" /> */}

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a strong password"
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

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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
                Already have an account?
              </p>

              <Link to="/login">
                Sign In
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;