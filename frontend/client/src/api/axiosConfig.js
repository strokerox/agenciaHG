import axios from 'axios';

const api = axios.create({
    // Reemplaza esto con la URL real que te dio Render al desplegar el backend
    baseURL: 'agenciahg-production.up.railway.app', 
});

// Mantener el interceptor del token que creamos antes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

