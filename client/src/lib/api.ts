import axios from "axios";
import { getCookie, setCookie } from "./cookieUtils";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use(
    (config) => {

        const token = getCookie("token");

        console.log("TOKEN =", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("REQUEST HEADERS =", config.headers);

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const response =
                    await api.post("/auth/refresh-token");

                const newToken = response.data.accessToken;

                if (newToken) {

                    setCookie("token", newToken, 12);

                    originalRequest.headers.Authorization =
                        `Bearer ${newToken}`;

                    return api(originalRequest);
                }

            } catch (refreshError) {

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;