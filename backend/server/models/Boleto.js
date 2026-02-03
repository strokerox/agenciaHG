const db = require('../config/db');

class Boleto {
    static async obtenerTodos() {
        // Esta consulta une las 4 tablas para darte una vista completa
        const query = `
            SELECT 
                b.id_transaccion,
                r.localizador,
                b.numero_boleto,
                CONCAT(c.nombre, ' ', c.apellido) as pasajero,
                a.nombre as aerolinea,
                b.ruta,
                b.fecha_ida,
                b.monto_venta,
                b.utilidad
            FROM boletos b
            JOIN clientes c ON b.cliente_id = c.id_cliente
            JOIN aerolineas a ON b.aerolinea_id = a.id_aerolinea
            JOIN reservas r ON b.localizador_id = r.localizador
        `;
        
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = Boleto;