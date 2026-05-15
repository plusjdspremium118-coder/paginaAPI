/**
 * ConstructorsSection.jsx — Clasificación de constructores con logos y fotos de monoplazas
 * Diseño premium con visualización de los autos originales de la CDN de F1.
 */
import React from 'react';

const TEAM_COLORS = {
  'Red Bull Racing':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Mercedes':'#27F4D2','Aston Martin':'#229971','Alpine':'#FF87BC',
  'Williams':'#64C4FF','Racing Bulls':'#6692FF','RB':'#6692FF',
  'Kick Sauber':'#52E252','Haas F1 Team':'#B6BABD','Haas':'#B6BABD',
  'Audi':'#000000', 'Cadillac':'#C0C0C0'
};
const teamColor = (t) => Object.entries(TEAM_COLORS).find(([k]) => t?.includes(k))?.[1] || '#888';

const ConstructorsSection = ({ standings, loading }) => {
  const maxPts = standings.length > 0 ? parseInt(standings[0]?.points || 1) : 1;

  return (
    <section className="constructors-premium-container">
      <div className="section-header mb-4">
        <h2 className="section-title">
          <span className="section-title-accent">CAMPEONATO DE</span> CONSTRUCTORES 2026
        </h2>
        <span className="section-badge">TEMP. 2026</span>
      </div>

      {loading ? (
        <div className="loading-state-constructors">
          <div className="nexus-spinner"/>
        </div>
      ) : standings.length === 0 ? (
        <div className="empty-state">
          <p>DATOS TEMPORADA 2026 EN PROCESO</p>
        </div>
      ) : (
        <div className="constructors-list-premium">
          {standings.map((s, i) => {
            const name  = s.Constructor?.name || '';
            const tc    = teamColor(name);
            const pts   = parseInt(s.points || 0);
            const pct   = Math.max(5, Math.round((pts / maxPts) * 100));
            
            return (
              <div key={s.Constructor?.constructorId} className="constructor-card-premium constructor-card-with-car">
                <div className="ctor-rank">{s.position}</div>
                
                {/* Logo del Equipo */}
                <div className="ctor-logo-container">
                  <img 
                    src={s.logo} 
                    alt={name} 
                    className="ctor-logo-img"
                    onError={(e) => { e.target.src = 'https://media.formula1.com/content/dam/fom-website/2024/team-logos/f1.png'; }}
                  />
                </div>

                {/* Información Principal */}
                <div className="ctor-data-wrap flex-grow-1">
                  <div className="ctor-name-row">
                    <span className="ctor-name-text">{name}</span>
                    <div className="ctor-wins-badge">
                      <i className="bi bi-trophy-fill"/>
                      {s.wins}
                    </div>
                  </div>
                  
                  <div className="ctor-progress-row">
                    <div className="ctor-progress-bar-bg">
                      <div 
                        className="ctor-progress-fill" 
                        style={{width:`${pct}%`, backgroundColor: tc, boxShadow: `0 0 10px ${tc}80`}}
                      />
                    </div>
                    <div className="ctor-pts-display">
                      <span className="pts-count">{pts}</span>
                      <span className="pts-unit">PTS</span>
                    </div>
                  </div>
                </div>

                {/* Foto del Monoplaza (Car Photo) */}
                <div className="ctor-car-photo-container">
                  <img 
                    src={s.car} 
                    alt={`Monoplaza ${name}`}
                    className="ctor-car-img"
                    onError={(e) => { 
                      e.target.src = 'https://media.formula1.com/content/dam/fom-website/teams/2024/f1.png';
                    }}
                  />
                  <div className="ctor-car-glow" style={{backgroundColor: tc}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ConstructorsSection;
