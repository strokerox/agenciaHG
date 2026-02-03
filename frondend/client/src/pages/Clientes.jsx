import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    filterClientes();
  }, [searchTerm, clientes]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes');
      setClientes(response.data);
      setFilteredClientes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const filterClientes = () => {
    if (!searchTerm) {
      setFilteredClientes(clientes);
      return;
    }

    const filtered = clientes.filter(cliente =>
      `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingClient) {
        await axios.put(`http://localhost:5000/api/clientes/${editingClient.id_cliente}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/clientes', formData);
      }

      fetchClientes();
      closeModal();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (cliente) => {
    setEditingClient(cliente);
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`http://localhost:5000/api/clientes/${id}`);
        fetchClientes();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('No se puede eliminar este cliente porque tiene ventas asociadas');
      }
    }
  };

  const openModal = () => {
    setEditingClient(null);
    setFormData({ nombre: '', apellido: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ nombre: '', apellido: '' });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="clientes-loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="clientes-container">
        <div className="clientes-header">
          <div>
            <h1>Gestión de Clientes</h1>
            <p className="text-muted">Administra la información de tus pasajeros</p>
          </div>
          <button className="btn btn-primary" onClick={openModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
              <circle cx="8.5" cy="7" r="4" strokeWidth="2"/>
              <line x1="20" y1="8" x2="20" y2="14" strokeWidth="2"/>
              <line x1="23" y1="11" x2="17" y2="11" strokeWidth="2"/>
            </svg>
            Nuevo Cliente
          </button>
        </div>

        <div className="search-bar card">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar clientes por nombre o apellido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="clientes-grid">
          {filteredClientes.length > 0 ? (
            filteredClientes.map((cliente) => (
              <div key={cliente.id_cliente} className="cliente-card">
                <div className="cliente-avatar">
                  {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                </div>
                <div className="cliente-info">
                  <h3 className="cliente-name">{cliente.nombre} {cliente.apellido}</h3>
                  <p className="cliente-id">ID: {cliente.id_cliente}</p>
                </div>
                <div className="cliente-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(cliente)}
                    title="Editar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDelete(cliente.id_cliente)}
                    title="Eliminar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" strokeWidth="2"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2"/>
              </svg>
              <h3>No se encontraron clientes</h3>
              <p>Intenta con otro término de búsqueda o crea un nuevo cliente</p>
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeWidth="2"/>
                      <polyline points="17 21 17 13 7 13 7 21" strokeWidth="2"/>
                      <polyline points="7 3 7 8 15 8" strokeWidth="2"/>
                    </svg>
                    {editingClient ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={closeModal}>
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

export default Clientes;
