import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8085/api"
});

export default API;
