import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Calendar, GitMerge, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { GroupCard } from '../components/fixture/GroupCard';
import { CalendarView } from '../components/fixture/CalendarView';
import { KnockoutBracket } from '../components/fixture/KnockoutBracket';

type ViewType = 'groups' | 'calendar' | 'knockout';

<SEO 
  title="Fixture y Grupos" 
  description="Consultá el calendario completo y las tablas de posiciones de los 12 grupos del Mundial FIFA 2026."
  keywords="fixture mundial, grupos mundial 2026, tabla de posiciones fifa, partidos mundial"
/>

export default function FixtureGroups() {
  const [activeView, setActiveView] = useState<ViewType>('groups');

  const views = [
    { id: 'groups', label: 'Por Grupos', icon: LayoutGrid },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'knockout', label: 'Fase Eliminatoria', icon: GitMerge, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <span className="label-caps mb-2 block">Copa Mundial de la FIFA™</span>
            <h1 className="display-md text-fifa-blue dark:text-white">Fixture <br />Mundial 2026</h1>
          </div>

          {/* View Switcher */}
          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-stadium">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as ViewType)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all",
                  activeView === view.id 
                    ? "bg-fifa-blue text-white shadow-lg" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
              >
                <view.icon size={16} />
                {view.label}
                {view.highlight && <Zap size={12} className="text-fifa-gold fill-fifa-gold" />}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'groups' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Iterar sobre Grupos A-L (12 grupos) */}
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(letter => (
                  <GroupCard key={letter} groupName={`Grupo ${letter}`} />
                ))}
              </div>
            )}
            
            {activeView === 'calendar' && <CalendarView />}
            
            {activeView === 'knockout' && (
              <div className="overflow-x-auto pb-12">
                <KnockoutBracket />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}