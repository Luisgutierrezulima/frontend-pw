
import Navbar from '../componentes/Navbar';
import CardJuego from '../componentes/CardJuego';
import { useNavigate } from 'react-router-dom';
import { useJuegos } from '../context/GameContext';
import '../paginas/style.css';

export default function PaginaPrincipal() {
  const navigate = useNavigate();
  const { juegos } = useJuegos();

  return (
    <div className="fondo-oscuro">
      <Navbar />

      {/* Carrusel */}
      <div id="mainCarousel" className="carousel slide mt-4 container" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000964/a28a81253e919298beab2295e39a56b7a5140ef15abdb56135655e5c221b2a3a" className="d-block w-100" alt="Minecraft" />
            <div className="carousel-caption">
              <button className="btn btn-acento">Detalles</button>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://cdn1.epicgames.com/spt-assets/f39371235a0f429d9d33b76a9bfa8916/rimworld-1hhrb.png" className="d-block w-100" alt="Rimworld" />
            <div className="carousel-caption">
              <button className="btn btn-acento">Detalles</button>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Juegos Destacados */}
      <div className="container mt-5">
        <h3 className="texto-acento mb-3">Featured Games</h3>
        <div className="row row-cols-1 row-cols-md-5 g-4 mt-3">
          {juegos.slice(0, 5).map((juego) => (
            <div className="col" key={juego.id}>
              <CardJuego 
                nombre={juego.titulo} 
                imagen={juego.imagen}
                precio={juego.precio}
                onDetalles={() => navigate(`/detalle/${juego.id}`)} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}