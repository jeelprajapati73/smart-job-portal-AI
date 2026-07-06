import { useState } from "react";
import axios from "../services/api";

function ResumeUpload() {

    const [file, setFile] = useState(null);
    const [results, setResults] = useState([]);

    const handleUpload = async () => {

        if (!file) {
            alert("Select Resume");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        const token = localStorage.getItem("token");

        try {

            await axios.post(
                "/upload-resume",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Resume Uploaded");

        } catch (err) {

            alert(err.response?.data?.detail || "Upload Failed");
        }
    };

    const handleMatch = async () => {

        if (!file) return;

        const formData = new FormData();

        formData.append("file", file);

        try {

            const res = await axios.post(
                "/resume-match",
                formData
            );

            setResults(res.data);

        } catch {

            alert("Matching Failed");
        }

    };

    return (
        <div className="container">

            <h2>AI Resume Matcher</h2>

            <input
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br /><br />

            <button onClick={handleUpload}>
                Upload Resume
            </button>

            <button
                onClick={handleMatch}
                style={{ marginLeft: "10px" }}
            >
                Match Resume
            </button>

            <hr />

            {
                results.map((job) => (

                    <div key={job.job_id}>

                        <h3>{job.title}</h3>

                        <p>Company : {job.company}</p>

                        <p>
                            Match Score :
                            <b> {job.score.toFixed(2)}%</b>
                        </p>

                    </div>

                ))
            }

        </div>
    );
}

export default ResumeUpload;