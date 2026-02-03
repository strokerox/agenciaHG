import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const NuevaVenta = () => {
    const navigate = useNavigate();
    
    // Listas para los Selects
    const [clientes, setClientes] = useState([]);
    const [aerolineas, setAerolineas] = useState([]);

    // Estado del Formulario
    const [form, setForm] = useState({
        localizador: '',
        numero_boleto: '',
        tipo: 'BOLETO',
        ruta: '',
        fecha_ida: '',
        fecha_retorno: '',
        aerolinea_id: '',
        cliente_id: '',
        monto_neto: 0,
        fee_emision: 0,
        monto_venta: 0
    });

    // Estado para cálculos visuales (Read-only)
    const [calculos, setCalculos] = useState({ utilidad: 0, comision: 0 });

    // 1. Cargar Aerolíneas y Clientes al iniciar
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCli = await api.get('/clientes');
                const resAer = await api.get('/aerolineas');
                setClientes(resCli.data);
                setAerolineas(resAer.data);
            } catch (error) {
                console.error("Error cargando datos auxiliares", error);
            }
        };
        fetchData();
    }, []);

    // 2. Calcular Utilidad en Tiempo Real
    useEffect(() => {
        const neto = parseFloat(form.monto_neto) || 0;
        const venta = parseFloat(form.monto_venta) || 0;
        const fee = parseFloat(form.fee_emision) || 0;

        const utilidad = venta - neto - fee;
        const comision = utilidad * 0.20; // 20% Ejemplo

        setCalculos({ 
            utilidad: utilidad.toFixed(2), 
            comision: comision.toFixed(2) 
        });
    }, [form.monto_neto, form.monto_venta, form.fee_emision]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/ventas', form);
            alert('Venta registrada correctamente');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Error al guardar la venta');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registrar Nueva Venta</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* --- SECCIÓN 1: DATOS DEL VUELO --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-blue-600">Datos del Vuelo</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Localizador (PNR)</label>
                        <input name="localizador" required onChange={handleChange} className="mt-1 w-full p-2 border rounded uppercase" maxLength="6" placeholder="EJ: XJ5K9L" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Aerolínea</label>
                        <select name="aerolinea_id" required onChange={handleChange} className="mt-1 w-full p-2 border rounded">
                            <option value="">Seleccione...</option>
                            {aerolineas.map(a => (
                                <option key={a.id_aerolinea} value={a.id_aerolinea}>{a.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número de Boleto</label>
                        <input name="numero_boleto" onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="TK..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ruta</label>
                        <input name="ruta" required onChange={handleChange} className="mt-1 w-full p-2 border rounded uppercase" placeholder="CCS-MAD-CCS" />
                    </div>
                </div>

                {/* --- SECCIÓN 2: CLIENTE Y FECHAS --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-blue-600">Cliente y Fechas</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cliente</label>
                        <select name="cliente_id" required onChange={handleChange} className="mt-1 w-full p-2 border rounded">
                            <option value="">Seleccione...</option>
                            {clientes.map(c => (
                                <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ida</label>
                            <input type="date" name="fecha_ida" onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Retorno</label>
                            <input type="date" name="fecha_retorno" onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN 3: FINANZAS (Full Width) --- */}
                <div className="md:col-span-2 border-t pt-4">
                    <h3 className="font-semibold text-blue-600 mb-4">Datos Financieros</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Inputs */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monto Neto (Costo)</label>
                            <input type="number" step="0.01" name="monto_neto" onChange={handleChange} className="mt-1 w-full p-2 border border-red-300 rounded focus:ring-red-200" placeholder="0.00" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fee Emisión</label>
                            <input type="number" step="0.01" name="fee_emision" onChange={handleChange} className="mt-1 w-full p-2 border border-yellow-300 rounded" placeholder="0.00" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Venta (Cobrado)</label>
                            <input type="number" step="0.01" name="monto_venta" onChange={handleChange} className="mt-1 w-full p-2 border border-green-300 rounded font-bold" placeholder="0.00" />
                        </div>
                    </div>

                    {/* Resultados Visuales */}
                    <div className="mt-6 p-4 bg-gray-50 rounded flex justify-between items-center">
                        <div>
                            <span className="text-gray-500 text-sm">Utilidad Estimada:</span>
                            <p className={`text-xl font-bold ${calculos.utilidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${calculos.utilidad}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Comisión Agente (20%):</span>
                            <p className="text-xl font-bold text-blue-600">${calculos.comision}</p>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
                            Registrar Venta
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default NuevaVenta;