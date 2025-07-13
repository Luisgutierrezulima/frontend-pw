import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../types/api';

type EditarJuegoProps = {
  id: number;
  onFinish: () => void;
};

const categorias = [
  'Acción', 'Aventura', 'Estrategia', 'RPG', 'Deportes',
  'Simulación', 'Puzzle', 'Terror', 'Mundo Abierto', 'Multijugador'
];

const plataformas = [
  'PlayStation 4', 'PlayStation 5', 'Nintendo Switch', 'Windows', 'macOS', 'Xbox'
];

const EditarJuego: React.FC<EditarJuegoProps> = ({ id, onFinish }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [imagen, setImagen] = useState('');
  const [trailer, setTrailer] = useState('');
  const [precio, setPrecio] = useState('');
  const [oferta, setOferta] = useState(false);
  const [plataforma, setPlataforma] = useState('');
  const [categoria, setCategoria] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarJuego = async () => {
      setError('');
      const res = await fetch(`${BACKEND_URL}/api/juegos/${id}`);
      if (res.ok) {
        const juego = await res.json();
        setTitulo(juego.titulo);
        setDescripcion(juego.descripcion);
        setEstrellas(juego.estrellas);
        setImagen(juego.imagen);
        setTrailer(juego.trailer);
        setPrecio(juego.precio.toString());
        setOferta(juego.oferta);
        setPlataforma(juego.plataforma);
        setCategoria(juego.categoria);
      } else {
        setError('No se encontró el juego con ese ID.');
      }
    };
    cargarJuego();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!titulo || !descripcion || !imagen || !trailer || !precio || !plataforma || !categoria) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    let nuevoPrecio = parseFloat(precio);
    let aplicarOferta = oferta;

    if (porcentaje) {
      const descuento = parseFloat(porcentaje);
      if (descuento >= 1 && descuento <= 100) {
        nuevoPrecio = nuevoPrecio - (nuevoPrecio * (descuento / 100));
        aplicarOferta = true;
      } else {
        setError('El porcentaje de descuento debe estar entre 1 y 100.');
        return;
      }
    }

    const res = await fetch(`${BACKEND_URL}/api/juegos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        descripcion,
        estrellas,
        imagen,
        trailer,
        precio: nuevoPrecio,
        oferta: aplicarOferta,
        plataforma,
        categoria,
      }),
    });

    if (res.ok) {
      onFinish();
    } else {
      const data = await res.json();
      setError(data.error || 'Error al actualizar el juego.');
    }
  };

  return (
    <div className="container mt-4">
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
            {plataformas.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Oferta</label>
          <input type="checkbox" className="form-check-input ms-2" checked={oferta} onChange={e => setOferta(e.target.checked)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">% Descuento</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={porcentaje}
            onChange={e => setPorcentaje(e.target.value)}
            min={1}
            max={100}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Categoría*</label>
          <select className="form-select form-select-sm" value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Descripción*</label>
          <textarea className="form-control form-control-sm" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary btn-sm" type="submit">Guardar Cambios</button>
          <button className="btn btn-secondary btn-sm ms-2" type="button" onClick={onFinish}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarJuego;