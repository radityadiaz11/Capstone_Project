import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api", // sementara, nanti diganti sesuai info backend
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