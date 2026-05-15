/**
 * ErrorMessage.jsx — Componente de visualización de errores
 *
 * PROPS RECIBIDOS:
 *   message {string}  — Mensaje de error a mostrar
 *   onRetry {func}    — Callback para reintentar la operación fallida
 *
 * JUSTIFICACIÓN DE DISEÑO (IA):
 * - Componente dedicado para errores (SRP). Evita mezclar lógica de error
 *   con lógica de renderizado de datos en el componente padre.
 * - Incluye un botón de reintento para mejorar la UX cuando falla la API.
 * - usa role="alert" para accesibilidad (screen readers anuncian el error).
 *
 * SEGURIDAD:
 * - El mensaje de error se pasa como prop de texto plano (nunca via innerHTML),
 *   React escapa automáticamente en el JSX, previniendo XSS.
 */
import React from 'react';

/**
 * @param {{ message: string, onRetry?: Function }} props
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      className="nexus-alert nexus-alert-error d-flex align-items-start gap-3 p-4 my-4"
      role="alert"
      aria-live="assertive"
      id="error-message-container"
    >
      {/* Icono de error */}
      <i
        className="bi bi-exclamation-triangle-fill"
        style={{ fontSize: '1.5rem', color: '#ff6b7a', flexShrink: 0 }}
        aria-hidden="true"
      />

      <div className="flex-grow-1">
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          ERROR DE CONEXIÓN
        </div>
        {/* React escapa el texto automáticamente — no hay riesgo de XSS */}
        <p style={{ fontSize: '0.88rem', color: '#ccc', margin: 0 }}>
          {message}
        </p>

        {onRetry && (
          <button
            id="btn-retry-fetch"
            className="btn-nexus-secondary mt-3"
            onClick={onRetry}
            aria-label="Reintentar la carga de posts"
          >
            <i className="bi bi-arrow-repeat me-1" aria-hidden="true" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
