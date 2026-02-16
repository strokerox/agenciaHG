import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './NuevaVenta.css';

const NuevaVenta = () => {
  const [formData, setFormData] = useState({
    numero_boleto: '',
    tipo: 'BOLETO',
    ruta: '',
    fecha_ida: '',
    fecha_retorno: '',
    monto_neto: '',
    fee_emision: '',
    monto_venta: '',
    aerolinea_id: '',
    cliente_id: '',
    localizador: '',
    fecha_venta: ''
  });

  const [calculatedData, setCalculatedData] = useState({
    utilidad: 0,
    fee_comision: 0
  });

  const [aerolineas, setAerolineas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ nombre: '', apellido: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAerolineas();
    fetchClientes();
  }, []);

  useEffect(() => {
    calculateCommissions();
  }, [formData.monto_neto, formData.fee_emision, formData.monto_venta]);

  const fetchAerolineas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/aerolineas');
      setAerolineas(response.data);
    } catch (error) {
      console.error('Error fetching airlines:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const calculateCommissions = () => {
    const montoNeto = parseFloat(formData.monto_neto) || 0;
    const feeEmision = parseFloat(formData.fee_emision) || 0;
    const montoVenta = parseFloat(formData.monto_venta) || 0;

    const utilidad = montoVenta - montoNeto - feeEmision;
    const feeComision = utilidad * 0.20; // 20% de comisión

    setCalculatedData({
      utilidad: utilidad.toFixed(2),
      fee_comision: feeComision.toFixed(2)
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/clientes', newClient);
      setClientes([...clientes, response.data]);
      setFormData({ ...formData, cliente_id: response.data.id_cliente });
      setShowClientModal(false);
      setNewClient({ nombre: '', apellido: '' });
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ventaData = {
      ...formData,
      utilidad: calculatedData.utilidad,
      fee_comision: calculatedData.fee_comision
    };

    try {
      await axios.post('http://localhost:5000/api/ventas', ventaData);
      setSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          numero_boleto: '',
          tipo: 'BOLETO',
          ruta: '',
          fecha_ida: '',
          fecha_retorno: '',
          monto_neto: '',
          fee_emision: '',
          monto_venta: '',
          aerolinea_id: '',
          cliente_id: '',
          localizador: '',
          fecha_venta: ''
        });
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="nueva-venta-container">
        <div className="nueva-venta-header">
          <h1>Nueva Venta</h1>
          <p className="text-muted">Registra un nuevo boleto o reserva</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12" strokeWidth="2"/>
            </svg>
            ¡Venta registrada exitosamente!
          </div>
        )}

        <div className="nueva-venta-content">
          <form onSubmit={handleSubmit} className="venta-form">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Información del Boleto</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número de Boleto</label>
                  <input
                    type="text"
                    name="numero_boleto"
                    className="form-input"
                    placeholder="TK752112134945"
                    value={formData.numero_boleto}
                    onChange={handleChange}
                  />
                  <small className="form-hint">Dejar vacío para reservas</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <select
                    name="tipo"
                    className="form-select"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                  >
                    <option value="BOLETO">Boleto</option>
                    <option value="RESERVA">Reserva</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ruta *</label>
                  <input
                    type="text"
                    name="ruta"
                    className="form-input"
                    placeholder="CCS-MAD-CCS"
                    value={formData.ruta}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Localizador *</label>
                  <input
                    type="text"
                    name="localizador"
                    className="form-input"
                    placeholder="J1DDR"
                    value={formData.localizador}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de Ida *</label>
                  <input
                    type="date"
                    name="fecha_ida"
                    className="form-input"
                    value={formData.fecha_ida}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de Retorno</label>
                  <input
                    type="date"
                    name="fecha_retorno"
                    className="form-input"
                    value={formData.fecha_retorno}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de Venta</label>
                  <input
                    type="date"
                    name="fecha_venta"
                    className="form-input"
                    value={formData.fecha_venta}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Aerolínea *</label>
                  <select
                    name="aerolinea_id"
                    className="form-select"
                    value={formData.aerolinea_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar aerolínea</option>
                    {aerolineas.map((airline) => (
                      <option key={airline.id_aerolinea} value={airline.id_aerolinea}>
                        {airline.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cliente *</label>
                  <div className="flex gap-2">
                    <select
                      name="cliente_id"
                      className="form-select"
                      value={formData.cliente_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((client) => (
                        <option key={client.id_cliente} value={client.id_cliente}>
                          {client.nombre} {client.apellido}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-accent"
                      onClick={() => setShowClientModal(true)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h3 className="card-title">Información Financiera</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Monto Neto *</label>
                  <div className="input-group">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="monto_neto"
                      className="form-input"
                      placeholder="0.00"
                      value={formData.monto_neto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Fee de Emisión *</label>
                  <div className="input-group">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="fee_emision"
                      className="form-input"
                      placeholder="0.00"
                      value={formData.fee_emision}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Monto de Venta *</label>
                  <div className="input-group">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="monto_venta"
                      className="form-input"
                      placeholder="0.00"
                      value={formData.monto_venta}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="calculated-section">
                <div className="calculated-item">
                  <span className="calculated-label">Utilidad Calculada</span>
                  <span className="calculated-value success">
                    {formatCurrency(calculatedData.utilidad)}
                  </span>
                </div>
                <div className="calculated-item">
                  <span className="calculated-label">Comisión (20%)</span>
                  <span className="calculated-value primary">
                    {formatCurrency(calculatedData.fee_comision)}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-sm"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeWidth="2"/>
                      <polyline points="17 21 17 13 7 13 7 21" strokeWidth="2"/>
                      <polyline points="7 3 7 8 15 8" strokeWidth="2"/>
                    </svg>
                    Guardar Venta
                  </>
                )}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
                Cancelar
              </button>
            </div>
          </form>

          <div className="venta-sidebar">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Guía Rápida</h3>
              </div>
              <div className="guide-content">
                <div className="guide-item">
                  <div className="guide-number">1</div>
                  <div>
                    <h4>Datos del Boleto</h4>
                    <p>Ingresa la información del vuelo y localizador</p>
                  </div>
                </div>
                <div className="guide-item">
                  <div className="guide-number">2</div>
                  <div>
                    <h4>Selecciona Cliente</h4>
                    <p>Elige un cliente existente o crea uno nuevo</p>
                  </div>
                </div>
                <div className="guide-item">
                  <div className="guide-number">3</div>
                  <div>
                    <h4>Información Financiera</h4>
                    <p>Los cálculos se realizan automáticamente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showClientModal && (
          <div className="modal-overlay" onClick={() => setShowClientModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Nuevo Cliente</h3>
                <button className="modal-close" onClick={() => setShowClientModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddClient}>
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newClient.nombre}
                    onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newClient.apellido}
                    onChange={(e) => setNewClient({ ...newClient, apellido: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Agregar Cliente</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowClientModal(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NuevaVenta;
