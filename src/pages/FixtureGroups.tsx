import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Calendar, GitMerge, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from '../components/shared/SEO';
import { GroupCard } from '../components/fixture/GroupCard';
import { CalendarView } from '../components/fixture/CalendarView';
import { KnockoutBracket } from '../components/fixture/KnockoutBracket';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import type { Match, Standing } from '../types/api';

type ViewType = 'groups' | 'calendar' | 'knockout';

export default function FixtureGroups() {
  const [activeView, setActiveView] = useState<ViewType>('groups');
  const { data: standingsData } = useApiData<{ standings: Standing[] }>(
    ['standings'],
    () => api.getStandings()
  );
  const { data: matchesData, isLoading: matchesLoading } = useApiData<{ matches: Match[] }>(
    ['matches'],
    () => api.getMatches()
  );

  const standings = standingsData?.standings ?? [];
  const matches = matchesData?.matches ?? [];

  const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const groups = groupOrder.map((letter) => {
    const key = `GROUP_${letter}`;
    const groupStanding = standings.find((s) => s.group === key);
    const groupMatches = matches
      .filter((m) => m.group === key && (m.status === 'SCHEDULED' || m.status === 'TIMED'))
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate));
    return {
      key,
      entries: groupStanding?.table ?? [],
      nextMatch: groupMatches[0] ?? null,
    };
  });

  const views = [
    { id: 'groups', label: 'Por Grupos', icon: LayoutGrid },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'knockout', label: 'Fase Eliminatoria', icon: GitMerge, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
      <SEO
        title="Fixture y Grupos"
        description="Consultá el calendario completo y las tablas de posiciones de los 12 grupos del Mundial FIFA 2026."
        keywords="fixture mundial, grupos mundial 2026, tabla de posiciones fifa, partidos mundial"
      />
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <span className="label-caps mb-2 block">Copa Mundial de la FIFA™</span>
            <h1 className="display-md text-fifa-blue dark:text-white">Fixture <br />Mundial 2026</h1>
          </div>

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
                {groups.map((group) => (
                  <GroupCard
                    key={group.key}
                    groupName={group.key}
                    entries={group.entries}
                    nextMatch={group.nextMatch}
                  />
                ))}
              </div>
            )}

            {activeView === 'calendar' && (
              <CalendarView matches={matches} isLoading={matchesLoading} />
            )}

            {activeView === 'knockout' && (
              <div className="overflow-x-auto pb-12">
                <KnockoutBracket matches={matches} isLoading={matchesLoading} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
