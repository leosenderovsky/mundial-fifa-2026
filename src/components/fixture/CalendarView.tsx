import { Calendar } from 'lucide-react';

export const CalendarView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Calendar className="text-slate-400" size={36} />
      </div>
      <div>
        <h3 className="font-headline font-bold text-xl uppercase tracking-tight mb-2">
          Calendario en construcción
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          El calendario completo de partidos estará disponible próximamente.
        </p>
      </div>
    </div>
  );
};
