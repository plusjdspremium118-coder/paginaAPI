/**
 * PostForm.jsx — Formulario modal para Crear y Editar posts
 *
 * PROPS RECIBIDOS:
 *   show         {bool}    — Controla visibilidad del modal (Bootstrap)
 *   post         {object}  — Post a editar (null = modo Crear)
 *   onSubmit     {func}    — Callback con los datos del formulario validados
 *   onClose      {func}    — Callback para cerrar el modal
 *
 * JUSTIFICACIÓN DE DISEÑO (IA):
 * ─────────────────────────────────────────────────────────────────────────
 * - Se usa un único componente para Crear Y Editar ("modo dual") en lugar de
 *   dos componentes separados, ya que la estructura del formulario es idéntica.
 *   El prop `post` determina el modo: null → Crear, objeto → Editar.
 * - Estado local del formulario (useState) separado del estado global de la app.
 *   El formulario maneja su propio estado transitorio; sólo al hacer submit
 *   se notifica al padre via onSubmit.
 * - useEffect sincroniza el formulario cuando cambia el prop `post`
 *   (al abrir el modal en modo edición con datos pre-cargados).
 *
 * VALIDACIONES IMPLEMENTADAS (Rúbrica 3.1.3):
 * - Title: obligatorio, mínimo 3 caracteres, máximo 200
 * - Body:  obligatorio, mínimo 10 caracteres, máximo 2000
 * - La validación se ejecuta en el evento onSubmit del formulario ANTES de
 *   llamar al callback del padre, garantizando integridad de datos.
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useCallback } from 'react';
import { FIELD_LIMITS } from '../utils/sanitize';

/** Valores iniciales del formulario */
const INITIAL_FORM = { title: '', body: '' };

/** Reglas de validación por campo */
const VALIDATION_RULES = {
  title: {
    minLength: 3,
    maxLength: FIELD_LIMITS.title,
    label: 'Título',
  },
  body: {
    minLength: 10,
    maxLength: FIELD_LIMITS.body,
    label: 'Contenido',
  },
};

/**
 * Valida el formulario y retorna un objeto de errores.
 * Si el objeto está vacío, el formulario es válido.
 * @param {{ title: string, body: string }} values
 * @returns {{ title?: string, body?: string }}
 */
const validateForm = (values) => {
  const errors = {};
  Object.entries(VALIDATION_RULES).forEach(([field, rules]) => {
    const val = (values[field] || '').trim();
    if (val.length === 0) {
      errors[field] = `${rules.label} es obligatorio`;
    } else if (val.length < rules.minLength) {
      errors[field] = `${rules.label} debe tener al menos ${rules.minLength} caracteres`;
    } else if (val.length > rules.maxLength) {
      errors[field] = `${rules.label} no puede superar ${rules.maxLength} caracteres`;
    }
  });
  return errors;
};

/**
 * @param {{ show: boolean, post: object|null, onSubmit: Function, onClose: Function }} props
 */
const PostForm = ({ show, post, onSubmit, onClose }) => {
  // Estado local del formulario
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({}); // Campos que el usuario ya tocó

  const isEditMode = post !== null && post !== undefined;

  // Sincronizar formulario cuando el modal abre (pre-cargar datos en edición)
  useEffect(() => {
    if (show) {
      setForm(isEditMode
        ? { title: post.title || '', body: post.body || '' }
        : INITIAL_FORM
      );
      setErrors({});
      setTouched({});
    }
  }, [show, post, isEditMode]);

  /** Actualiza un campo y valida en tiempo real si ya fue tocado */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Validación en tiempo real sólo si el campo ya fue tocado (evita errores prematuros)
    if (touched[name]) {
      const newErrors = validateForm({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  }, [form, touched]);

  /** Marca el campo como tocado al perder el foco (onBlur) */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validateForm(form);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
  }, [form]);

  /** Maneja el submit del formulario */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados para mostrar todos los errores
    setTouched({ title: true, body: true });

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Detener si hay errores
    }

    // Formulario válido → notificar al padre
    onSubmit({ title: form.title.trim(), body: form.body.trim() });
  }, [form, onSubmit]);

  /** Contador de caracteres para feedback visual */
  const charCount = (field) => form[field]?.length || 0;

  if (!show) return null;

  return (
    /* Overlay del modal */
    <div
      className="modal d-flex align-items-center justify-content-center nexus-modal"
      style={{
        display: 'flex !important',
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 1050,
        backdropFilter: 'blur(4px)',
        animation: 'card-fade-in 0.2s ease',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      id="post-form-modal"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-lg w-100" style={{ maxWidth: '680px', margin: '1rem' }}>
        <div className="modal-content">

          {/* ── Cabecera del modal ─────────────────────────────────── */}
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title">
              <i
                className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}
                aria-hidden="true"
                style={{ color: 'var(--nexus-magenta)' }}
              />
              {isEditMode ? 'EDITAR POST' : 'NUEVO POST'}
            </h2>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar formulario"
              id="btn-close-modal"
            />
          </div>

          {/* ── Cuerpo del formulario ─────────────────────────────── */}
          <form
            id="post-form"
            className="nexus-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label={isEditMode ? 'Formulario de edición de post' : 'Formulario de creación de post'}
          >
            <div className="modal-body" style={{ padding: '1.5rem' }}>

              {/* Campo: Título */}
              <div className="mb-4">
                <label htmlFor="field-title" className="form-label">
                  <i className="bi bi-card-heading me-1" aria-hidden="true" />
                  Título *
                </label>
                <input
                  id="field-title"
                  name="title"
                  type="text"
                  className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej: Gran Premio de Mónaco 2024..."
                  maxLength={FIELD_LIMITS.title}
                  autoComplete="off"
                  aria-required="true"
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                <div className="d-flex justify-content-between mt-1">
                  {errors.title && touched.title ? (
                    <div className="invalid-feedback d-block" id="title-error" role="alert">
                      <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
                      {errors.title}
                    </div>
                  ) : <span />}
                  <small
                    style={{
                      color: charCount('title') > FIELD_LIMITS.title * 0.85
                        ? 'var(--nexus-yellow)' : 'var(--nexus-gray)',
                      fontSize: '0.72rem',
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                    aria-live="polite"
                  >
                    {charCount('title')}/{FIELD_LIMITS.title}
                  </small>
                </div>
              </div>

              {/* Campo: Contenido */}
              <div className="mb-3">
                <label htmlFor="field-body" className="form-label">
                  <i className="bi bi-text-paragraph me-1" aria-hidden="true" />
                  Contenido *
                </label>
                <textarea
                  id="field-body"
                  name="body"
                  className={`form-control ${errors.body && touched.body ? 'is-invalid' : ''}`}
                  value={form.body}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe el contenido del post..."
                  rows={6}
                  maxLength={FIELD_LIMITS.body}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                  aria-required="true"
                  aria-describedby={errors.body ? 'body-error' : undefined}
                />
                <div className="d-flex justify-content-between mt-1">
                  {errors.body && touched.body ? (
                    <div className="invalid-feedback d-block" id="body-error" role="alert">
                      <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
                      {errors.body}
                    </div>
                  ) : <span />}
                  <small
                    style={{
                      color: charCount('body') > FIELD_LIMITS.body * 0.85
                        ? 'var(--nexus-yellow)' : 'var(--nexus-gray)',
                      fontSize: '0.72rem',
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                    aria-live="polite"
                  >
                    {charCount('body')}/{FIELD_LIMITS.body}
                  </small>
                </div>
              </div>

              {/* Nota de seguridad */}
              <p
                style={{
                  fontSize: '0.72rem', color: 'var(--nexus-gray)',
                  borderLeft: '2px solid var(--nexus-border)',
                  paddingLeft: '0.6rem', marginTop: '1rem',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                * Los campos marcados son obligatorios. Los datos se sanitizan
                automáticamente antes de guardarse en Local Storage.
              </p>
            </div>

            {/* ── Pie del modal (acciones) ──────────────────────────── */}
            <div className="modal-footer gap-2">
              <button
                id="btn-cancel-form"
                type="button"
                className="btn-nexus-secondary"
                onClick={onClose}
              >
                <i className="bi bi-x-lg me-1" aria-hidden="true" />
                Cancelar
              </button>
              <button
                id="btn-submit-form"
                type="submit"
                className="btn-nexus-magenta"
              >
                <i
                  className={`bi ${isEditMode ? 'bi-check2-circle' : 'bi-plus-lg'} me-1`}
                  aria-hidden="true"
                />
                {isEditMode ? 'GUARDAR CAMBIOS' : 'CREAR POST'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default PostForm;
