import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export const GroupsSummary = () => {
  const groups = ['A', 'B', 'C', 'D']; // Representación de los primeros 4

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {groups.map((group) => (
        <div key={group} className="stadium-card p-6 bg-white dark:bg-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="headline-md text-lg">GRUPO {group}</h3>
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((pos) => (
              <div key={pos} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-1 h-1 rounded-full ${pos < 3 ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="font-bold uppercase tracking-tight">México</span>
                </div>
                <div className="flex gap-4 font-mono text-xs">
                  <span className="text-slate-400">2 PJ</span>
                  <span className="font-bold text-fifa-blue dark:text-fifa-gold">6 PTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="lg:col-span-4 flex justify-center mt-8">
        <Link to="/fixture" className="px-10 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Ver todos los grupos
        </Link>
      </div>
    </div>
  );
};