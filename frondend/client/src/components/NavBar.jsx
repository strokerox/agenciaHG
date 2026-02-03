import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#FF6B35"/>
              <path d="M2 23L16 30L30 23V9L16 16L2 9V23Z" fill="#0A4D68"/>
            </svg>
            <span className="brand-name">AgenciaHG</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
            </svg>
            Dashboard
          </Link>

          <Link 
            to="/nueva-venta" 
            className={`nav-link ${isActive('/nueva-venta') ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
            </svg>
            Nueva Venta
          </Link>

          <Link 
            to="/reportes" 
            className={`nav-link ${isActive('/reportes') ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v18h18" strokeWidth="2"/>
              <path d="M18 17l-5-5-3 3-4-4" strokeWidth="2"/>
            </svg>
            Reportes
          </Link>

          <Link 
            to="/clientes" 
            className={`nav-link ${isActive('/clientes') ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2"/>
            </svg>
            Clientes
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.nombre}</span>
              <span className="user-role">{user?.rol}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2"/>
              <polyline points="16 17 21 12 16 7" strokeWidth="2"/>
              <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2"/>
            </svg>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
