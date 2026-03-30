import API from "./api";

export const getAttendance = async () => {
    return await API.get("/attendance/all");
};

export const getUsers = async () => {
    return await API.get("/auth/users");
};
