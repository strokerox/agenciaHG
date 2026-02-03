import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!localStorage.getItem('token')) return null;

    return (
        <nav className="bg-blue-800 text-white p-4 shadow-lg flex justify-between items-center">
            <div className="flex space-x-6 items-center">
                <h1 className="text-xl font-bold tracking-tight">AGENCIA HG</h1>
                <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                <Link to="/nueva-venta" className="hover:text-blue-200 transition">Nueva Venta</Link>
            </div>
            
            <div className="flex items-center space-x-4">
                <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
                    👤 {user?.nombre} ({user?.rol})
                </span>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                >
                    Salir
                </button>
            </div>
        </nav>
    );
};

export default Navbar;