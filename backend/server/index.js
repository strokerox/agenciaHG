const express = require('express');
const cors = require('cors');
const boletoRoutes = require('./routes/boletoRoutes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones externas
app.use(express.json()); // Permite leer JSON

// Rutas
app.use('/api/boletos', boletoRoutes);

// Servidor
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});