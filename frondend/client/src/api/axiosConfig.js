import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3306/api', // Ajusta el puerto según tu backend
});

// Interceptor para agregar el Token a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;