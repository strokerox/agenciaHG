import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalUtilidad: 0,
    totalComisiones: 0,
    ventasMes: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, salesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/ventas/stats'),
        axios.get('http://localhost:5000/api/ventas/recent')
      ]);

      setStats(statsRes.data);
      setRecentSales(salesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted">Resumen de tu actividad comercial</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Ventas</p>
              <h2 className="stat-value">{formatCurrency(stats.totalVentas)}</h2>
              <p className="stat-change positive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="18 15 12 9 6 15" strokeWidth="2"/>
                </svg>
                +12.5% este mes
              </p>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Utilidad Total</p>
              <h2 className="stat-value">{formatCurrency(stats.totalUtilidad)}</h2>
              <p className="stat-change positive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="18 15 12 9 6 15" strokeWidth="2"/>
                </svg>
                +8.3% este mes
              </p>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 6v6l4 2" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Comisiones</p>
              <h2 className="stat-value">{formatCurrency(stats.totalComisiones)}</h2>
              <p className="stat-change positive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="18 15 12 9 6 15" strokeWidth="2"/>
                </svg>
                +15.7% este mes
              </p>
            </div>
          </div>

          <div className="stat-card stat-accent">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Ventas este mes</p>
              <h2 className="stat-value">{stats.ventasMes}</h2>
              <p className="stat-change positive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="18 15 12 9 6 15" strokeWidth="2"/>
                </svg>
                +22% vs mes anterior
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="recent-sales">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Ventas Recientes</h3>
                <a href="/reportes" className="btn btn-outline">Ver todas</a>
              </div>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Boleto</th>
                      <th>Pasajero</th>
                      <th>Ruta</th>
                      <th>Aerolínea</th>
                      <th>Venta</th>
                      <th>Utilidad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.length > 0 ? (
                      recentSales.map((sale) => (
                        <tr key={sale.id_transaccion}>
                          <td className="mono">{sale.numero_boleto || 'Reserva'}</td>
                          <td>{sale.pasajero}</td>
                          <td>{sale.ruta}</td>
                          <td>{sale.aerolinea}</td>
                          <td className="text-primary font-weight-600">{formatCurrency(sale.monto_venta)}</td>
                          <td className="text-success font-weight-600">{formatCurrency(sale.utilidad)}</td>
                          <td>
                            <span className={`badge ${sale.numero_boleto ? 'badge-success' : 'badge-warning'}`}>
                              {sale.numero_boleto ? 'Emitido' : 'Reserva'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No hay ventas recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Acciones Rápidas</h3>
              </div>
              <div className="quick-actions">
                <a href="/nueva-venta" className="quick-action">
                  <div className="quick-action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                      <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Nueva Venta</h4>
                    <p>Registrar boleto o reserva</p>
                  </div>
                </a>

                <a href="/clientes" className="quick-action">
                  <div className="quick-action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                      <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Gestionar Clientes</h4>
                    <p>Ver y editar clientes</p>
                  </div>
                </a>

                <a href="/reportes" className="quick-action">
                  <div className="quick-action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 3v18h18" strokeWidth="2"/>
                      <path d="M18 17l-5-5-3 3-4-4" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Ver Reportes</h4>
                    <p>Análisis y estadísticas</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h3 className="card-title">Top Aerolíneas</h3>
              </div>
              <div className="airline-list">
                <div className="airline-item">
                  <div className="airline-info">
                    <span className="airline-name">Iberia</span>
                    <span className="airline-count">3 ventas</span>
                  </div>
                  <div className="airline-bar">
                    <div className="airline-progress" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="airline-item">
                  <div className="airline-info">
                    <span className="airline-name">Plus Ultra</span>
                    <span className="airline-count">2 ventas</span>
                  </div>
                  <div className="airline-bar">
                    <div className="airline-progress" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div className="airline-item">
                  <div className="airline-info">
                    <span className="airline-name">Estelar</span>
                    <span className="airline-count">1 venta</span>
                  </div>
                  <div className="airline-bar">
                    <div className="airline-progress" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
