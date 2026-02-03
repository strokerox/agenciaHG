const express = require('express');
const router = express.Router();
const boletoController = require('../controllers/boletoController');

// Cuando alguien entre a / (GET), ejecuta el controlador
router.get('/', boletoController.getBoletos);

module.exports = router;