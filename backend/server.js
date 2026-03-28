const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

db.connect(err => {
  if (err) console.error('Error DB:', err);
  else console.log('✅ Conectado a MySQL en Railway');
});

// Tabla de productos (se crea automáticamente la primera vez)
const createTable = `
  CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad INT DEFAULT 0,
    precio DECIMAL(10,2) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
db.query(createTable);

// Rutas CRUD
app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, cantidad, precio } = req.body;
  db.query(
    'INSERT INTO productos (nombre, descripcion, cantidad, precio) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, cantidad, precio],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/api/productos/:id', (req, res) => {
  const { cantidad } = req.body; // puedes expandir más campos
  db.query('UPDATE productos SET cantidad = ? WHERE id = ?', [cantidad, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Actualizado' });
    });
});

app.delete('/api/productos/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Eliminado' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));