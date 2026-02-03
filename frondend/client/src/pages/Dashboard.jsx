import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVentas = async () => {
        try {
            const res = await api.get('/ventas');
            setVentas(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener ventas", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            try {
                await api.delete(`/ventas/${id}`);
                setVentas(ventas.filter(v => v.id_transaccion !== id));
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // Cálculos de totales para el resumen superior
    const totalVentas = ventas.reduce((acc, curr) => acc + parseFloat(curr.monto_venta), 0);
    const totalComisiones = ventas.reduce((acc, curr) => acc + parseFloat(curr.fee_comision), 0);

    if (loading) return <div className="p-10 text-center">Cargando datos...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Control - Agencia HG</h1>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Ventas Totales</p>
                    <p className="text-2xl font-bold text-gray-800">${totalVentas.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Comisiones Acumuladas</p>
                    <p className="text-2xl font-bold text-green-600">${totalComisiones.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Boletos Emitidos</p>
                    <p className="text-2xl font-bold text-gray-800">{ventas.length}</p>
                </div>
            </div>

            {/* Tabla de Datos */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <th className="px-5 py-3 border-b">Localizador</th>
                            <th className="px-5 py-3 border-b">Pasajero</th>
                            <th className="px-5 py-3 border-b">Aerolínea / Ruta</th>
                            <th className="px-5 py-3 border-b">Venta</th>
                            <th className="px-5 py-3 border-b">Comisión</th>
                            <th className="px-5 py-3 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {ventas.map((v) => (
                            <tr key={v.id_transaccion} className="hover:bg-gray-50">
                                <td className="px-5 py-4 border-b">
                                    <span className="font-bold text-blue-700">{v.localizador}</span>
                                    <br /><span className="text-xs text-gray-400">{v.numero_boleto}</span>
                                </td>
                                <td className="px-5 py-4 border-b">{v.pasajero}</td>
                                <td className="px-5 py-4 border-b">
                                    {v.aerolinea} <br />
                                    <span className="text-xs text-gray-500">{v.ruta}</span>
                                </td>
                                <td className="px-5 py-4 border-b font-semibold">${v.monto_venta}</td>
                                <td className="px-5 py-4 border-b text-green-600 font-bold">${v.fee_comision}</td>
                                <td className="px-5 py-4 border-b text-right">
                                    <button 
                                        onClick={() => handleDelete(v.id_transaccion)}
                                        className="text-red-500 hover:text-red-700 font-medium"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;