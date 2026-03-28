import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // mantén tu CSS si quieres

function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar productos al iniciar
  useEffect(() => {
    if (!API_URL) {
      console.error("❌ VITE_API_URL no está configurada en Railway");
      return;
    }
    axios.get(`${API_URL}/api/productos`)
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error cargando productos:", err));
  }, [API_URL]);

  const agregarProducto = async () => {
    if (!API_URL) return;
    try {
      const res = await axios.post(`${API_URL}/api/productos`, form);
      setProductos([...productos, res.data]);
      setForm({ nombre: '', descripcion: '', cantidad: 0, precio: 0 });
    } catch (err) {
      console.error("Error agregando producto:", err);
    }
  };

  const actualizarCantidad = async (id, nuevaCantidad) => {
    if (!API_URL) return;
    try {
      await axios.put(`${API_URL}/api/productos/${id}`, { cantidad: nuevaCantidad });
      setProductos(productos.map(p => 
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      ));
    } catch (err) {
      console.error("Error actualizando:", err);
    }
  };

  const eliminarProducto = async (id) => {
    if (!API_URL) return;
    try {
      await axios.delete(`${API_URL}/api/productos/${id}`);
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>📦 Sistema de Inventario</h1>

      {/* Formulario */}
      <div style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Agregar nuevo producto</h2>
        <input
          placeholder="Nombre del producto"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={e => setForm({ ...form, cantidad: parseInt(e.target.value) || 0 })}
          style={{ marginRight: '10px', padding: '8px', width: '100px' }}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.precio}
          onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })}
          style={{ marginRight: '10px', padding: '8px', width: '120px' }}
        />
        <button onClick={agregarProducto} style={{ padding: '10px 20px' }}>
          Agregar Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>
                <input
                  type="number"
                  value={p.cantidad}
                  onChange={e => actualizarCantidad(p.id, parseInt(e.target.value) || 0)}
                  style={{ width: '80px' }}
                />
              </td>
              <td>${parseFloat(p.precio).toFixed(2)}</td>
              <td>
                <button onClick={() => eliminarProducto(p.id)} style={{ color: 'red' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!API_URL && (
        <p style={{ color: 'red', marginTop: '20px' }}>
          ⚠️ No se encontró VITE_API_URL. Revisa las variables en Railway.
        </p>
      )}
    </div>
  );
}

export default App;