import axios from "axios";

const api = axios.create({
    // Trigger Vercel Deployment update
    baseURL: import.meta.env.VITE_API_URL || "https://capstone-sssr.vercel.app/api/v1", // tersambung ke backend cloud v1
    // baseURL: "http://localhost:3000/api/v1", // tersambung ke backend local v1
    headers: {
        "Content-Type": "application/json",
    },
});

// Otomatis kirim token JWT setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;