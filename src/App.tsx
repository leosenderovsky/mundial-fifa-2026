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

export default function App() {
  const { theme } = useTheme();
  return (
    <BrowserRouter>
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
              <Route path="/stats"                   element={<Stats />} />
              <Route path="/mapa"                    element={<Mapa />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
