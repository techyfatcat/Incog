import API from "../utils/api";

export const createGroup = (data) => API.post("/groups", data);
export const getGroups = () => API.get("/groups");
export const joinGroup = (code) => API.post(`/groups/join/${code}`);