import React from 'react';

const TEAM_COLORS = {
  'Red Bull Racing':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Mercedes':'#27F4D2','Aston Martin':'#229971','Alpine':'#FF87BC',
  'Williams':'#64C4FF','Racing Bulls':'#6692FF','RB':'#6692FF',
  'Kick Sauber':'#52E252','Haas F1 Team':'#B6BABD','Haas':'#B6BABD',
};
const teamColor = (t) => Object.entries(TEAM_COLORS).find(([k]) => t?.includes(k))?.[1] || '#888';

const MEDAL = { '1':'🥇','2':'🥈','3':'🥉' };

const StandingsSection = ({ standings, loading }) => (
  <section className="standings-section">
    <div className="section-header">
      <h2 className="section-title">
        <span className="section-title-accent">PILOTOS</span> · CAMPEONATO
      </h2>
      <span className="section-badge">2026</span>
    </div>
    {loading ? (
      <div style={{textAlign:'center',padding:'2rem'}}>
        <div className="nexus-spinner mx-auto" style={{width:36,height:36}}/>
      </div>
    ) : standings.length === 0 ? (
      <p style={{color:'var(--gray)',fontFamily:"'Rajdhani',sans-serif",letterSpacing:'.1em',textAlign:'center',padding:'2rem',textTransform:'uppercase'}}>
        Datos no disponibles aún
      </p>
    ) : (
      <div className="standings-table">
        {standings.map((s, i) => {
          const tc   = teamColor(s.Constructors?.[0]?.name);
          const team = s.Constructors?.[0]?.name || '';
          const isTop = i < 3;
          return (
            <div key={s.Driver?.driverId}
              className={`standings-row ${isTop ? 'standings-row-top' : ''}`}
              style={{'--team-color': tc}}
            >
              <div className="standings-pos">
                {MEDAL[s.position]
                  ? <span style={{fontSize:'1rem'}}>{MEDAL[s.position]}</span>
                  : <span className="pos-num">{s.position}</span>
                }
              </div>
              <div className="standings-team-bar" style={{background: tc}}/>
              <img src={s.teamLogo} alt={team} style={{width: 44, height: 44, objectFit: 'contain', padding: '4px'}} />
              <div className="standings-driver flex-grow-1">
                <span className="driver-name">
                  {s.Driver?.givenName}{' '}
                  <strong>{s.Driver?.familyName?.toUpperCase()}</strong>
                </span>
                <span className="driver-team" style={{color: tc}}>{team}</span>
              </div>
              <div className="standings-pts">
                <span className="pts-value">{s.points}</span>
                <span className="pts-label">PTS</span>
              </div>
              {s.wins > 0 && (
                <span style={{fontSize:'.7rem',color:'#f5c800',fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>
                  🏆{s.wins}
                </span>
              )}
            </div>
          );
        })}
      </div>
    )}
  </section>
);

export default StandingsSection;
