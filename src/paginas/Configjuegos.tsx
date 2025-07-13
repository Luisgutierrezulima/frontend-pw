import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../componentes/Navbar';
import Agregarjuego from '../componentes/Agregarjuego';
import EditarJuego from '../componentes/Editarjuego';
import EliminarJuego from '../componentes/Eliminarjuego';
import { BACKEND_URL } from '../types/api';

import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

type Juego = {
  id: number;
  titulo: string;
  precio: number;
  oferta: boolean;
  imagen: string;
};

const Configjuegos = () => {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [loading, setLoading] = useState(true);
  const [accion, setAccion] = useState<{ tipo: string; id?: number }>({ tipo: '' });
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarJuegos = async () => {
    setLoading(true);
    const res = await fetch(`${BACKEND_URL}/api/juegos`);
    const data = await res.json();
    setJuegos(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarJuegos();
  }, []);

  const handleAbrirModal = (tipo: string, id?: number) => {
    setAccion({ tipo, id });
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setAccion({ tipo: '' });
    setMostrarModal(false);
  };

  const renderFormulario = () => {
    if (accion.tipo === 'agregar')
      return <Agregarjuego onFinish={() => { handleCerrarModal(); cargarJuegos(); }} />;
    if (accion.tipo === 'editar' && accion.id)
      return <EditarJuego id={accion.id} onFinish={() => { handleCerrarModal(); cargarJuegos(); }} />;
    if (accion.tipo === 'eliminar' && accion.id)
      return <EliminarJuego id={accion.id} onFinish={() => { handleCerrarModal(); cargarJuegos(); }} />;
    return null;
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Administración de Juegos</h2>
        <button className="btn btn-success mb-3" onClick={() => handleAbrirModal('agregar')}>
          <FaPlus /> Agregar
        </button>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Oferta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegos.map(juego => (
                <tr key={juego.id}>
                  <td>
                    <img src={juego.imagen} alt={juego.titulo} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                  </td>
                  <td>{juego.titulo}</td>
                  <td>${juego.precio}</td>
                  <td>{juego.oferta ? 'Sí' : 'No'}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleAbrirModal('editar', juego.id)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAbrirModal('eliminar', juego.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal show={mostrarModal} onHide={handleCerrarModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {accion.tipo === 'agregar' && 'Agregar juego'}
            {accion.tipo === 'editar' && 'Editar juego'}
            {accion.tipo === 'eliminar' && 'Eliminar juego'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderFormulario()}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Configjuegos;
