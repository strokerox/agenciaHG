import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient-1"></div>
        <div className="auth-gradient-2"></div>
        <div className="auth-gradient-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#FF6B35"/>
                <path d="M2 23L16 30L30 23V9L16 16L2 9V23Z" fill="#0A4D68"/>
              </svg>
            </div>
            <h1 className="auth-title">Bienvenido de vuelta</h1>
            <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                  <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
                </svg>
                Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
                </svg>
                Contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-sm"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeWidth="2"/>
                    <polyline points="10 17 15 12 10 7" strokeWidth="2"/>
                    <line x1="15" y1="12" x2="3" y2="12" strokeWidth="2"/>
                  </svg>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate aquí</Link></p>
          </div>
        </div>

        <div className="auth-info">
          <div className="info-card">
            <div className="info-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <polyline points="12 6 12 12 16 14" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Gestión en tiempo real</h3>
            <p>Controla todas tus ventas y comisiones en un solo lugar</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2"/>
                <path d="M2 17l10 5 10-5" strokeWidth="2"/>
                <path d="M2 12l10 5 10-5" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Reportes detallados</h3>
            <p>Analiza tu rendimiento con gráficos y estadísticas</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="8.5" cy="7" r="4" strokeWidth="2"/>
                <line x1="20" y1="8" x2="20" y2="14" strokeWidth="2"/>
                <line x1="23" y1="11" x2="17" y2="11" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Gestión de clientes</h3>
            <p>Mantén organizada toda la información de tus pasajeros</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
