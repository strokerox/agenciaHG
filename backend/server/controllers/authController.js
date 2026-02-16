const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO DE USUARIO
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // 1. Verificar si existe
    const [userExist] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (userExist.length > 0) return res.status(400).json({ msg: 'El usuario ya existe' });

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 3. Insertar (Asumiendo que ejecutaste el script extra del paso anterior)
    await db.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)', 
      [nombre, email, hashPassword, rol || 'agente']);

    res.status(201).json({ msg: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const usuario = users[0];

    // 2. Comparar contraseñas
    const validPass = await bcrypt.compare(password, usuario.password);
    if (!validPass) return res.status(400).json({ msg: 'Credenciales inválidas' });

    // 3. Generar Token
    const token = jwt.sign({ id: usuario.id_usuario, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};