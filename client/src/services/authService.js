import API from "./api";

export const loginUser = async (email, password) => {
    return await API.post("/auth/login", { email, password });
};

export const registerUser = async (name, email, password, role, section) => {
    return await API.post("/auth/register", { name, email, password, role, section });
};
