import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8085/api";
const API = axios.create({
    baseURL: apiBaseUrl.endsWith("/api") ? apiBaseUrl : `${apiBaseUrl}/api`
});

export default API;
