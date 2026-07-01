import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Calendar, GitMerge, Zap, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from '../components/shared/SEO';
import { GroupCard } from '../components/fixture/GroupCard';
import { CalendarView } from '../components/fixture/CalendarView';
import { KnockoutBracket } from '../components/fixture/KnockoutBracket';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { STATIC_GROUPS, STATIC_GROUP_MATCHES, STATIC_KNOCKOUT_MATCHES } from '../data/fixtureData';
import type { Match, Standing } from '../types/api';
import { AdBanner } from '../components/shared/AdBanner';

type ViewType = 'groups' | 'calendar' | 'knockout';

export default function FixtureGroups() {
  const [activeView, setActiveView] = useState<ViewType>('groups');
  const { data: standingsData, error: standingsError } = useApiData<{ standings: Standing[] }>(
    ['standings'],
    () => api.getStandings()
  );
  const { data: matchesData, isLoading: matchesLoading, error: matchesError } = useApiData<{ matches: Match[] }>(
    ['wc-matches-all'],
    () => api.getAllMatches()
  );

  const standings = standingsData?.standings ?? [];
  const apiMatches = matchesData?.matches ?? [];
  const hasApiMatches = apiMatches.length > 0;

  const calendarMatches = hasApiMatches
    ? apiMatches.filter((m) => m.stage === 'GROUP_STAGE')
    : (!matchesLoading ? STATIC_GROUP_MATCHES : []);

  const apiKnockoutMatches = apiMatches.filter((m) => m.stage !== 'GROUP_STAGE');
  const knockoutMatches = apiKnockoutMatches.length > 0
    ? apiKnockoutMatches
    : (!matchesLoading ? STATIC_KNOCKOUT_MATCHES : []);

  const matches = hasApiMatches ? apiMatches : [...calendarMatches, ...knockoutMatches];
  const isUsingStaticMatches = !hasApiMatches && !matchesLoading && matches.length > 0;

  const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const groups = groupOrder.map((letter) => {
    const key = `GROUP_${letter}`;
    const groupStanding = standings.find((s) => s.group === key);
    const groupMatches = matches
      .filter((m) => m.group === key)
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate));
    const staticGroup = STATIC_GROUPS.find(sg => sg.key === key);

    return {
      key,
      entries: groupStanding?.table ?? [],
      staticTeams: staticGroup?.teams ?? [],
      matches: groupMatches,
      nextMatch: groupMatches.find(m => m.status === 'SCHEDULED' || m.status === 'TIMED') ?? null,
    };
  });

  const isUsingStaticData = groups.every(g => g.entries.length === 0);

  // Mostrar SIEMPRE la pestaña knockout — si la API no tiene datos, se usa fallback estático
  const views = [
    { id: 'groups',   label: 'Por Grupos',        icon: LayoutGrid },
    { id: 'calendar', label: 'Calendario',         icon: Calendar   },
    { id: 'knockout', label: 'Fase Eliminatoria',  icon: GitMerge, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
      <SEO
        title="Fixture y Grupos"
        description="Fixture completo del Mundial FIFA 2026: grupos A–L con las 48 selecciones, fase de grupos, octavos, cuartos, semifinales y final. Resultados y tabla de posiciones en tiempo real."
        keywords="fixture mundial 2026, grupos mundial 2026, tabla posiciones mundial, resultados mundial 2026, calendario mundial fifa"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://mundial-fifa-2026.netlify.app/" },
              { "@type": "ListItem", "position": 2, "name": "Fixture y Grupos", "item": "https://mundial-fifa-2026.netlify.app/fixture" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cuántos grupos tiene el Mundial 2026?",
                "acceptedAnswer": { "@type": "Answer", "text": "El Mundial FIFA 2026 tiene 12 grupos (del A al L), con 4 equipos cada uno, para un total de 48 selecciones participantes." }
              },
              {
                "@type": "Question",
                "name": "¿Cuándo empieza el Mundial 2026?",
                "acceptedAnswer": { "@type": "Answer", "text": "La Copa Mundial de la FIFA 2026 comienza el 11 de junio de 2026 con el partido inaugural en el Estadio Azteca de Ciudad de México." }
              },
              {
                "@type": "Question",
                "name": "¿Cuándo es la final del Mundial 2026?",
                "acceptedAnswer": { "@type": "Answer", "text": "La final de la Copa Mundial FIFA 2026 se disputará el 19 de julio de 2026 en el MetLife Stadium de Nueva Jersey, Estados Unidos." }
              },
              {
                "@type": "Question",
                "name": "¿Cuántos partidos tiene el Mundial 2026?",
                "acceptedAnswer": { "@type": "Answer", "text": "El Mundial FIFA 2026 tendrá un total de 104 partidos: 48 en fase de grupos, 32 en octavos de final, 16 en cuartos, 8 semifinales, y la final." }
              }
            ]
          }
        ]}
      />
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <span className="label-caps mb-2 block">Copa Mundial de la FIFA™</span>
            <h1 className="display-md text-fifa-blue dark:text-white">Fixture <br />Mundial 2026</h1>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-stadium overflow-x-auto">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as ViewType)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
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



        {(isUsingStaticMatches || standingsError || matchesError) && activeView !== 'groups' && (
          <div className="mb-8 flex items-center gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl text-blue-800 dark:text-blue-300 shadow-sm">
            <motion.div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-2xl">
              <Info className="text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <p className="font-bold uppercase tracking-tight text-xs mb-1">
                {isUsingStaticMatches ? 'Calendario del sorteo oficial' : 'Datos parciales'}
              </p>
              <p className="text-sm opacity-80">
                {isUsingStaticMatches
                  ? 'Mostrando el fixture basado en el sorteo oficial. Se actualizará automáticamente cuando la API publique los partidos.'
                  : 'No pudimos cargar algunos datos desde la API. Mostrando información de respaldo.'}
              </p>
            </div>
          </div>
        )}

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
                {groups.map((group, idx) => {
                  if (idx === Math.floor(groups.length / 2)) {
                    return (
                      <React.Fragment key={group.key}>
                        <div className="col-span-full">
                          <AdBanner slot="2222222222" format="horizontal" className="w-full" />
                        </div>
                        <GroupCard
                          key={group.key + '-card'}
                          groupName={group.key}
                          entries={group.entries}
                          staticTeams={group.staticTeams}
                          matches={group.matches}
                          nextMatch={group.nextMatch}
                          hasStandingsError={Boolean(standingsError)}
                          hasMatchesError={Boolean(matchesError)}
                        />
                      </React.Fragment>
                    );
                  }

                  return (
                    <GroupCard
                      key={group.key}
                      groupName={group.key}
                      entries={group.entries}
                      staticTeams={group.staticTeams}
                      matches={group.matches}
                      nextMatch={group.nextMatch}
                      hasStandingsError={Boolean(standingsError)}
                      hasMatchesError={Boolean(matchesError)}
                    />
                  );
                })}
              </div>
            )}

            {activeView === 'calendar' && (
              <CalendarView
                matches={calendarMatches}
                isLoading={matchesLoading}
                errorMessage={matchesError && calendarMatches.length === 0 ? String(matchesError) : null}
                isStaticData={isUsingStaticMatches}
              />
            )}

            {activeView === 'knockout' && (
              <div className="overflow-x-auto pb-12">
                <KnockoutBracket
                  matches={knockoutMatches}
                  isLoading={matchesLoading}
                  errorMessage={matchesError && knockoutMatches.length === 0 ? String(matchesError) : null}
                  isStaticData={apiKnockoutMatches.length === 0 && !matchesLoading}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
