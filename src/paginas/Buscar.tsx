import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../types/api';

const Buscar = () => {
  const [resultados, setResultados] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const buscarJuegos = async () => {
      if (!query) return;
      const res = await fetch(`${BACKEND_URL}/api/juegos`);
      const todos = await res.json();
      const filtrados = todos.filter((j: any) =>
        j.titulo.toLowerCase().includes(query.toLowerCase())
      );
      setResultados(filtrados);
    };
    buscarJuegos();
  }, [query]);

  return (
    <div className="container mt-4">
      <h4>Resultados de búsqueda para: "{query}"</h4>
      {resultados.length === 0 ? (
        <p>No se encontraron juegos.</p>
      ) : (
        <div className="row">
          {resultados.map((juego: any) => (
            <div className="col-md-4 mb-3" key={juego.id}>
              <div className="card">
                <img src={juego.imagen} className="card-img-top" alt={juego.titulo} />
                <div className="card-body">
                  <h5 className="card-title">{juego.titulo}</h5>
                  <p className="card-text">${juego.precio}</p>
                  {/* Puedes poner un botón para ver más detalles o comprar */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buscar;