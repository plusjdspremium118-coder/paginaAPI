# SETUP.md — Guía de Instalación y Configuración
## Proyecto: Scuderia Nexus F1 — SPA CRUD React

> **Criterio Rúbrica:** 3.1 — Instalación y configuración del entorno de desarrollo.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

| Herramienta | Versión mínima | Comando de verificación |
|------------|---------------|------------------------|
| **Node.js** | 18.x o superior | `node --version` |
| **npm** | 9.x o superior | `npm --version` |
| **Git** | Cualquier versión reciente | `git --version` |

Puedes descargar Node.js (que incluye npm) desde: https://nodejs.org/

---

## Estructura de Archivos del Proyecto

```
eva3fe/
├── public/
│   └── index.html              # HTML base con Bootstrap 5, Fonts
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Barra de navegación F1
│   │   ├── PostList.jsx        # Grilla de tarjetas + toolbar
│   │   ├── PostCard.jsx        # Tarjeta individual de post
│   │   ├── PostForm.jsx        # Modal de formulario (Crear/Editar)
│   │   ├── ErrorMessage.jsx    # Componente de error
│   │   └── ToastNotification.jsx # Notificaciones temporales
│   ├── hooks/
│   │   └── usePosts.js         # Custom Hook (CRUD + API + localStorage)
│   ├── utils/
│   │   ├── sanitize.js         # Utilidades de seguridad (DOMPurify)
│   │   └── storage.js          # Abstracción de Local Storage
│   ├── App.js                  # Componente raíz / orquestador
│   ├── App.css                 # Estilos específicos de App
│   ├── index.js                # Punto de entrada React
│   └── index.css               # Estilos globales + tema F1
├── PROMPTS.md                  # Catálogo de prompts (rúbrica 3.1.1)
├── SETUP.md                    # Este archivo
├── package.json
└── README.md
```

---

## Instalación Paso a Paso

### Paso 1: Clonar o verificar el repositorio

Si el proyecto ya existe en tu máquina (caso actual):
```bash
# Verificar que estás en el directorio correcto
cd c:\Users\Usuario\Desktop\eva3fe
# o en sistemas Unix:
cd ~/Desktop/eva3fe
```

Si necesitas clonar desde Git:
```bash
git clone <URL_DEL_REPOSITORIO> eva3fe
cd eva3fe
```

---

### Paso 2: Instalar dependencias

```bash
npm install
```

Este comando lee `package.json` e instala todas las dependencias necesarias en `node_modules/`.

**Dependencias incluidas:**
- `react` y `react-dom` — Framework principal
- `react-scripts` — Herramientas de desarrollo CRA
- `dompurify` — Sanitización anti-XSS
- `uuid` — Generación de IDs únicos

> ⚠️ **Nota:** Verás advertencias sobre vulnerabilidades en dependencias de desarrollo de CRA. Estas afectan **sólo** al tooling de desarrollo, **no** al bundle de producción. Es conocido y documentado en CRA.

---

### Paso 3: Verificar la instalación

```bash
# Verificar que node_modules existe
ls node_modules | head -5

# Verificar las dependencias clave
npm list dompurify uuid
```

Deberías ver:
```
eva3fe@0.1.0
├── dompurify@3.x.x
└── uuid@x.x.x
```

---

### Paso 4: Ejecutar en modo desarrollo

```bash
npm start
```

Este comando:
1. Compila el proyecto con webpack
2. Inicia un servidor de desarrollo en `http://localhost:3000`
3. Abre el navegador automáticamente
4. Activa Hot Module Replacement (HMR) para ver cambios en tiempo real

**Salida esperada:**
```
Compiled successfully!

You can now view eva3fe in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

---

### Paso 5 (Opcional): Compilar para producción

```bash
npm run build
```

Genera una versión optimizada y minificada en la carpeta `build/`.

Para servir el build de producción localmente:
```bash
# Instalar serve globalmente (sólo una vez)
npm install -g serve

# Servir el build
serve -s build
```

---

## Solución de Problemas Comunes

### Error: "node_modules not found" o "Cannot find module"
```bash
# Eliminar e reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de puerto 3000 ocupado
```bash
# En Windows: cambiar el puerto
set PORT=3001 && npm start

# En Linux/Mac:
PORT=3001 npm start
```

### Error: "DOMPurify is not defined"
```bash
# Verificar que dompurify está instalado
npm list dompurify
# Si no aparece:
npm install dompurify
```

### La app no carga posts (error de API)
- Verificar conexión a internet
- La API `https://jsonplaceholder.typicode.com/posts` debe estar accesible
- Usar el botón **Reset API** en el header para reintentar

### Limpiar datos de Local Storage manualmente
1. Abrir DevTools (F12)
2. Application → Storage → Local Storage → http://localhost:3000
3. Borrar la clave `nexus_f1_posts`
4. Recargar la página

---

## Variables de Entorno (Opcional)

Si necesitas cambiar la URL de la API, crea un archivo `.env` en la raíz:

```env
REACT_APP_API_URL=https://jsonplaceholder.typicode.com/posts
```

Y usa `process.env.REACT_APP_API_URL` en el código.

> **Nota de seguridad:** Nunca pongas credenciales o secrets en `.env` de CRA, ya que se incluyen en el bundle del cliente.

---

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19.x | Framework de UI |
| Create React App | 5.x | Scaffolding y tooling |
| Bootstrap 5 | 5.3.3 | Layout responsive (CDN) |
| Bootstrap Icons | 1.11.3 | Iconografía (CDN) |
| DOMPurify | 3.x | Sanitización anti-XSS |
| UUID | v4 | IDs únicos para posts locales |
| Google Fonts | — | Rajdhani + Inter (CDN) |
| JSONPlaceholder | — | API pública de posts |

---

## Comandos Rápidos

```bash
npm start          # Servidor de desarrollo (localhost:3000)
npm run build      # Build de producción optimizado
npm test           # Ejecutar tests unitarios
npm run eject      # Exponer configuración de webpack (¡irreversible!)
```

---

*Documento generado como parte del proyecto educativo Scuderia Nexus F1 — 2024*
