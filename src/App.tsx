import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import { useTheme } from './hooks/useTheme';

const Home         = React.lazy(() => import('./pages/Home'));
const Fixture      = React.lazy(() => import('./pages/FixtureGroups'));
const Sedes        = React.lazy(() => import('./pages/VenuesStadiums'));
const Selecciones  = React.lazy(() => import('./pages/Teams'));
const TeamDetail   = React.lazy(() => import('./pages/TeamDetail'));
const Stats        = React.lazy(() => import('./pages/GlobalStats'));
const Mapa         = React.lazy(() => import('./pages/WorldMap'));
const NewsPage     = React.lazy(() => import('./pages/News'));

export default function App() {
  const { theme } = useTheme();
  return (
    <BrowserRouter>
      <AppRoutes theme={theme} />
    </BrowserRouter>
  );
}

function AppRoutes({ theme }: { theme: string }) {
  // Hook that refreshes ads on navigation
  // note: placed inside Router context
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { default: useAdRefresh } = ({} as any);
  // import the hook dynamically so TypeScript doesn't try to resolve it before Router exists
  // then call it normally
  // We do a static import instead to keep things simple and type-safe
  return <InnerApp theme={theme} />;
}

function InnerApp({ theme }: { theme: string }) {
  // now we can safely import and use the hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme: t } = useTheme();
  // import hook
  const { useAdRefresh } = require('./hooks/useAdRefresh');
  useAdRefresh();

  return (
    <div className={theme}>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<div className="p-20 text-center font-bold">Cargando Mundial...</div>}>
          <Routes>
            <Route path="/"                        element={<Home />} />
            <Route path="/fixture"                 element={<Fixture />} />
            <Route path="/sedes"                   element={<Sedes />} />
            <Route path="/selecciones"             element={<Selecciones />} />
            <Route path="/selecciones/:teamId"     element={<TeamDetail />} />
            <Route path="/selecciones/:teamSlug"   element={<TeamDetail />} />
            <Route path="/stats"                   element={<Stats />} />
            <Route path="/mapa"                    element={<Mapa />} />
            <Route path="/noticias"                element={<NewsPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
