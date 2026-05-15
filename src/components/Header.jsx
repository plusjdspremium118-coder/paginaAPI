import React from 'react';

const TABS = [
  { id:'inicio',        label:'Inicio',        icon:'bi-house-fill' },
  { id:'noticias-f1',   label:'Noticias',       icon:'bi-newspaper' },
  { id:'carreras',      label:'Carreras',       icon:'bi-flag-fill' },
  { id:'pilotos',       label:'Pilotos',        icon:'bi-person-fill' },
  { id:'constructores', label:'Constructores',  icon:'bi-tools' },
  { id:'noticias',      label:'Mis Posts',      icon:'bi-pencil-square' },
];

/* Logo oficial F1 (SVG provisto por la especificación) */
const LogoF1 = () => (
  <svg className="logo-f1-svg" viewBox="0 0 120 32" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-label="F1" role="img"
    style={{ height: 22, width: 'auto' }}
  >
    <path d="M0 0H42V8H10V12H38V20H10V32H0V0Z" fill="white"/>
    <path d="M48 0H58V32H48V0Z" fill="white"/>
    <path d="M63 0H108C113 0 118 5 118 10V22C118 27 113 32 108 32H73V24H106C108 24 110 22 110 20V12C110 10 108 8 106 8H73V0H63Z" fill="#e10600"/>
    <path d="M63 32V20L76 20V32H63Z" fill="white"/>
  </svg>
);

const Header = ({ totalPosts, onReset, activeTab, onTabChange }) => (
  <header className="nexus-header" role="banner">
    <div className="nexus-stripe"/>
    <div className="container-fluid px-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">

        {/* Marca con logo oficial */}
        <div className="d-flex align-items-center gap-3">
          <LogoF1 />
          <div className="header-divider" aria-hidden="true"/>
          <div>
            <div className="brand-subtitle">SCUDERIA NEXUS</div>
            <div className="tagline">Portal Oficial · Temporada 2026</div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="header-tabs" aria-label="Navegación principal">
          {TABS.map(tab => (
            <button key={tab.id} id={`tab-${tab.id}`}
              className={`header-tab ${activeTab === tab.id ? 'header-tab-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <i className={`bi ${tab.icon} me-1`} aria-hidden="true"/>
              {tab.label}
              {tab.id === 'noticias' && totalPosts > 0 &&
                <span className="tab-count">{totalPosts}</span>}
            </button>
          ))}
        </nav>

        {/* Acciones */}
        <div className="d-flex align-items-center gap-2">
          <span className="header-badge">2026</span>
          <button id="btn-reset-data" className="btn-nexus-secondary"
            onClick={onReset} style={{fontSize:'.75rem',padding:'.3rem .7rem'}}
            aria-label="Reiniciar datos"
          >
            <i className="bi bi-arrow-counterclockwise me-1"/>Reset
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
