const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ventasController = require('../controllers/ventasController');
const clientesController = require('../controllers/clientesController');
// const authMiddleware = require('../middleware/authMiddleware'); // (Opcional para proteger rutas)

// Rutas de Clientes
router.get('/clientes', clientesController.obtenerClientes);
router.get('/clientes/:id', clientesController.obtenerClientePorId);
router.post('/clientes', clientesController.crearCliente);
router.put('/clientes/:id', clientesController.actualizarCliente);
router.delete('/clientes/:id', clientesController.eliminarCliente);

// Rutas de Autenticación
router.post('/auth/register', authController.registrarUsuario);
router.post('/auth/login', authController.loginUsuario);

// Rutas de Ventas
// router.use('/ventas', authMiddleware); // Descomentar para exigir login
router.post('/ventas', ventasController.crearVenta);
router.get('/ventas', ventasController.obtenerVentas);

// Rutas Auxiliares (Para llenar los selects del formulario)
router.get('/clientes', async (req, res) => {
    const [rows] = await require('../config/db').query('SELECT * FROM clientes');
    res.json(rows);
});
router.get('/aerolineas', async (req, res) => {
    const [rows] = await require('../config/db').query('SELECT * FROM aerolineas');
    res.json(rows);
});

module.exports = router;

