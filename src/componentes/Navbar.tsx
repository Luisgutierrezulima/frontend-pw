import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BACKEND_URL } from '../types/api';

interface JuegoSugerencia {
  id: number;
  titulo: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const [showMenu, setShowMenu] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState<JuegoSugerencia[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Buscar sugerencias mientras se escribe
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (busqueda.trim() === '') {
        setSugerencias([]);
        return;
      }

      fetch(`${BACKEND_URL}/api/juegos/buscar/${encodeURIComponent(busqueda.trim())}`)
        .then(res => res.json())
        .then(data => setSugerencias(data))
        .catch(() => setSugerencias([]));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  // Al presionar Enter
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (sugerencias.length > 0) {
      navigate(`/detalle/${sugerencias[0].id}`);
    } else {
      alert('Juego no encontrado');
    }
    setBusqueda('');
    setSugerencias([]);
    setShowMenu(false);
  };

  // Al hacer clic en una sugerencia
  const manejarClicSugerencia = (id: number) => {
    navigate(`/detalle/${id}`);
    setBusqueda('');
    setSugerencias([]);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark position-relative">
      <div className="container-fluid">
        <Link to="/tienda" className="navbar-brand texto-acento">GameStore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/explore">Explorar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/offers">Ofertas especiales</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/mejor-valorados">Mejor Valorados</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/masvendi">Más vendidos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/configuracion">Configuración</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/adminpag">Admin</Link></li>
          </ul>

          {/* Buscador */}
          <form className="d-flex me-3 position-relative" onSubmit={handleBuscar}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar juego"
              style={{ maxWidth: '160px' }}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {sugerencias.length > 0 && (
              <ul className="list-group position-absolute bg-white w-100 shadow mt-1" style={{ zIndex: 999, top: '100%' }}>
                {sugerencias.map(juego => (
                  <li
                    key={juego.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => manejarClicSugerencia(juego.id)}
                  >
                    {juego.titulo}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Usuario */}
          {userName && (
            <div className="dropdown me-3">
              <span
                className="navbar-text texto-acento dropdown-toggle"
                style={{ cursor: 'pointer' }}
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded={showMenu ? "true" : "false"}
                onClick={() => setShowMenu(!showMenu)}
              >
                <i className="bi bi-person-circle me-1"></i>
                {userName}
              </span>
              <ul
                className={`dropdown-menu dropdown-menu-end${showMenu ? " show" : ""} bg-dark text-light`}
                aria-labelledby="userDropdown"
                style={{ minWidth: 150, backgroundColor: "#2d2d30" }}
              >
                <li>
                  <button className="dropdown-item text-light" style={{ backgroundColor: "#2d2d30" }} onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Carrito */}
          <button className="btn btn-outline-light me-3" onClick={() => navigate('/cart')}>
            <i className="bi bi-cart"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}