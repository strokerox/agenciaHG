const express = require('express');
const router = express.Router();

// Importación de Controladores 
const authController = require('../controllers/authController');
const ventaController = require('../controllers/ventaController'); 
const clientesController = require('../controllers/clientesController');
const db = require('../config/db'); // Importamos db una sola vez arriba

// --- RUTAS DE CLIENTES ---
router.get('/clientes', clientesController.obtenerClientes);
router.get('/clientes/:id', clientesController.obtenerClientePorId);
router.post('/clientes', clientesController.crearCliente);
router.put('/clientes/:id', clientesController.actualizarCliente);
router.delete('/clientes/:id', clientesController.eliminarCliente);

// --- RUTAS DE AUTENTICACIÓN ---
router.post('/auth/register', authController.registrarUsuario);
router.post('/auth/login', authController.loginUsuario);

// --- RUTAS DE VENTAS ---
router.post('/ventas', ventaController.crearVenta); // Usando ventaController (singular)
router.get('/ventas', ventaController.obtenerVentas);

// --- RUTAS AUXILIARES (Para llenar selects en el frontend) ---
// Quitamos el duplicado de /clientes porque ya está arriba
router.get('/aerolineas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM aerolineas');
        res.json(rows);
    } catch (error) {
        console.error("Error en /aerolineas:", error);
        res.status(500).json({ error: "Error al obtener aerolíneas" });
    }
});

module.exports = router;