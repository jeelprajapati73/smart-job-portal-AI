import "../styles/jobcard.css";

function JobCard({ job, handleApply }) {

  const skills = job.skills_required
    ? job.skills_required.split(",")
    : [];

  return (
    <div className="job-card">

      <div className="job-header">

        <div className="company-logo">
          {job.company?.charAt(0).toUpperCase()}
        </div>

        <span className="job-type">
          {job.type || "Full Time"}
        </span>

      </div>

      <h2>{job.title}</h2>

      <p className="company-name">
        {job.company}
      </p>

      <div className="job-info">

        <p>📍 {job.location}</p>

        <p>💰 {job.salary}</p>

        <p>💼 {job.experience_level}</p>

      </div>

      <div className="job-skills">

        {skills.map((skill, index) => (
          <span key={index} className="skill">
            {skill.trim()}
          </span>
        ))}

      </div>

      <button
        className="apply-btn"
        onClick={() => handleApply(job._id)}
      >
        Apply Now
      </button>

    </div>
  );
}

export default JobCard;