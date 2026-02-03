const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importación de Rutas
const apiRoutes = require('./routes/api'); 
const app = express();

// --- MIDDLEWARES ---
// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors()); 

// Middleware para parsear JSON (esencial para recibir datos de los formularios)
app.use(express.json()); 

// Middleware para logs básicos (opcional, ayuda a debugear en Render)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- RUTAS ---

// Ruta de prueba para verificar que el servidor está online
app.get('/', (req, res) => {
  res.send('Servidor de Agencia HG operando correctamente 🚀');
});

// Uso de las rutas unificadas
app.use('/api', apiRoutes);

// --- MANEJO DE ERRORES ---
// Captura rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ msg: 'Ruta no encontrada' });
});

// --- SERVIDOR ---

// Render requiere '0.0.0.0' para exponer el servicio correctamente
const PORT = process.env.PORT || 16249; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ==========================================
  Servidor Agencia HG corriendo exitosamente
  Puerto: ${PORT}
  Ambiente: ${process.env.NODE_ENV || 'desarrollo'}
  ==========================================
  `);
  const cors = require('cors');
app.use(cors());
});