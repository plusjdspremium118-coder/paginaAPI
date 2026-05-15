/**
 * PostCard.jsx — Tarjeta de carrera F1
 * Muestra datos del GP con diseño premium y glow effects.
 */
import React, { memo, useState } from 'react';

const truncate = (text, max = 120) =>
  !text || text.length <= max ? text : text.substring(0, max).trimEnd() + '…';

const PostCard = memo(({ post, onEdit, onDelete, index }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const displayId = typeof post.id === 'string' && post.id.length > 8
    ? `LOCAL`
    : `R${String(post.id).padStart(2, '0')}`;

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(post.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <article
      className="post-card"
      style={{ animationDelay: `${Math.min(index * 0.06, 0.6)}s` }}
      aria-label={`Carrera: ${post.title}`}
      id={`post-card-${post.id}`}
    >
      {/* Badge ronda / local */}
      <span className="card-id-badge">{displayId}</span>
      {post.isLocal && <span className="card-new-badge">NUEVO</span>}

      {/* Cuerpo */}
      <div className="card-body">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-text">{truncate(post.body)}</p>

        {/* Datos extra F1 solo si existen */}
        {post.pais && (
          <div style={{ marginTop: '.8rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {post.pais && (
              <span style={{
                background: 'rgba(232,0,28,.12)', border: '1px solid rgba(232,0,28,.3)',
                color: '#ff8090', fontSize: '.7rem', fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 700, letterSpacing: '.08em', padding: '2px 9px', borderRadius: '4px',
              }}>
                📍 {post.pais}
              </span>
            )}
            {post.fecha && (
              <span style={{
                background: 'rgba(245,200,0,.08)', border: '1px solid rgba(245,200,0,.25)',
                color: 'rgba(245,200,0,.85)', fontSize: '.7rem', fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 700, letterSpacing: '.06em', padding: '2px 9px', borderRadius: '4px',
              }}>
                🗓 {post.fecha}
              </span>
            )}
          </div>
        )}

        {/* Metadatos para posts locales */}
        {(post.createdAt || post.updatedAt) && (
          <p className="card-meta">
            {post.updatedAt
              ? `✏ Editado: ${new Date(post.updatedAt).toLocaleString('es-CL')}`
              : `＋ Creado: ${new Date(post.createdAt).toLocaleString('es-CL')}`}
          </p>
        )}
      </div>

      {/* Acciones */}
      <footer className="card-footer-actions">
        <button
          id={`btn-edit-${post.id}`}
          className="btn-nexus-magenta-outline"
          onClick={() => onEdit(post)}
          aria-label={`Editar: ${post.title}`}
        >
          <i className="bi bi-pencil me-1" aria-hidden="true" />
          Editar
        </button>
        <button
          id={`btn-delete-${post.id}`}
          className="btn-nexus-delete"
          onClick={handleDeleteClick}
          aria-label={confirmDelete ? 'Confirmar eliminación' : `Eliminar: ${post.title}`}
          style={confirmDelete ? { animation: 'pulse .5s ease infinite' } : {}}
        >
          <i className={`bi ${confirmDelete ? 'bi-exclamation-triangle' : 'bi-trash3'} me-1`} />
          {confirmDelete ? '¿Confirmar?' : 'Eliminar'}
        </button>
      </footer>
    </article>
  );
});

PostCard.displayName = 'PostCard';
export default PostCard;
