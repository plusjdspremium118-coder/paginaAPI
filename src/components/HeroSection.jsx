/**
 * HeroSection.jsx — Banner hero con imagen real y cuenta regresiva
 */
import React, { useState, useEffect } from 'react';

const HeroSection = ({ nextRace }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!nextRace?.date) return;
    const target = new Date(`${nextRace.date}T${nextRace.time || '12:00:00'}`);
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) return setTimeLeft({ days:0, hours:0, mins:0, secs:0 });
      setTimeLeft({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextRace]);

  const pad = (n) => String(n ?? 0).padStart(2, '0');

  return (
    <section className="hero-section" aria-label="Próxima carrera F1">
      {/* Capa de imagen de fondo real */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:`url(${process.env.PUBLIC_URL}/assets/f1_hero.png)`,
        backgroundSize:'cover', backgroundPosition:'center',
        filter:'brightness(.35) saturate(1.2)',
      }} aria-hidden="true"/>

      {/* Capa de overlay con degradado */}
      <div style={{
        position:'absolute', inset:0, zIndex:1,
        background:'linear-gradient(135deg,rgba(21,21,30,.9) 0%,rgba(225,6,0,.22) 50%,rgba(21,21,30,.92) 100%)',
      }} aria-hidden="true"/>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-4 py-5">

          {/* Info de la próxima carrera */}
          <div className="col-12 col-lg-7">
            <div className="hero-season-label">TEMPORADA 2026 · FÓRMULA 1</div>
            <h1 className="hero-title">
              {nextRace ? nextRace.titleEs : 'Calendario F1 2026'}
            </h1>
            {nextRace && (
              <div className="hero-meta">
                <span className="hero-meta-item">
                  <i className="bi bi-geo-alt-fill me-1"/>
                  {nextRace.ciudad}, {nextRace.pais}
                </span>
                <span className="hero-meta-item">
                  <i className="bi bi-calendar3 me-1"/>
                  {nextRace.fechaEs}
                </span>
                <span className="hero-meta-item">
                  <i className="bi bi-flag-fill me-1"/>
                  Ronda {nextRace.round}
                </span>
              </div>
            )}
          </div>

          {/* Cuenta regresiva */}
          {nextRace && Object.keys(timeLeft).length > 0 && (
            <div className="col-12 col-lg-5">
              <div className="countdown-box">
                <div className="countdown-label">PRÓXIMA CARRERA EN</div>
                <div className="countdown-grid">
                  {[
                    { v: timeLeft.days,  l: 'DÍAS' },
                    { v: timeLeft.hours, l: 'HRS' },
                    { v: timeLeft.mins,  l: 'MIN' },
                    { v: timeLeft.secs,  l: 'SEG' },
                  ].map(({ v, l }) => (
                    <div key={l} className="countdown-unit">
                      <span className="countdown-num">{pad(v)}</span>
                      <span className="countdown-sub">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
