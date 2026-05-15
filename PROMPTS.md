# PROMPTS.md — Catálogo de Prompts y Justificaciones de IA
## Proyecto: Scuderia Nexus F1 — SPA CRUD React

> **Propósito de este documento:** Registrar todos los prompts utilizados durante el desarrollo de este proyecto, junto con las justificaciones de las decisiones de diseño recomendadas por la IA, en cumplimiento del criterio de rúbrica **3.1.1 (Uso de prompts y derechos de autor)**.

---

## PROMPT #1 — Prompt Inicial (Principal)

**Fecha:** 2026-05-08  
**Herramienta IA:** Antigravity (Google DeepMind) — Claude Sonnet 4.6 Thinking  

### Texto del Prompt

> "Como experto desarrollador de React y experto en seguridad web para fines educativos, genera el código fuente completo de una Single Page Application (SPA) que cumpla al 100% con la rúbrica de evaluación adjunta. El objetivo del proyecto es consumir una API pública (https://jsonplaceholder.typicode.com/posts) y simular una gestión CRUD completa y local utilizando Local Storage con persistencia..."
> *(ver prompt completo en el enunciado del proyecto)*

### Respuesta y Justificaciones de la IA

La IA propuso y justificó las siguientes decisiones de arquitectura:

---

### Decisión 1: Arquitectura de Componentes

**Componentes creados:**
```
App.js               → Orquestador (Container Pattern)
Header.jsx           → Presentacional: branding F1
PostList.jsx         → Contenedor: grid + toolbar
PostCard.jsx         → Presentacional: tarjeta individual (memo)
PostForm.jsx         → Formulario modal dual (crear/editar)
ErrorMessage.jsx     → Presentacional: manejo de errores
ToastNotification.jsx → Presentacional: feedback no bloqueante
```

**Justificación de la IA:**
> Se adoptó el patrón **Container/Presenter** de React. `App.js` actúa como orquestador puro: no tiene lógica de negocio, sólo conecta el Custom Hook (datos) con los componentes (vista). Los componentes presentacionales son funciones puras que reciben props y emiten eventos, lo que facilita las pruebas unitarias y el razonamiento sobre el código.
>
> `PostCard` se envuelve en `React.memo` porque se renderiza N veces (una por post) y es costoso re-renderizar cards que no han cambiado cuando otro post se elimina.

---

### Decisión 2: Custom Hook `usePosts`

**Justificación de la IA:**
> En lugar de gestionar el estado directamente en `App.js`, se extrae TODA la lógica de negocio (fetch, CRUD, persistencia) a un Custom Hook. Esto sigue el principio **Separation of Concerns (SoC)**:
> - Los componentes sólo describen la UI.
> - El hook contiene toda la lógica de datos.
>
> Beneficios: el hook es reutilizable en múltiples componentes, se puede testear de forma independiente (sin montar la UI), y hace que App.js sea legible de un vistazo.

---

### Decisión 3: Medidas de Seguridad — Plan Previo al Código

**La IA proporcionó el siguiente plan de seguridad ANTES de escribir código:**

#### Amenazas identificadas y mitigaciones

| Amenaza | Vector | Mitigación Implementada |
|---------|--------|------------------------|
| **XSS (Cross-Site Scripting)** | Input de usuario → Local Storage → DOM | DOMPurify sanitiza todo input; React escapa JSX automáticamente; nunca se usa `innerHTML` |
| **XSS via API** | Respuesta de jsonplaceholder → DOM | `sanitizeApiResponse()` aplica DOMPurify a todos los campos de la API antes de usarlos |
| **Inyección en Local Storage** | JSON malformado | `try/catch` en todas las operaciones LS; validación de estructura con `isValidPost()` |
| **Datos corruptos en LS** | Manipulación manual del LS | Filtrado de posts inválidos antes de persistir (`filter(isValidPost)`) |
| **Overflow de datos** | Input muy largo | `maxLength` en inputs HTML + truncado programático con `FIELD_LIMITS` |
| **Colisión de IDs** | IDs numéricos secuenciales | UUID v4 para posts locales (criptográficamente únicos) |
| **Fuga de memoria** | `setState` post-desmontaje | Flag `cancelled` en `useEffect` para cancelar operaciones asíncronas |

#### Principios aplicados
1. **Defense-in-depth:** Múltiples capas de sanitización (DOMPurify + stripTags + React escaping)
2. **Fail-safe defaults:** Si algo falla en LS o API, se muestra error informativo en lugar de crashear
3. **Least privilege:** Los datos de usuario nunca se ejecutan como código
4. **Input validation:** Validación de longitud, formato y presencia ANTES de cualquier operación

---

### Decisión 4: Estado Inmutable

**Justificación de la IA:**
> React detecta cambios comparando referencias de objetos (no deep equality). Si mutáramos el array de posts directamente (`posts.push(...)`) React no detectaría el cambio y no re-renderizaría.
>
> Por eso se usan operaciones funcionales puras:
> - `[newPost, ...posts]` → CREATE
> - `posts.map(p => p.id === id ? {...p, ...changes} : p)` → UPDATE
> - `posts.filter(p => p.id !== id)` → DELETE
>
> Cada operación crea un nuevo array y nuevos objetos, garantizando que React detecte los cambios y actualice el DOM eficientemente.

---

### Decisión 5: Validación de Formulario "Doble Capa"

**Justificación de la IA:**
> Se implementaron dos capas de validación complementarias:
>
> 1. **Validación UX** (PostForm.jsx): Feedback visual en tiempo real mientras el usuario escribe (solo si ya tocó el campo), mostrando errores con colores institucionales (Amarillo) y contadores de caracteres.
>
> 2. **Sanitización de seguridad** (usePosts.js + sanitize.js): Incluso si el formulario valida como correcto, los datos pasan por DOMPurify antes de guardarse. Esto protege contra XSS incluso si la validación de frontend es bypaseada (ej. via DevTools).
>
> La validación no es sólo UX — es una barrera de seguridad.

---

### Decisión 6: Identidad Visual F1

**Justificación de la IA:**
> La temática F1 se implementa con:
> - **Textura fibra de carbono:** CSS gradients repeating perpendiculares simulando el tejido de carbono (sin imágenes externas, mejor performance).
> - **Tipografía Rajdhani:** Fuente sans-serif con rasgos angulares similares a los usados en liveries de F1.
> - **Paleta institucional:** Rojo Racing (#e8001c) como acento principal, Magenta (#cc00aa) para acciones destructivas/creativas, Amarillo (#f5c800) para estados de alerta/foco.
> - **Stripe tricolor** (Rojo → Magenta → Amarillo) reforzando la identidad en header y footer.

---

## PROMPT #2 — Clarificación sobre UUID vs IDs numéricos

**Pregunta implícita resuelta:** ¿Qué ID usar para los posts creados localmente?

**Respuesta de la IA:**
> Se usó `uuid` (v4) en lugar de IDs incrementales porque:
> 1. Los posts de la API ya usan IDs del 1 al 100. Un ID local "101" podría colisionar al reiniciar y mezclar datos.
> 2. Los UUIDs son criptográficamente aleatorios, garantizando unicidad global.
> 3. Se añadió el flag `isLocal: true` para distinguir visualmente (badge "LOCAL") los posts creados localmente de los provenientes de la API.

---

## PROMPT #3 — Clarificación sobre Bootstrap 5 vs CSS personalizado

**Pregunta implícita resuelta:** ¿Usar exclusivamente Bootstrap o combinar con CSS personalizado?

**Respuesta de la IA:**
> Se usa Bootstrap 5 para el **layout responsive** (grid, breakpoints, display utilities) pero se complementa con CSS custom para la identidad visual F1, ya que Bootstrap por defecto no tiene variables de diseño oscuro ni tipografía Rajdhani.
>
> Esta combinación es la práctica estándar: Bootstrap para estructura/responsividad, CSS propio para marca. No se usa Tailwind (no requerido).

---

## Notas de Derechos de Autor

- Todo el código fue generado asistido por IA con fines **educativos**.
- Las librerías externas usadas tienen licencias compatibles:
  - `dompurify`: Apache 2.0 / Mozilla Public License 2.0
  - `uuid`: MIT
  - Bootstrap 5: MIT
  - React: MIT
- La API `jsonplaceholder.typicode.com` es pública y de libre uso para demos.
