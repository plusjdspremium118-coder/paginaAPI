/**
 * PostList.jsx — Grilla de carreras F1 con toolbar en español
 */
import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts, totalPosts, searchTerm, onSearch, onNew, onEdit, onDelete }) => {
  return (
    <section aria-label="Lista de carreras F1" id="posts-section">

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="nexus-toolbar">
        <div className="row align-items-center g-3">

          <div className="col-12 col-sm-auto">
            <h2 className="nexus-section-title">
              Calendario{' '}
              <span style={{
                fontFamily: "'Inter',sans-serif", fontSize: '.75rem', fontWeight: 400,
                textTransform: 'none', letterSpacing: 0, color: 'var(--gray)', marginLeft: '.4rem',
              }}>
                F1 2025
              </span>
            </h2>
          </div>

          <div className="col-auto ms-sm-auto order-sm-3">
            <span className="nexus-stat-pill" aria-live="polite">
              <i className="bi bi-flag-fill me-1" aria-hidden="true" />
              {searchTerm ? `${posts.length} / ${totalPosts}` : `${totalPosts} carreras`}
            </span>
          </div>

          <div className="col col-sm-auto order-sm-2" style={{ minWidth: '200px', maxWidth: '340px' }}>
            <div className="position-relative">
              <i className="bi bi-search position-absolute" style={{
                left: '.7rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--gray)', fontSize: '.85rem', pointerEvents: 'none',
              }} aria-hidden="true" />
              <input
                id="search-posts" type="search" className="search-input w-100"
                style={{ paddingLeft: '2rem' }}
                placeholder="Buscar carrera o circuito..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Buscar entre las carreras"
              />
            </div>
          </div>

          <div className="col-12 col-sm-auto order-4">
            <button
              id="btn-add-post" className="btn-nexus-magenta w-100"
              onClick={onNew} aria-label="Agregar nueva carrera"
            >
              <i className="bi bi-plus-lg me-1" aria-hidden="true" />
              AGREGAR CARRERA
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <div className="nexus-empty-state" role="status" aria-live="polite">
          <span className="empty-icon" aria-hidden="true">🏎</span>
          {searchTerm
            ? <p>Ninguna carrera coincide con "{searchTerm}"</p>
            : <p>Sin carreras disponibles — ¡Agrega la primera!</p>
          }
        </div>
      ) : (
        <div className="row g-4" role="list" aria-label="Carreras F1 2025">
          {posts.map((post, index) => (
            <div key={post.id} className="col-12 col-md-6 col-xl-4" role="listitem">
              <PostCard post={post} index={index} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PostList;
