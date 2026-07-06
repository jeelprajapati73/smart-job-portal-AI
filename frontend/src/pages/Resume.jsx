import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "../styles/resume.css";

function Resume() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      await axios.post("/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully.");
    } catch (err) {
      alert(err.response?.data?.detail || "Upload Failed");
    }
  };

  const handleMatch = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/resume-match", formData);

      setResults(res.data);
    } catch {
      alert("Resume Matching Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">

      <div className="resume-container">

        {/* Back Button */}

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Upload Card */}

        <div className="resume-card">

          <div className="resume-icon">
            📄
          </div>

          <h1>AI Resume Matcher</h1>

          <p>
            Upload your resume and let AI find the best matching jobs
            based on your skills.
          </p>

          <div className="upload-box">

        <p style={{marginBottom:"15px",fontWeight:"600"}}>
            📄  Choose your Resume (.txt)
        </p>

            <input
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <div className="selected-file">
                Selected File:
                <strong> {file.name}</strong>
              </div>
            )}

          </div>

          <div className="resume-buttons">

            <button
              className="upload-btn"
              onClick={handleUpload}
            >
              Upload Resume
            </button>

            <button
              className="match-btn"
              onClick={handleMatch}
            >
              {loading ? "Matching..." : "Match Resume"}
            </button>

          </div>

        </div>

        {/* Results */}

        {results.length > 0 && (

          <div className="results-section">

            <h2>AI Match Results</h2>

            <div className="result-grid">

{results.map((job, index) => {

  const score = Number(job.score);

  const quality =
    score >= 90
      ? "Excellent Match"
      : score >= 75
      ? "Very Good Match"
      : score >= 60
      ? "Good Match"
      : "Low Match";

  const color =
    score >= 90
      ? "#16a34a"
      : score >= 75
      ? "#f59e0b"
      : "#ef4444";

  return (

    <div
      className="result-card"
      key={job.job_id}
    >

      {index === 0 && (
        <div className="best-badge">
          ⭐ Best Match
        </div>
      )}

      <div className="company-avatar">
        {job.company.charAt(0).toUpperCase()}
      </div>

      <h3>{job.title}</h3>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <div className="score-box">

        <span>Match Score</span>

        <strong style={{ color }}>
          {score.toFixed(2)}%
        </strong>

      </div>

      <div className="progress">

        <div
          className="progress-fill"
          style={{
            width: `${score}%`
          }}
        />

      </div>

      <div
        className="match-quality"
        style={{ color }}
      >
        {quality}
      </div>

    </div>

  );

})}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Resume;