import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import NuevaVenta from './pages/NuevaVenta';
import Dashboard from './pages/Dashboard'; 
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* El Navbar solo se mostrará si hay un token (opcional) */}
        <Navbar /> 
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nueva-venta" element={<NuevaVenta />} />
            {/* Agrega aquí otras rutas como /clientes o /reportes */}
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;