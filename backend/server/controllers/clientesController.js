const db = require('../config/db.js');

/**
 * Obtener todos los clientes
 * GET /api/clientes
 */
exports.obtenerClientes = async (req, res) => {
    try {
        // Ordenamos por nombre para facilitar la búsqueda en los selectores del frontend
        const [rows] = await db.query('SELECT * FROM clientes ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ msg: 'Error al obtener la lista de clientes' });
    }
};

/**
 * Obtener un cliente por ID
 * GET /api/clientes/:id
 */
exports.obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

/**
 * Crear un nuevo cliente
 * POST /api/clientes
 */
exports.crearCliente = async (req, res) => {
    try {
        const { nombre, apellido } = req.body;

        // Validación básica
        if (!nombre || !apellido) {
            return res.status(400).json({ msg: 'Nombre y apellido son requeridos' });
        }

        // Insertar en la tabla clientes según el esquema adjunto
        const [result] = await db.query(
            'INSERT INTO clientes (nombre, apellido) VALUES (?, ?)',
            [nombre.toUpperCase(), apellido.toUpperCase()]
        );

        res.status(201).json({
            msg: 'Cliente registrado correctamente',
            id_cliente: result.insertId,
            nombre,
            apellido
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ msg: 'Error al registrar el cliente' });
    }
};

/**
 * Actualizar datos de un cliente
 * PUT /api/clientes/:id
 */
exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido } = req.body;

        const [result] = await db.query(
            'UPDATE clientes SET nombre = ?, apellido = ? WHERE id_cliente = ?',
            [nombre.toUpperCase(), apellido.toUpperCase(), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        res.json({ msg: 'Cliente actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar' });
    }
};

/**
 * Eliminar un cliente
 * DELETE /api/clientes/:id
 */
exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        // Nota: Debido a las claves foráneas en la tabla 'boletos', 
        // no se podrá eliminar un cliente que ya tenga boletos asociados
        // a menos que se maneje ON DELETE CASCADE.
        const [result] = await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        res.json({ msg: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            msg: 'No se puede eliminar el cliente porque tiene boletos asociados en el historial.' 
        });
    }
};