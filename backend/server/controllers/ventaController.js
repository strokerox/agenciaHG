const db = require('../config/db');

// CREAR NUEVA VENTA (BOLETO)
exports.crearVenta = async (req, res) => {
  const connection = await db.getConnection(); // se usa transacción para seguridad
  try {
    await connection.beginTransaction();

    const { 
      numero_boleto, tipo, ruta, fecha_ida, fecha_retorno,
      monto_neto, fee_emision, monto_venta, // Datos financieros
      aerolinea_id, cliente_id, localizador // Relaciones
    } = req.body;

    // --- LÓGICA DE CÁLCULO AUTOMÁTICO ---
    const neto = parseFloat(monto_neto) || 0;
    const venta = parseFloat(monto_venta) || 0;
    const fee = parseFloat(fee_emision) || 0;

    // 1. Calcular Utilidad (Venta Total - Costo Neto - Fee de Emisión)
    const utilidad = venta - neto - fee;

    // 2. Calcular Comisión (Ejemplo: 20% de la utilidad)
    const PORCENTAJE_COMISION = 0.20; 
    const fee_comision = utilidad * PORCENTAJE_COMISION;

    // --- MANEJO DE RELACIONES (Foreign Keys) ---
    
    // A. Verificar/Crear Localizador en tabla RESERVAS
    // Si el localizador no existe, lo creamos al vuelo
    const [reservaExist] = await connection.query('SELECT * FROM reservas WHERE localizador = ?', [localizador]);
    if (reservaExist.length === 0) {
        await connection.query('INSERT INTO reservas (localizador, fecha_venta) VALUES (?, NOW())', [localizador]);
    }

    // B. Insertar el Boleto con los cálculos ya hechos
    const query = `
      INSERT INTO boletos 
      (numero_boleto, tipo, ruta, fecha_ida, fecha_retorno, 
       monto_neto, fee_emision, monto_venta, utilidad, fee_comision,
       aerolinea_id, cliente_id, localizador_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(query, [
      numero_boleto, tipo || 'BOLETO', ruta, fecha_ida, fecha_retorno,
      neto, fee, venta, utilidad, fee_comision,
      aerolinea_id, cliente_id, localizador
    ]);

    await connection.commit();
    res.status(201).json({ msg: 'Venta registrada con éxito', utilidad, comision: fee_comision });

  } catch (error) {
    await connection.rollback(); // Si falla algo, deshace todos los cambios
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  } finally {
    connection.release();
  }
};

// OBTENER REPORTE (Para el Dashboard)
exports.obtenerVentas = async (req, res) => {
  try {
    // Esta consulta replica el SELECT final de tu archivo SQL
    const query = `
      SELECT 
        b.id_transaccion,
        r.localizador,
        b.numero_boleto,
        CONCAT(c.nombre, ' ', c.apellido) as pasajero,
        a.nombre as aerolinea,
        b.ruta,
        b.monto_venta,
        b.utilidad,
        b.fee_comision
      FROM boletos b
      JOIN clientes c ON b.cliente_id = c.id_cliente
      JOIN aerolineas a ON b.aerolinea_id = a.id_aerolinea
      JOIN reservas r ON b.localizador_id = r.localizador
      ORDER BY b.id_transaccion DESC
    `;
    const [ventas] = await db.query(query);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};