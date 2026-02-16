import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Reportes.css';

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [filters, setFilters] = useState({
    aerolinea: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: ''
  });
  const [aerolineas, setAerolineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    utilidad: 0,
    comisiones: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, ventas]);

  const fetchData = async () => {
    try {
      const [ventasRes, aereolineasRes] = await Promise.all([
        axios.get('http://localhost:5000/api/ventas'),
        axios.get('http://localhost:5000/api/aerolineas')
      ]);

      setVentas(ventasRes.data);
      setFilteredVentas(ventasRes.data);
      setAerolineas(aereolineasRes.data);
      calculateStats(ventasRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...ventas];

    if (filters.aerolinea) {
      filtered = filtered.filter(v => v.aerolinea === filters.aerolinea);
    }

    if (filters.tipo) {
      filtered = filtered.filter(v => v.tipo === filters.tipo);
    }

    if (filters.fechaInicio) {
      filtered = filtered.filter(v => new Date(v.fecha_ida) >= new Date(filters.fechaInicio));
    }

    if (filters.fechaFin) {
      filtered = filtered.filter(v => new Date(v.fecha_ida) <= new Date(filters.fechaFin));
    }

    setFilteredVentas(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (data) => {
    const total = data.reduce((sum, v) => sum + parseFloat(v.monto_venta || 0), 0);
    const utilidad = data.reduce((sum, v) => sum + parseFloat(v.utilidad || 0), 0);
    const comisiones = data.reduce((sum, v) => sum + parseFloat(v.fee_comision || 0), 0);

    setStats({ total, utilidad, comisiones });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      aerolinea: '',
      fechaInicio: '',
      fechaFin: '',
      tipo: ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
      try {
        await axios.delete(`http://localhost:5000/api/ventas/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-VE');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="reportes-loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="reportes-container">
        <div className="reportes-header">
          <div>
            <h1>Reportes de Ventas</h1>
            <p className="text-muted">Analiza y filtra tus transacciones</p>
          </div>
        </div>

        <div className="filters-card card">
          <div className="filters-header">
            <h3>Filtros</h3>
            <button className="btn-text" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Aerolínea</label>
              <select
                name="aerolinea"
                className="form-select"
                value={filters.aerolinea}
                onChange={handleFilterChange}
              >
                <option value="">Todas</option>
                {aerolineas.map((a) => (
                  <option key={a.id_aerolinea} value={a.nombre}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select
                name="tipo"
                className="form-select"
                value={filters.tipo}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="BOLETO">Boleto</option>
                <option value="RESERVA">Reserva</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Desde</label>
              <input
                type="date"
                name="fechaInicio"
                className="form-input"
                value={filters.fechaInicio}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hasta</label>
              <input
                type="date"
                name="fechaFin"
                className="form-input"
                value={filters.fechaFin}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <div className="stats-summary">
          <div className="summary-item">
            <div className="summary-icon primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <p className="summary-label">Total Ventas</p>
              <p className="summary-value">{formatCurrency(stats.total)}</p>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <p className="summary-label">Utilidad Total</p>
              <p className="summary-value">{formatCurrency(stats.utilidad)}</p>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 6v6l4 2" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <p className="summary-label">Comisiones</p>
              <p className="summary-value">{formatCurrency(stats.comisiones)}</p>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="8.5" cy="7" r="4" strokeWidth="2"/>
                <line x1="20" y1="8" x2="20" y2="14" strokeWidth="2"/>
                <line x1="23" y1="11" x2="17" y2="11" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <p className="summary-label">Total Transacciones</p>
              <p className="summary-value">{filteredVentas.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Todas las Ventas ({filteredVentas.length})</h3>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Localizador</th>
                  <th>Boleto</th>
                  <th>Pasajero</th>
                  <th>Ruta</th>
                  <th>Aerolínea</th>
                  <th>Fecha</th>
                  <th>Venta</th>
                  <th>Utilidad</th>
                  <th>Comisión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVentas.length > 0 ? (
                  filteredVentas.map((venta) => (
                    <tr key={venta.id_transaccion}>
                      <td className="mono">{venta.localizador}</td>
                      <td className="mono">{venta.numero_boleto || '-'}</td>
                      <td>{venta.pasajero}</td>
                      <td>{venta.ruta}</td>
                      <td>{venta.aerolinea}</td>
                      <td>{formatDate(venta.fecha_ida)}</td>
                      <td className="font-weight-600">{formatCurrency(venta.monto_venta)}</td>
                      <td className="text-success font-weight-600">{formatCurrency(venta.utilidad)}</td>
                      <td className="text-primary font-weight-600">{formatCurrency(venta.fee_comision)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => handleDelete(venta.id_transaccion)}
                            title="Eliminar"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <polyline points="3 6 5 6 21 6" strokeWidth="2"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted">
                      No se encontraron ventas con los filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reportes;
