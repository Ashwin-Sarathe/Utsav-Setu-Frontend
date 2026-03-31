import axios from 'axios';

// 1. Create the base connection to your Spring Boot server
const api = axios.create({
    // Make sure this matches your Spring Boot port (usually 8080)
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Set up the "Interceptor" (The Toll Booth)
api.interceptors.request.use(
    (config) => {
        // If the request is going to /auth/login or /auth/register, skip the token
        if (!config.url.includes('/auth/')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;