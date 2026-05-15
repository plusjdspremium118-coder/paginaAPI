/**
 * ToastNotification.jsx — Notificaciones temporales no bloqueantes
 *
 * PROPS RECIBIDOS:
 *   toast {object|null} — { message: string, type: 'success'|'error'|'info', id: string }
 *
 * JUSTIFICACIÓN DE DISEÑO (IA):
 * - Los toasts son preferibles a alert() o modales de confirmación para
 *   operaciones exitosas porque no interrumpen el flujo del usuario.
 * - Se posicionan en la esquina inferior derecha (patrón estándar de UI).
 * - Se auto-ocultan desde el hook usePosts (no hay setTimeout aquí)
 *   para mantener la lógica de tiempo en la capa de estado.
 * - role="status" + aria-live="polite" notifica a screen readers sin
 *   interrumpir la interacción actual.
 */
import React from 'react';

const ICONS = {
  success: 'bi-check-circle-fill',
  error:   'bi-x-circle-fill',
  info:    'bi-info-circle-fill',
};

/**
 * @param {{ toast: { message: string, type: string, id: string }|null }} props
 */
const ToastNotification = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className="nexus-toast-container"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      id="toast-container"
    >
      <div
        key={toast.id}
        className={`nexus-toast toast-${toast.type}`}
        id={`toast-${toast.id}`}
      >
        <i
          className={`bi ${ICONS[toast.type] || ICONS.info}`}
          aria-hidden="true"
          style={{ fontSize: '1rem', flexShrink: 0 }}
        />
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default ToastNotification;
