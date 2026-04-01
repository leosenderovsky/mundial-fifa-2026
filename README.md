# 🏆 Copa Mundial FIFA 2026

Portal de datos en tiempo real del Mundial de Fútbol 2026 (EE.UU., México y Canadá), con resultados en vivo, fixture, sedes y análisis generados por IA.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)

## ✨ Funcionalidades

| Sección | Descripción |
|---|---|
| 🏠 **Home** | Hero con countdown, partidos en vivo, últimos resultados y goleadores |
| 📅 **Fixture** | Grupos de la fase clasificatoria y llaves del bracket de eliminación |
| 🏟️ **Sedes** | Mapa interactivo (Leaflet) con info de los 16 estadios |
| 🌍 **Mapa** | Mapa mundial con la distribución geográfica de las selecciones clasificadas |
| 👕 **Selecciones** | Plantillas, formaciones tácticas y bio de jugadores generada con Gemini |
| 📊 **Estadísticas** | Tabla de goleadores, estadísticas por equipo y resumen del torneo con IA |

## 🔑 APIs utilizadas

- **[football-data.org v4](https://www.football-data.org/)** — Datos de partidos, standings, goleadores y equipos
- **[Google Gemini 2.0 Flash](https://ai.google.dev/)** — Análisis de partidos, bios de jugadores y resúmenes del torneo

## 🛠️ Stack técnico

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS 3 (dark mode por clase)
- **Routing:** React Router DOM v6
- **Data fetching:** TanStack Query v5 (con caché de 5 min)
- **Animaciones:** Framer Motion
- **Mapas:** React Leaflet
- **UI Icons:** Lucide React
- **Deploy:** Netlify (con redirects para SPA)

## 🚀 Instalación local

### 1. Clonar el repo

```bash
git clone https://github.com/leosenderovsky/mundial-fifa-2026.git
cd mundial-fifa-2026
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editá `.env` con tus claves:

```env
VITE_FOOTBALL_DATA_API_KEY=tu_clave_de_football_data
GEMINI_API_KEY=tu_clave_de_gemini
```

> - Clave de football-data.org: [registrate gratis](https://www.football-data.org/client/register)
> - Clave de Gemini: [Google AI Studio](https://aistudio.google.com/app/apikey)

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173)

### 5. Build para producción

```bash
npm run build
```

## ☁️ Deploy en Netlify

El proyecto incluye `netlify.toml` configurado. Para deployar:

1. Subí el repo a GitHub
2. Conectá el repo en [app.netlify.com](https://app.netlify.com)
3. Configurá las variables de entorno en **Site settings → Environment variables**:
   - `VITE_FOOTBALL_DATA_API_KEY`
   - `VITE_GEMINI_API_KEY`
4. El build se dispara automáticamente

## 📁 Estructura del proyecto

```
mundial-fifa-2026/
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── fixture/        # GroupCard, KnockoutBracket
│   │   ├── home/           # HeroSection, LiveMatchSection
│   │   ├── layout/         # Navbar, Footer, BottomNav
│   │   ├── match/          # GeminiMatchAnalysis
│   │   ├── shared/         # CountdownTimer, SkeletonLoader, SEO, etc.
│   │   ├── stats/          # GeminiTournamentSummary
│   │   ├── teams/          # GeminiPlayerBio, TacticalPitch
│   │   └── venues/         # VenuesStadiums, StadiumDrawer, StadiumMiniMap
│   ├── data/
│   │   └── stadiums.ts     # Data estática de sedes
│   ├── hooks/
│   │   ├── useApiData.ts   # Hook genérico con TanStack Query
│   │   └── useTheme.ts     # Hook de dark/light mode
│   ├── lib/
│   │   ├── api.ts          # Cliente para football-data.org
│   │   ├── gemini.ts       # Cliente para Google Gemini
│   │   └── utils.ts        # Helpers
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── FixtureGroups.tsx
│   │   ├── VenuesStadiums.tsx
│   │   ├── Teams.tsx
│   │   ├── TeamDetail.tsx
│   │   ├── GlobalStats.tsx
│   │   └── WorldMap.tsx
│   ├── types/
│   │   ├── api.ts          # Interfaces de football-data.org
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## ⚠️ Notas

- El plan gratuito de football-data.org tiene límite de **10 requests/minuto**. TanStack Query está configurado con `staleTime: 5min` para minimizar las llamadas.
- Las respuestas de Gemini se cachean en `sessionStorage` por 1 hora para evitar costos innecesarios.
- El archivo `.env` está en `.gitignore` — nunca subas tus claves al repo.

## 📄 Licencia

MIT © 2026 — [sender.ia](https://www.instagram.com/sender.ia) · Leo Aquiba Senderovsky
