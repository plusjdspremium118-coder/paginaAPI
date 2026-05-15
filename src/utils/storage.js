/**
 * storage.js — Capa de abstracción para Local Storage
 *
 * SEGURIDAD Y BUENAS PRÁCTICAS:
 * ─────────────────────────────────────────────────────────────────────────
 * - Todos los accesos a localStorage están envueltos en try/catch para
 *   manejar el caso en que el almacenamiento esté lleno (QuotaExceededError)
 *   o deshabilitado (modo privado, iframe sandboxed).
 * - Los datos se validan con isValidPost() ANTES de persistir para garantizar
 *   integridad referencial en Local Storage.
 * - Se usa JSON.parse / JSON.stringify con manejo de errores para evitar
 *   crashes por datos corruptos.
 *
 * JUSTIFICACIÓN DE DISEÑO:
 * Se centraliza toda la lógica de persistencia aquí para que los componentes
 * React no conozcan detalles de implementación de almacenamiento (SRP).
 * ─────────────────────────────────────────────────────────────────────────
 */
import { isValidPost } from './sanitize';

const STORAGE_KEY = 'nexus_f1_posts';

/**
 * Lee los posts guardados en Local Storage.
 * @returns {Array|null} Array de posts o null si no existe / hay error
 */
export const loadPostsFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (err) {
    console.error('[Storage] Error leyendo Local Storage:', err);
    return null;
  }
};

/**
 * Guarda el array completo de posts en Local Storage.
 * Valida cada post antes de persistir.
 * @param {Array} posts - Array de posts a guardar
 * @returns {boolean} true si tuvo éxito, false si falló
 */
export const savePostsToStorage = (posts) => {
  try {
    if (!Array.isArray(posts)) throw new TypeError('posts debe ser un Array');
    // Filtrar posts inválidos para no corromper el almacenamiento
    const validPosts = posts.filter(isValidPost);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validPosts));
    return true;
  } catch (err) {
    console.error('[Storage] Error guardando en Local Storage:', err);
    return false;
  }
};

/**
 * Limpia completamente el almacenamiento de la aplicación.
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[Storage] Error limpiando Local Storage:', err);
  }
};
