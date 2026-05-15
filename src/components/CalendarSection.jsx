/**
 * CalendarSection.jsx — Calendario F1 2026 estilizado
 * Incluye mapas de circuitos y etiquetas de estado de carrera premium.
 */
import React from 'react';

const CalendarSection = ({ calendar, loading }) => {
  const now = new Date();

  return (
    <section className="calendar-premium-section">
      {/* Banner de la sección de Carreras */}
      <div className="carreras-hero-banner mb-5">
        <div className="carreras-hero-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/carrera_bg.png)` }} />
        <div className="carreras-hero-overlay" />
        <div className="carreras-hero-content">
          <h2 className="carreras-hero-title">
            <span className="carreras-hero-accent">CALENDARIO</span> MUNDIAL 2026
          </h2>
          <p className="carreras-hero-subtitle">Descubre todas las {calendar.length} paradas del campeonato más grande de la historia de la Fórmula 1.</p>
        </div>
      </div>

      <div className="section-header mb-4">
        <h3 className="section-title">
          PRÓXIMOS <span className="section-title-accent">EVENTOS</span>
        </h3>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="nexus-spinner"/>
        </div>
      ) : (
        <div className="calendar-grid-premium">
          {calendar.map((r, i) => {
            const raceDate = new Date(r.date);
            const isPast   = raceDate < now;
            const isNext   = !isPast && (i === 0 || new Date(calendar[i-1].date) < now);

            return (
              <div key={r.round} className={`calendar-card-premium ${isNext ? 'card-next-race' : ''}`}>
                <div className="cal-header-row">
                  <div className="cal-round-pill">RONDA {r.round}</div>
                  {isNext && <div className="cal-live-badge">PRÓXIMA</div>}
                  {isPast && <div className="cal-past-badge">FINALIZADA</div>}
                </div>

                <div className="cal-photo-container">
                  <img 
                    src={r.trackPhoto} 
                    alt={`Foto de ${r.pais}`} 
                    className="cal-photo-img"
                    onError={(e) => { e.target.src = 'https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Great%20Britain.jpg'; }}
                  />
                </div>

                <div className="cal-body-content">
                  <div className="cal-track-map-container">
                    <img 
                      src={r.trackMap} 
                      alt={`Mapa del circuito de ${r.pais}`} 
                      className="cal-track-img"
                      onError={(e) => { e.target.src = 'https://media.formula1.com/content/dam/fom-website/2018/manual/Circuit%20Maps/16x9/f1_Circuit.png'; }}
                    />
                  </div>

                  <div className="cal-race-info">
                    <div className="cal-date-box">
                      <span className="cal-day">{r.fechaEs.split(' ')[0]}</span>
                      <span className="cal-month">{r.fechaEs.split(' ')[1]}</span>
                    </div>
                    <div className="cal-text-details">
                      <h4 className="cal-title-es">{r.titleEs}</h4>
                      <p className="cal-location-text">
                        <i className="bi bi-geo-alt-fill me-1"/>
                        {r.ciudad}, {r.pais}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="cal-footer-stripe"/>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CalendarSection;
