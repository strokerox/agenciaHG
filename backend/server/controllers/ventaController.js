const db = require('../config/db.js'); 

// CREAR NUEVA VENTA (BOLETO)
exports.crearVenta = async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection(); // Obtener una conexión del pool para la transacción
        await connection.beginTransaction();

        const { 
            numero_boleto, tipo, ruta, fecha_ida, fecha_retorno,
            monto_neto, fee_emision, monto_venta,
            aerolinea_id, cliente_id, localizador 
        } = req.body;

        // --- LÓGICA DE CÁLCULO SEGURO ---
        const neto = parseFloat(monto_neto) || 0;
        const venta = parseFloat(monto_venta) || 0;
        const fee = parseFloat(fee_emision) || 0;

        // Utilidad = Venta - Costo Neto - Fee
        // $utilidad = venta - neto - fee$
        const utilidad = venta - neto - fee;

        const PORCENTAJE_COMISION = 0.20; 
        const fee_comision = utilidad * PORCENTAJE_COMISION;

        // --- MANEJO DE RELACIONES (RESERVAS) ---
        // Verificar si el localizador existe, si no, crearlo
        const [reservaExist] = await connection.query(
            'SELECT localizador FROM reservas WHERE localizador = ?', 
            [localizador]
        );

        if (reservaExist.length === 0) {
            await connection.query(
                'INSERT INTO reservas (localizador, fecha_venta) VALUES (?, NOW())', 
                [localizador]
            );
        }

        // --- INSERTAR EL BOLETO ---
        // Limpiamos fechas: si vienen vacías, enviamos null para evitar errores de MySQL
        const f_ida = fecha_ida || null;
        const f_retorno = fecha_retorno || null;

        const query = `
            INSERT INTO boletos 
            (numero_boleto, tipo, ruta, fecha_ida, fecha_retorno, 
             monto_neto, fee_emision, monto_venta, utilidad, fee_comision,
             aerolinea_id, cliente_id, localizador_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(query, [
            numero_boleto, 
            tipo || 'BOLETO', 
            ruta, 
            f_ida, 
            f_retorno,
            neto, 
            fee, 
            venta, 
            utilidad, 
            fee_comision,
            aerolinea_id, 
            cliente_id, 
            localizador // Se asume que localizador_id guarda el código string
        ]);

        await connection.commit();
        res.status(201).json({ 
            msg: 'Venta registrada con éxito', 
            utilidad, 
            comision: fee_comision 
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error en crearVenta:", error);
        res.status(500).json({ error: 'Error al procesar la venta', detalle: error.message });
    } finally {
        if (connection) connection.release(); // Siempre liberar la conexión al pool
    }
}

// OBTENER REPORTE (Dashboard)
exports.obtenerVentas = async function (req, res) {
    try {
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
            LEFT JOIN clientes c ON b.cliente_id = c.id_cliente
            LEFT JOIN aerolineas a ON b.aerolinea_id = a.id_aerolinea
            LEFT JOIN reservas r ON b.localizador_id = r.localizador
            ORDER BY b.id_transaccion DESC
        `;
        const [ventas] = await db.query(query);
        res.json(ventas);
    } catch (error) {
        console.error("Error en obtenerVentas:", error);
        res.status(500).json({ error: 'Error al obtener el reporte' });
    }
}