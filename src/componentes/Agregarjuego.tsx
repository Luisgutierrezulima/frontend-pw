import React, { useState } from 'react';
import { BACKEND_URL } from '../types/api';

type AgregarJuegoProps = {
  onFinish: () => void;
};

const categorias = [
  'Acción', 'Aventura', 'Estrategia', 'RPG', 'Deportes',
  'Simulación', 'Puzzle', 'Terror', 'Mundo Abierto', 'Multijugador'
];

const plataformas = [
  'PlayStation 4', 'PlayStation 5', 'Nintendo Switch', 'Windows', 'macOS', 'Xbox'
];

const Agregarjuego: React.FC<AgregarJuegoProps> = ({ onFinish }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [imagen, setImagen] = useState('');
  const [trailer, setTrailer] = useState('');
  const [precio, setPrecio] = useState('');
  const [oferta, setOferta] = useState(false);
  const [plataforma, setPlataforma] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    if (!titulo || !descripcion || !imagen || !trailer || !precio || !plataforma || !categoria) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    const res = await fetch(`${BACKEND_URL}/api/juegos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        descripcion,
        estrellas,
        imagen,
        trailer,
        precio: parseFloat(precio),
        oferta,
        plataforma,
        categoria,
      }),
    });
    if (res.ok) {
      setMensaje('¡Juego agregado exitosamente!');
      setTimeout(() => onFinish(), 1000);
    } else {
      const data = await res.json();
      setError(data.error || 'Error al agregar el juego.');
    }
  };

  return (
    <div className="container mt-5">
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Título*</label>
          <input type="text" className="form-control form-control-sm" value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Estrellas</label>
          <input type="number" className="form-control form-control-sm" value={estrellas} onChange={e => setEstrellas(Number(e.target.value))} min={0} max={5} />
        </div>
        <div className="col-md-6">
          <label className="form-label">URL Imagen*</label>
          <input type="text" className="form-control form-control-sm" value={imagen} onChange={e => setImagen(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Trailer*</label>
          <input type="text" className="form-control form-control-sm" value={trailer} onChange={e => setTrailer(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Precio ($)*</label>
          <input type="number" className="form-control form-control-sm" value={precio} onChange={e => setPrecio(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Plataforma*</label>
          <select className="form-select form-select-sm" value={plataforma} onChange={e => setPlataforma(e.target.value)}>
            <option value="">Selecciona una plataforma</option>
            {plataformas.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Oferta</label>
          <input type="checkbox" className="form-check-input ms-2" checked={oferta} onChange={e => setOferta(e.target.checked)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Categoría*</label>
          <select className="form-select form-select-sm" value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Descripción*</label>
          <textarea className="form-control form-control-sm" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-success btn-sm" type="submit">Agregar Juego</button>
          <button className="btn btn-secondary btn-sm ms-2" type="button" onClick={onFinish}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default Agregarjuego;