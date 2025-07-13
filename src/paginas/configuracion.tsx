import React, { useState, useEffect } from 'react';
import '../paginas/style.css';
import Navbar from '../componentes/Navbar';
import { BACKEND_URL } from '../types/api';

const Configuracion = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    fetch(`${BACKEND_URL}/api/perfil/${userId}`)
      .then(res => res.json())
      .then(data => {
        setNombre(data.nombre || '');
        setEmail(data.email || '');
      });
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    if (!userId) {
      setError('No hay usuario autenticado.');
      return;
    }
    const res = await fetch(`${BACKEND_URL}/api/perfil/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        password: password || undefined,
      }),
    });
    if (res.ok) {
      setMensaje('¡Datos actualizados!');
      setPassword('');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al actualizar datos.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        
        <h1 className="text-center mb-5">Configuración de Cuenta</h1>

        <div className="row align-items-center justify-content-center">
          {/* Imagen */}
          <div className="col-md-4 d-flex justify-content-center">
            <img
              src="data:image/png;base64,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"
              alt="Imagen de perfil"
              style={{
                width: '250px',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>

          {/* Formulario */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3" style={{ maxWidth: '400px' }}>
                <label className="form-label">Cambiar nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="mb-3" style={{ maxWidth: '400px' }}>
                <label className="form-label">Cambiar correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Correo"
                />
              </div>
              <div className="mb-3" style={{ maxWidth: '400px' }}>
                <label className="form-label">Cambiar contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="*****"
                />
              </div>
              <button className="btn btn-success">Guardar Cambios</button>
            </form>
            {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracion;