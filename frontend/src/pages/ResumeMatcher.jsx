import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResumeMatcher() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://127.0.0.1:8000/resume-match",
      formData
    );

    setResults(response.data);
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h1>🤖 AI Resume Matcher</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Match Resume
      </button>

      <br />
      <br />

      {results.map((job) => (
        <div
          key={job.job_id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>{job.title}</h2>

          <p>
            <strong>Company:</strong> {job.company}
          </p>

          <p>
            <strong>Match Score:</strong> {job.score}%
          </p>

          <div
            style={{
              width: "100%",
              height: "20px",
              background: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${job.score}%`,
                height: "100%",
                background: "green",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResumeMatcher;