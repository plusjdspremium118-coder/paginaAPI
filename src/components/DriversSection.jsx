/**
 * DriversSection.jsx — Grid de pilotos con imágenes reales de la CDN de F1
 * Diseño premium con efectos de hover, bordes de equipo y tipografía Rajdhani.
 */
import React, { useState } from 'react';

const TEAM_COLORS = {
  'Red Bull Racing':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Mercedes':'#27F4D2','Aston Martin':'#229971','Alpine':'#FF87BC',
  'Williams':'#64C4FF','Racing Bulls':'#6692FF','RB':'#6692FF',
  'Kick Sauber':'#52E252','Haas F1 Team':'#B6BABD','Haas':'#B6BABD',
  'Audi':'#000000', 'Cadillac':'#C0C0C0'
};
const teamColor = (t) => Object.entries(TEAM_COLORS).find(([k]) => t?.includes(k))?.[1] || '#888';

const FLAG_MAP = {
  'Dutch':'🇳🇱','British':'🇬🇧','Monegasque':'🇲🇨','Australian':'🇦🇺',
  'Spanish':'🇪🇸','Mexican':'🇲🇽','Finnish':'🇫🇮','Canadian':'🇨🇦',
  'French':'🇫🇷','German':'🇩🇪','Japanese':'🇯🇵','Thai':'🇹🇭',
  'Chinese':'🇨🇳','Danish':'🇩🇰','New Zealander':'🇳🇿','American':'🇺🇸',
  'Italian':'🇮🇹','Brazilian':'🇧🇷','Argentine':'🇦🇷','Austrian':'🇦🇹',
};

const DriversSection = ({ standings, loading }) => {
  const [search, setSearch] = useState('');
  const maxPts = parseInt(standings[0]?.points || 1);

  const filtered = standings.filter(s => {
    const q = search.toLowerCase();
    return (
      s.Driver?.givenName?.toLowerCase().includes(q) ||
      s.Driver?.familyName?.toLowerCase().includes(q) ||
      s.Constructors?.[0]?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="drivers-section-container">
      <div className="section-header mb-4">
        <h2 className="section-title">
          <span className="section-title-accent">LINE-UP OFICIAL</span> 2026
        </h2>
        <div className="search-container">
          <i className="bi bi-search"/>
          <input
            type="search" className="search-input-premium"
            placeholder="Buscar piloto..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="nexus-spinner"/>
          <p>Sincronizando con el Paddock...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron pilotos con ese criterio.</p>
        </div>
      ) : (
        <div className="drivers-premium-grid">
          {filtered.map((s) => {
            const d   = s.Driver || {};
            const tc  = teamColor(s.Constructors?.[0]?.name);
            const pts = parseInt(s.points || 0);
            const flag = FLAG_MAP[d.nationality] || '🏁';
            const driverNum = d.permanentNumber || '??';
            
            return (
              <div
                key={d.driverId}
                className="driver-card-premium"
                style={{'--team-color': tc}}
              >
                {/* Fondo con número de piloto */}
                <div className="driver-num-bg">{driverNum}</div>
                
                {/* Imagen del Piloto */}
                <div className="driver-image-wrap">
                  <img 
                    src={s.img} 
                    alt={`${d.givenName} ${d.familyName}`}
                    className="driver-img-real"
                    onError={(e) => { e.target.src = 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/fallback.png'; }}
                  />
                  <div className="driver-img-shadow"/>
                </div>

                {/* Info del Piloto */}
                <div className="driver-details">
                  <div className="driver-rank">#{s.position}</div>
                  <div className="driver-name-group">
                    <span className="driver-first-name">{d.givenName}</span>
                    <span className="driver-last-name">{d.familyName?.toUpperCase()}</span>
                  </div>
                  
                  <div className="driver-team-group">
                    <div className="team-color-dot" style={{backgroundColor: tc}}/>
                    <span className="driver-team-name">{s.Constructors?.[0]?.name}</span>
                  </div>

                  <div className="driver-footer">
                    <div className="driver-stat-box">
                      <span className="stat-label">PUNTOS</span>
                      <span className="stat-value">{pts}</span>
                    </div>
                    <div className="driver-stat-box">
                      <span className="stat-label">VICTORIAS</span>
                      <span className="stat-value">{s.wins}</span>
                    </div>
                    <div className="driver-nationality">{flag}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DriversSection;
