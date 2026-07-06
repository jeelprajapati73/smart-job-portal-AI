import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

export const getJobs = (params) => {
    return API.get("/jobs", { params });
};

export default API;