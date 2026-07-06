import { useNavigate } from "react-router-dom";
import JobList from "../components/JobList";
import "../styles/dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      <div className="container">

        {/* Hero Section */}
        <div className="hero">
          <h1>Welcome Back 👋</h1>
          <p>
            Find your dream job with AI Resume Matching.
          </p>
        </div>

        {/* Top Actions */}
        <div className="dashboard-actions">

          <button
            className="btn btn-primary"
            onClick={() => navigate("/resume")}
          >
            AI Resume Matcher
          </button>

          <button
            className="btn btn-outline"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        {/* Jobs */}
        <div className="jobs-section">

          <h2 className="jobs-title">
            Latest Jobs
          </h2>

          <JobList />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;