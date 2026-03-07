import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

// Helper to process the queue of failed requests
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        // Don't attach access token when refreshing
        if (token && !config.url.includes("/auth/refresh-token")) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If a refresh is already in progress, wait for it to finish
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    // Hit your refresh endpoint
                    const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });

                    const newToken = data.accessToken;
                    localStorage.setItem("token", newToken);

                    // Update headers and process the waiting queue
                    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    processQueue(null, newToken);

                    resolve(api(originalRequest));
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    // Critical failure: Wipe session and go to auth
                    localStorage.clear();
                    window.location.href = "/auth";
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        return Promise.reject(error);
    }
);

export default api;