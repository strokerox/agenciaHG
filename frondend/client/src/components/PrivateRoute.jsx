import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, lo mandamos al login
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;