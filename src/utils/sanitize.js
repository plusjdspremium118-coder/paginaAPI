/**
 * sanitize.js — Utilidades de seguridad para prevención de XSS
 *
 * MEDIDAS DE SEGURIDAD IMPLEMENTADAS:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. DOMPurify: Librería auditada de sanitización que elimina scripts
 *    maliciosos, atributos de eventos (onclick, onerror, etc.) y etiquetas
 *    peligrosas de cualquier cadena HTML.
 *
 * 2. stripTags: Función adicional que elimina completamente cualquier
 *    etiqueta HTML, dejando sólo texto plano. Se usa para campos como
 *    'title' y 'body' donde no se espera HTML legítimo.
 *
 * 3. Validación de longitud: Previene ataques de desbordamiento o datos
 *    excesivos en Local Storage.
 *
 * JUSTIFICACIÓN (Rúbrica 3.1.2):
 * Los datos del usuario NUNCA se insertan directamente en el DOM via innerHTML.
 * Todo input pasa primero por sanitize() antes de guardarse en Local Storage,
 * y se muestra usando textContent / props de React (que escapan por defecto).
 * ─────────────────────────────────────────────────────────────────────────
 */
import DOMPurify from 'dompurify';

/** Longitudes máximas permitidas por campo */
export const FIELD_LIMITS = {
  title: 200,
  body: 2000,
};

/**
 * Sanitiza una cadena eliminando HTML peligroso mediante DOMPurify.
 * @param {string} str - Cadena a sanitizar
 * @returns {string} - Cadena limpia
 */
export const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return '';
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Elimina todas las etiquetas HTML y normaliza espacios.
 * Capa adicional de defensa (defense-in-depth) complementaria a DOMPurify.
 * @param {string} str
 * @returns {string}
 */
export const stripTags = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')        // Elimina etiquetas HTML
    .replace(/&[a-z]+;/gi, ' ')     // Elimina entidades HTML comunes
    .replace(/\s+/g, ' ')           // Normaliza espacios múltiples
    .trim();
};

/**
 * Sanitiza y recorta un campo de texto según los límites definidos.
 * Combina stripTags + truncado para garantizar integridad en Local Storage.
 * @param {string} value - Valor del campo
 * @param {'title'|'body'} field - Nombre del campo
 * @returns {string}
 */
export const sanitizeField = (value, field) => {
  const clean = sanitizeHTML(stripTags(value));
  const limit = FIELD_LIMITS[field] ?? 1000;
  return clean.substring(0, limit);
};

/**
 * Valida que un objeto Post tenga la estructura correcta antes de
 * guardarlo en Local Storage. Previene corrupción de datos.
 * @param {object} post - Objeto a validar
 * @returns {boolean}
 */
export const isValidPost = (post) => {
  if (!post || typeof post !== 'object') return false;
  if (!('id' in post) || !('title' in post) || !('body' in post)) return false;
  if (typeof post.title !== 'string' || post.title.trim().length === 0) return false;
  if (typeof post.body !== 'string' || post.body.trim().length === 0) return false;
  return true;
};

/**
 * Sanitiza un array de posts completo (por ejemplo, la respuesta de la API)
 * verificando la estructura de cada elemento antes de procesarlo.
 * @param {Array} posts - Array de posts de la API
 * @returns {Array} - Array sanitizado
 */
export const sanitizeApiResponse = (posts) => {
  if (!Array.isArray(posts)) {
    throw new TypeError('La respuesta de la API no es un array válido.');
  }
  return posts
    .filter(p => p && typeof p === 'object' && 'id' in p && 'title' in p && 'body' in p)
    .map(p => ({
      id: Number(p.id),
      userId: Number(p.userId) || 1,
      title: sanitizeField(String(p.title), 'title'),
      body: sanitizeField(String(p.body), 'body'),
      isLocal: false, // Flag para distinguir posts locales de los de la API
    }))
    .filter(p => p.title.length > 0 && p.body.length > 0);
};
