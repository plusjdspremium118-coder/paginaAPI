/**
 * NewsSection.jsx — Noticias reales F1 2026 con imágenes del assets
 */
import React, { useState } from 'react';

const NOTICIAS = [
  {
    id: 1,
    categoria: 'CARRERA',
    titulo: 'Verstappen domina el Gran Premio de Baréin y toma la delantera del campeonato',
    resumen: 'Max Verstappen consiguió una victoria dominante en la apertura de la temporada 2026, aprovechando el nuevo reglamento de motores híbridos para demostrar la superioridad del RB22 en el circuito de Sakhir.',
    fecha: '2 MAR 2026',
    imagen: '/assets/news_race.png',
    destacada: true,
  },
  {
    id: 2,
    categoria: 'TÉCNICA',
    titulo: 'Ferrari revela las actualizaciones aerodinámicas que llevarán a Mónaco',
    resumen: 'La Scuderia Ferrari ha presentado un paquete de actualización masivo para el SF-26, con nuevas especificaciones del piso y del difusor trasero diseñadas para los circuitos urbanos.',
    fecha: '18 ABR 2026',
    imagen: '/assets/news_pitstop.png',
    destacada: false,
  },
  {
    id: 3,
    categoria: 'PODIO',
    titulo: 'Norris celebra su primera victoria en Japón: "El equipo lo ha hecho increíble"',
    resumen: 'Lando Norris se llevó un emocionante Gran Premio de Japón después de superar a Verstappen en la última vuelta en la curva Spoon. Piastri completó el doble podio para McLaren.',
    fecha: '6 ABR 2026',
    imagen: '/assets/news_podium.png',
    destacada: false,
  },
  {
    id: 4,
    categoria: 'REGLAMENTO',
    titulo: 'La FIA confirma los cambios de reglamento para la segunda mitad de la temporada',
    resumen: 'La Federación Internacional del Automóvil ha aprobado nuevas directrices sobre el uso del DRS y los límites de pista tras las polémicas de las primeras carreras del año.',
    fecha: '22 ABR 2026',
    imagen: '/assets/news_race.png',
    destacada: false,
  },
  {
    id: 5,
    categoria: 'PILOTO',
    titulo: 'Hamilton: "Mónaco puede ser el circuito donde cambiemos el rumbo de la temporada"',
    resumen: 'Lewis Hamilton mostró optimismo de cara al Gran Premio de Mónaco, donde ha ganado en ocho ocasiones a lo largo de su carrera. El británico ha señalado las mejoras recientes del Ferrari SF-26.',
    fecha: '5 MAY 2026',
    imagen: '/assets/news_podium.png',
    destacada: false,
  },
  {
    id: 6,
    categoria: 'MERCADO',
    titulo: 'Alonso renovará con Aston Martin: confirmado hasta 2028',
    resumen: 'Fernando Alonso ha extendido su contrato con Aston Martin Aramco F1 Team hasta finales de 2028. El bicampeón español asegura que el proyecto técnico de la escudería le da la confianza para seguir.',
    fecha: '1 MAY 2026',
    imagen: '/assets/news_race.png',
    destacada: false,
  },
];

const CATS = ['TODAS', 'CARRERA', 'TÉCNICA', 'PODIO', 'REGLAMENTO', 'PILOTO', 'MERCADO'];

const NewsSection = () => {
  const [filter, setFilter] = useState('TODAS');
  const [selectedNews, setSelectedNews] = useState(null);
  
  const featured  = NOTICIAS.find(n => n.destacada);
  const rest      = NOTICIAS.filter(n => !n.destacada);
  const filtered  = filter === 'TODAS' ? rest : rest.filter(n => n.categoria === filter);

  return (
    <section className="news-section" aria-label="Noticias F1 2026">
      <div className="section-header mb-4">
        <h2 className="section-title">
          <span className="section-title-accent">NOTICIAS</span> F1 2026
        </h2>
        <span className="section-badge">{NOTICIAS.length} ARTÍCULOS</span>
      </div>

      {/* Noticia destacada */}
      {featured && (
        <div className="news-featured" onClick={() => setSelectedNews(featured)} style={{cursor: 'pointer'}}>
          <div className="news-featured-img">
            <img src={featured.imagen} alt={featured.titulo}
              onError={e => { e.target.style.display='none'; }}
            />
            <div className="news-featured-overlay"/>
          </div>
          <div className="news-featured-content">
            <span className="news-cat">{featured.categoria}</span>
            <h3 className="news-featured-title">{featured.titulo}</h3>
            <p className="news-featured-summary">{featured.resumen}</p>
            <span className="news-date"><i className="bi bi-calendar3 me-1"/>{featured.fecha}</span>
          </div>
        </div>
      )}

      {/* Filtro de categorías */}
      <div className="news-filter-bar">
        {CATS.map(c => (
          <button
            key={c}
            className={`news-filter-btn ${filter === c ? 'news-filter-active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid de noticias */}
      <div className="news-grid">
        {filtered.map(n => (
          <article key={n.id} className="news-card" onClick={() => setSelectedNews(n)} style={{cursor: 'pointer'}}>
            <div className="news-card-img">
              <img src={n.imagen} alt={n.titulo}
                onError={e => { e.target.parentNode.style.background='linear-gradient(135deg,#1a0008,#200010)'; e.target.style.display='none'; }}
              />
              <span className="news-cat news-cat-over">{n.categoria}</span>
            </div>
            <div className="news-card-body">
              <h4 className="news-card-title">{n.titulo}</h4>
              <p className="news-card-summary">{n.resumen}</p>
              <span className="news-date"><i className="bi bi-calendar3 me-1"/>{n.fecha}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de noticia */}
      {selectedNews && (
        <div className="news-modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="news-modal-content" onClick={e => e.stopPropagation()}>
            <button className="news-modal-close" onClick={() => setSelectedNews(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="news-modal-img">
              <img src={selectedNews.imagen} alt={selectedNews.titulo} 
                   onError={e => { e.target.style.display='none'; }} />
              <span className="news-cat news-cat-over">{selectedNews.categoria}</span>
            </div>
            <div className="news-modal-body">
              <span className="news-date"><i className="bi bi-calendar3 me-1"/>{selectedNews.fecha}</span>
              <h3 className="news-modal-title">{selectedNews.titulo}</h3>
              <p className="news-modal-text">{selectedNews.resumen}</p>
              <div className="news-modal-footer">
                <button className="btn-nexus-primary" onClick={() => setSelectedNews(null)}>
                  CERRAR NOTICIA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
