import { useEffect, useState } from "react";
import API, { getJobs } from "../services/api";
import JobCard from "./JobCard";
import "../styles/jobcard.css";
import "../styles/searchfilter.css";

function JobList() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        title: "",
        company: "",
        location: "",
        experience: "",
        type: "",
        page: 1,
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    // Fetch jobs when debounced filters change
    useEffect(() => {
        fetchJobs();
    }, [debouncedFilters]);

    const fetchJobs = async () => {
        setLoading(true);

        try {
            const response = await getJobs(debouncedFilters);

            setJobs(response.data.jobs || []);
            setTotalPages(response.data.pages || 1);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const response = await API.post(
                "/apply",
                { job_id: jobId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message);

        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Application Failed"
            );
        }
    };

    if (loading) {
        return <h2>Loading Jobs...</h2>;
    }

    return (
        <div>
            {/* Search & Filters */}

            <div className="search-filter-card">

                <div className="filter-grid">

                    <div className="input-group">
                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search Job Title"
                            value={filters.title}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    title: e.target.value,
                                    page: 1
                                })
                            }
                        />
                    </div>

                    <div className="input-group">
                        <span>🏢</span>

                        <input
                            type="text"
                            placeholder="Company"
                            value={filters.company}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    company: e.target.value,
                                    page: 1
                                })
                            }
                        />
                    </div>

                    <div className="input-group">
                        <span>📍</span>

                        <input
                            type="text"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    location: e.target.value,
                                    page: 1
                                })
                            }
                        />
                    </div>

                    <select
                        value={filters.experience}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                experience: e.target.value,
                                page: 1
                            })
                        }
                    >
                        <option value="">Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                    </select>

                    <select
                        value={filters.type}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                type: e.target.value,
                                page: 1
                            })
                        }
                    >
                        <option value="">Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                    </select>

                </div>

                <div className="filter-buttons">

                    <button
                        className="btn btn-primary"
                        onClick={fetchJobs}
                    >
                        Search
                    </button>

                    <button
                        className="btn btn-outline"
                        onClick={() =>
                            setFilters({
                                title: "",
                                company: "",
                                location: "",
                                experience: "",
                                type: "",
                                page: 1,
                            })
                        }
                    >
                        Clear
                    </button>

                </div>

            </div>
            {/* Jobs */}
            {jobs.length === 0 ? (
                <h2>No Jobs Found</h2>
            ) : (
                <div className="job-grid">
                    {jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            handleApply={handleApply}
                        />
                    ))}
                </div>
            )}
            {/* Pagination */}
            <div style={{ marginTop: "20px" }}>

                <button
                    disabled={filters.page === 1}
                    onClick={() =>
                        setFilters({
                            ...filters,
                            page: filters.page - 1
                        })
                    }
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {filters.page} of {totalPages}
                </span>

                <button
                    disabled={filters.page === totalPages}
                    onClick={() =>
                        setFilters({
                            ...filters,
                            page: filters.page + 1
                        })
                    }
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default JobList;