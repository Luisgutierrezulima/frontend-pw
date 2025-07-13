import React, { useState, useEffect, useRef } from 'react';
import '../paginas/style.css';
import Navbar from '../componentes/Navbar';
import { BACKEND_URL } from '../types/api';

const Configuracion = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`${BACKEND_URL}/api/perfil/${userId}`)
      .then(res => res.json())
      .then(data => {
        setNombre(data.nombre || '');
        setEmail(data.email || '');
        if (data.fotoPerfil) {
          setPreviewFoto(`${BACKEND_URL}/uploads/${data.fotoPerfil}`);
        }
      });
  }, [userId]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!userId) {
      setError('No hay usuario autenticado.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    if (foto) formData.append('fotoPerfil', foto);

    const res = await fetch(`${BACKEND_URL}/api/perfil/${userId}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      setMensaje('¡Datos actualizados!');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al actualizar datos.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: '900px' }}>
        <h2 className="mb-4 text-center">Configuración de Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="row align-items-center justify-content-center">
            {/* FOTO DE PERFIL */}
            <div className="col-md-4 d-flex justify-content-center mb-3">
              <div style={{ cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
                <img
                  src={previewFoto || 'https://via.placeholder.com/300'}
                  alt="Foto de perfil"
                  className="rounded-circle"
                  style={{
                    width: '220px',
                    height: '220px',
                    objectFit: 'cover',
                    border: '4px solid #ccc',
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleFotoChange}
                  style={{ display: 'none' }}
                />
                <p className="text-center text-muted mt-2">Haz clic para cambiar foto</p>
              </div>
            </div>

            {/* FORMULARIO */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Cambiar nombre</label>
                <input
                  type="text"
                  className="form-control w-75"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cambair correo electrónico</label>
                <input
                  type="email"
                  className="form-control w-75"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Correo"
                />
              </div>
              <button className="btn btn-success mt-2">Guardar Cambios</button>
            </div>
          </div>
        </form>

        {mensaje && <div className="alert alert-success mt-3 text-center">{mensaje}</div>}
        {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
      </div>
    </>
  );
};

export default Configuracion;
