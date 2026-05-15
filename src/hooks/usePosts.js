/**
 * usePosts.js — Custom Hook CRUD + API F1 (Ergast/Jolpica) + Local Storage
 *
 * API USADA: https://api.jolpi.ca/ergast/f1/2025/races.json
 * Fuente oficial de datos F1 (mirror comunitario de Ergast MRD)
 * Datos: Calendario de la temporada 2025 de Fórmula 1
 */
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeField, isValidPost } from '../utils/sanitize';
import { loadPostsFromStorage, savePostsToStorage } from '../utils/storage';

const API_URL = 'https://api.jolpi.ca/ergast/f1/2025/races.json';

/** Traduce nombres de GP al español */
const traducirGP = (nombre) => {
  const mapa = {
    'Bahrain Grand Prix':          'Gran Premio de Baréin',
    'Saudi Arabian Grand Prix':    'Gran Premio de Arabia Saudita',
    'Australian Grand Prix':       'Gran Premio de Australia',
    'Japanese Grand Prix':         'Gran Premio de Japón',
    'Chinese Grand Prix':          'Gran Premio de China',
    'Miami Grand Prix':            'Gran Premio de Miami',
    'Emilia Romagna Grand Prix':   'Gran Premio de Emilia Romaña',
    'Monaco Grand Prix':           'Gran Premio de Mónaco',
    'Canadian Grand Prix':         'Gran Premio de Canadá',
    'Spanish Grand Prix':          'Gran Premio de España',
    'Austrian Grand Prix':         'Gran Premio de Austria',
    'British Grand Prix':          'Gran Premio de Gran Bretaña',
    'Hungarian Grand Prix':        'Gran Premio de Hungría',
    'Belgian Grand Prix':          'Gran Premio de Bélgica',
    'Dutch Grand Prix':            'Gran Premio de los Países Bajos',
    'Italian Grand Prix':          'Gran Premio de Italia',
    'Azerbaijan Grand Prix':       'Gran Premio de Azerbaiyán',
    'Singapore Grand Prix':        'Gran Premio de Singapur',
    'United States Grand Prix':    'Gran Premio de los Estados Unidos',
    'Mexico City Grand Prix':      'Gran Premio de la Ciudad de México',
    'São Paulo Grand Prix':        'Gran Premio de São Paulo',
    'Las Vegas Grand Prix':        'Gran Premio de Las Vegas',
    'Qatar Grand Prix':            'Gran Premio de Catar',
    'Abu Dhabi Grand Prix':        'Gran Premio de Abu Dabi',
  };
  return mapa[nombre] || nombre;
};

/** Traduce nombres de país al español */
const traducirPais = (pais) => {
  const mapa = {
    'Bahrain': 'Baréin', 'Saudi Arabia': 'Arabia Saudita', 'Australia': 'Australia',
    'Japan': 'Japón', 'China': 'China', 'USA': 'Estados Unidos',
    'Italy': 'Italia', 'Monaco': 'Mónaco', 'Canada': 'Canadá',
    'Spain': 'España', 'Austria': 'Austria', 'UK': 'Gran Bretaña',
    'Hungary': 'Hungría', 'Belgium': 'Bélgica', 'Netherlands': 'Países Bajos',
    'Azerbaijan': 'Azerbaiyán', 'Singapore': 'Singapur', 'Mexico': 'México',
    'Brazil': 'Brasil', 'Qatar': 'Catar', 'UAE': 'Emiratos Árabes',
  };
  return mapa[pais] || pais;
};

/** Convierte una fecha ISO al formato español */
const formatearFecha = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const meses = ['','enero','febrero','marzo','abril','mayo','junio',
                  'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${meses[parseInt(m)]} de ${y}`;
};

/** Mapea una carrera de la API al formato interno de la app */
const mapearCarrera = (race) => {
  const pais   = traducirPais(race.Circuit?.Location?.country || '');
  const ciudad = race.Circuit?.Location?.locality || '';
  const fecha  = formatearFecha(race.date);
  const circuito = race.Circuit?.circuitName || 'Circuito desconocido';
  const ronda  = parseInt(race.round) || 0;

  return {
    id:       ronda,
    userId:   1,
    title:    traducirGP(race.raceName || ''),
    body:     `Ronda ${ronda} · ${circuito} · ${ciudad}, ${pais}. Fecha: ${fecha}.`,
    circuito,
    ciudad,
    pais,
    fecha,
    ronda,
    isLocal:  false,
  };
};

const usePosts = () => {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [toast, setToast]     = useState(null);
  const [searchTerm, setSearch] = useState('');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: uuidv4() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const persist = useCallback((updated) => {
    const ok = savePostsToStorage(updated);
    if (!ok) showToast('Error al guardar en Local Storage', 'error');
  }, [showToast]);

  /* ── Inicialización ──────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true); setError(null);

      const cached = loadPostsFromStorage();
      if (cached && cached.length > 0) {
        if (!cancelled) { setPosts(cached); setLoading(false); }
        return;
      }

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const json = await res.json();
        const races = json?.MRData?.RaceTable?.Races;

        if (!Array.isArray(races) || races.length === 0)
          throw new TypeError('Respuesta de la API F1 no contiene carreras.');

        const mapped = races.map(mapearCarrera).filter(isValidPost);

        if (!cancelled) {
          setPosts(mapped);
          savePostsToStorage(mapped);
          showToast(`${mapped.length} carreras F1 2025 cargadas`, 'info');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[usePosts] Error:', err);
          setError(
            err instanceof TypeError
              ? 'Sin conexión. No se pudo contactar la API de F1.'
              : err.message || 'Error desconocido al cargar el calendario F1.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  /* ── CRUD ────────────────────────────────────────────────────────── */
  const createPost = useCallback((formData) => {
    const newPost = {
      id:        uuidv4(),
      userId:    999,
      title:     sanitizeField(formData.title, 'title'),
      body:      sanitizeField(formData.body, 'body'),
      isLocal:   true,
      createdAt: new Date().toISOString(),
    };
    if (!isValidPost(newPost)) { showToast('Datos inválidos', 'error'); return false; }
    const updated = [newPost, ...posts];
    setPosts(updated); persist(updated);
    showToast('Post creado exitosamente', 'success');
    return true;
  }, [posts, persist, showToast]);

  const updatePost = useCallback((id, formData) => {
    const updated = posts.map(p =>
      String(p.id) !== String(id) ? p : {
        ...p,
        title: sanitizeField(formData.title, 'title'),
        body:  sanitizeField(formData.body, 'body'),
        updatedAt: new Date().toISOString(),
      }
    );
    setPosts(updated); persist(updated);
    showToast('Post actualizado correctamente', 'success');
  }, [posts, persist, showToast]);

  const deletePost = useCallback((id) => {
    const updated = posts.filter(p => String(p.id) !== String(id));
    setPosts(updated); persist(updated);
    showToast('Eliminado del panel', 'info');
  }, [posts, persist, showToast]);

  const resetData = useCallback(() => {
    localStorage.removeItem('nexus_f1_posts');
    setPosts([]); setError(null); setLoading(true);
    fetch(API_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        const races = json?.MRData?.RaceTable?.Races;
        if (!Array.isArray(races)) throw new TypeError('Sin datos de carreras.');
        const mapped = races.map(mapearCarrera).filter(isValidPost);
        setPosts(mapped); savePostsToStorage(mapped);
        showToast('Datos reiniciados desde la API F1', 'info');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [showToast]);

  /* ── Búsqueda ────────────────────────────────────────────────────── */
  const filteredPosts = searchTerm.trim()
    ? posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return {
    posts: filteredPosts, totalPosts: posts.length,
    loading, error, toast, searchTerm, setSearch,
    createPost, updatePost, deletePost, resetData,
  };
};

export default usePosts;
