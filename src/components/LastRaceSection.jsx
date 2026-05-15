/**
 * LastRaceSection.jsx — Resultados de la última carrera con podio visual
 */
import React, { useState } from 'react';

const TEAM_COLORS = {
  'Red Bull Racing':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Mercedes':'#27F4D2','Aston Martin':'#229971','Alpine':'#FF87BC',
  'Williams':'#64C4FF','Racing Bulls':'#6692FF','RB':'#6692FF',
  'Kick Sauber':'#52E252','Haas F1 Team':'#B6BABD','Haas':'#B6BABD',
};
const teamColor = (t) => Object.entries(TEAM_COLORS).find(([k]) => t?.includes(k))?.[1] || '#888';

const MEDAL = { 1:'🥇', 2:'🥈', 3:'🥉' };

const LastRaceSection = ({ lastRace, loading }) => {
  const [showAll, setShowAll] = useState(false);

  if (loading) return (
    <div style={{textAlign:'center',padding:'3rem',color:'var(--gray)'}}>
      <div className="nexus-spinner mx-auto mb-3" style={{width:36,height:36}}/>
    </div>
  );
  if (!lastRace) return null;

  const podium  = lastRace.results?.slice(0, 3) || [];
  const rest    = lastRace.results?.slice(3, showAll ? 20 : 10) || [];

  return (
    <section className="last-race-section">
      {/* Header */}
      <div className="section-header">
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'.7rem',letterSpacing:'.25em',color:'var(--red)',textTransform:'uppercase',marginBottom:'.25rem'}}>
            ÚLTIMA CARRERA · RONDA {lastRace.round}
          </div>
          <h2 className="section-title">
            <span className="section-title-accent">{lastRace.titleEs}</span>
          </h2>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'.78rem',color:'var(--gray)',letterSpacing:'.08em',marginTop:'.2rem'}}>
            {lastRace.circuito} · {lastRace.pais} · {lastRace.fecha}
          </div>
        </div>
        <span className="section-badge">{lastRace.season}</span>
      </div>

      {/* Podio top 3 */}
      <div className="podium-grid">
        {[podium[1], podium[0], podium[2]].filter(Boolean).map((r, vi) => {
          const posReal = vi === 0 ? 2 : vi === 1 ? 1 : 3;
          const result  = lastRace.results?.find(x => parseInt(x.pos) === posReal);
          if (!result) return null;
          const tc = teamColor(result.team);
          return (
            <div key={result.pos}
              className={`podium-card podium-p${result.pos}`}
              style={{'--tc': tc}}
            >
              <div className="podium-medal">{MEDAL[parseInt(result.pos)]}</div>
              <div className="podium-pos">P{result.pos}</div>
              <div className="podium-driver">
                <span className="podium-given">{result.givenName}</span>
                <span className="podium-family">{result.familyName}</span>
              </div>
              <div className="podium-team" style={{color: tc}}>{result.team}</div>
              <div className="podium-time">{result.time || result.status}</div>
              {result.points > 0 && (
                <div className="podium-pts">+{result.points} PTS</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabla resto de resultados */}
      <div className="results-table">
        <div className="results-header">
          <span>POS</span><span>PILOTO</span><span>EQUIPO</span>
          <span>VUELTAS</span><span>TIEMPO</span><span>PTS</span>
        </div>
        {rest.map(r => {
          const tc = teamColor(r.team);
          const dnf = !['Finished','+ 1 Lap','+ 2 Laps'].some(s => r.status?.includes(s)) && parseInt(r.pos) > 3;
          return (
            <div key={r.pos} className={`results-row ${dnf?'results-dnf':''}`}>
              <span className="res-pos">{r.pos}</span>
              <span className="res-driver">
                <span style={{width:3,height:'100%',background:tc,borderRadius:2,display:'inline-block',marginRight:8,verticalAlign:'middle'}}/>
                <span className="res-given">{r.givenName}</span>{' '}
                <strong>{r.familyName}</strong>
                {r.fastestLapRank === '1' && (
                  <span title="Vuelta rápida" style={{color:'#b428f5',marginLeft:6,fontSize:'.7rem'}}>⚡</span>
                )}
              </span>
              <span className="res-team" style={{color:tc}}>{r.team}</span>
              <span className="res-laps">{r.laps}</span>
              <span className="res-time">{dnf ? <span style={{color:'#f55'}}>DNF</span> : r.time || r.status}</span>
              <span className="res-pts">{r.points > 0 ? r.points : '—'}</span>
            </div>
          );
        })}
      </div>

      <div style={{textAlign:'center',marginTop:'1rem'}}>
        <button className="btn-nexus-secondary" onClick={() => setShowAll(v => !v)}>
          {showAll ? <><i className="bi bi-chevron-up me-1"/>Mostrar menos</> : <><i className="bi bi-chevron-down me-1"/>Ver top 20</>}
        </button>
      </div>
    </section>
  );
};

export default LastRaceSection;
