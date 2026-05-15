import React, { useState, useCallback } from 'react';
import Header              from './components/Header';
import HeroSection         from './components/HeroSection';
import StandingsSection    from './components/StandingsSection';
import ConstructorsSection from './components/ConstructorsSection';
import CalendarSection     from './components/CalendarSection';
import DriversSection      from './components/DriversSection';
import LastRaceSection     from './components/LastRaceSection';
import NewsSection         from './components/NewsSection';
import PostList            from './components/PostList';
import PostForm            from './components/PostForm';
import ErrorMessage        from './components/ErrorMessage';
import ToastNotification   from './components/ToastNotification';
import usePosts   from './hooks/usePosts';
import useF1Data  from './hooks/useF1Data';
import './index.css';

const Spinner = () => (
  <div className="nexus-loader" role="status">
    <div className="nexus-spinner"/>
    <span className="loader-text">Cargando datos F1 2026…</span>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  const {
    driverStandings, constructorStandings,
    calendar, lastRace, nextRace, loading: ldgF1,
  } = useF1Data();

  const {
    posts, totalPosts, loading: ldgPosts, error,
    toast, searchTerm, setSearch,
    createPost, updatePost, deletePost, resetData,
  } = usePosts();

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const openCreate  = useCallback(() => { setEditingPost(null); setModalOpen(true); }, []);
  const openEdit    = useCallback(p  => { setEditingPost(p);   setModalOpen(true); }, []);
  const closeModal  = useCallback(() => { setModalOpen(false); setEditingPost(null); }, []);
  const handleSubmit = useCallback(data => {
    const ok = editingPost ? (updatePost(editingPost.id, data), true) : createPost(data);
    if (ok !== false) closeModal();
  }, [editingPost, createPost, updatePost, closeModal]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header totalPosts={totalPosts} onReset={resetData}
        activeTab={activeTab} onTabChange={setActiveTab}/>

      <main className="nexus-main flex-grow-1" id="main-content">

        {/* ── INICIO ────────────────────────────────────────────────── */}
        {activeTab === 'inicio' && (
          <>
            <HeroSection nextRace={nextRace}/>
            <div className="container">
              {ldgF1 ? <Spinner/> : (
                <>
                  <div className="mb-5">
                    <LastRaceSection lastRace={lastRace} loading={false}/>
                  </div>
                  <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-6">
                      <StandingsSection standings={driverStandings} loading={false}/>
                    </div>
                    <div className="col-12 col-lg-6">
                      <ConstructorsSection standings={constructorStandings} loading={false}/>
                    </div>
                  </div>
                  {/* Noticias destacadas en inicio */}
                  <div className="mb-5">
                    <NewsSection/>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── NOTICIAS F1 ───────────────────────────────────────────── */}
        {activeTab === 'noticias-f1' && (
          <div className="container">
            <NewsSection/>
          </div>
        )}

        {/* ── CARRERAS ─────────────────────────────────────────────── */}
        {activeTab === 'carreras' && (
          <div className="container">
            {ldgF1 ? <Spinner/> : (
              <>
                <div className="mb-5">
                  <LastRaceSection lastRace={lastRace} loading={false}/>
                </div>
                <CalendarSection calendar={calendar} loading={false}/>
              </>
            )}
          </div>
        )}

        {/* ── PILOTOS ──────────────────────────────────────────────── */}
        {activeTab === 'pilotos' && (
          <div className="container">
            {ldgF1 ? <Spinner/> : (
              <DriversSection standings={driverStandings} loading={false}/>
            )}
          </div>
        )}

        {/* ── CONSTRUCTORES ────────────────────────────────────────── */}
        {activeTab === 'constructores' && (
          <div className="container">
            {ldgF1 ? <Spinner/> : (
              <ConstructorsSection standings={constructorStandings} loading={false}/>
            )}
          </div>
        )}

        {/* ── MIS POSTS (CRUD — Criterio 3.1.3) ────────────────────── */}
        {activeTab === 'noticias' && (
          <div className="container">
            <div className="crud-header-note">
              <i className="bi bi-database-fill me-2" style={{color:'var(--red)'}}/>
              Gestión local de posts · CRUD + Local Storage · API JSONPlaceholder
            </div>
            {ldgPosts && <Spinner/>}
            {!ldgPosts && error && <ErrorMessage message={error} onRetry={resetData}/>}
            {!ldgPosts && !error && (
              <PostList posts={posts} totalPosts={totalPosts}
                searchTerm={searchTerm} onSearch={setSearch}
                onNew={openCreate} onEdit={openEdit} onDelete={deletePost}/>
            )}
          </div>
        )}

      </main>

      <footer className="nexus-footer" role="contentinfo">
        <div className="nexus-stripe mb-2"/>
        <svg viewBox="0 0 120 32" fill="none" style={{height:14,width:'auto',opacity:.5,marginBottom:6}}
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 0H42V8H10V12H38V20H10V32H0V0Z" fill="white"/>
          <path d="M48 0H58V32H48V0Z" fill="white"/>
          <path d="M63 0H108C113 0 118 5 118 10V22C118 27 113 32 108 32H73V24H106C108 24 110 22 110 20V12C110 10 108 8 106 8H73V0H63Z" fill="#e10600"/>
          <path d="M63 32V20L76 20V32H63Z" fill="white"/>
        </svg>
        <p>SCUDERIA NEXUS &nbsp;·&nbsp; Datos: Ergast/Jolpica API &nbsp;·&nbsp; Temporada 2026</p>
      </footer>

      <PostForm show={modalOpen} post={editingPost} onSubmit={handleSubmit} onClose={closeModal}/>
      <ToastNotification toast={toast}/>
    </div>
  );
}

export default App;
