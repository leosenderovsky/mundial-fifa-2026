import { motion } from 'framer-motion';

export const ResultsStrip = () => {
  const mockResults = [
    { home: 'USA', away: 'CAN', score: '3 - 0', group: 'A' },
    { home: 'BRA', away: 'ESP', score: '2 - 2', group: 'B' },
    { home: 'ARG', away: 'JPN', score: '4 - 1', group: 'C' },
    { home: 'FRA', away: 'MAR', score: '2 - 0', group: 'D' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
      {mockResults.map((res, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="stadium-card min-w-[280px] p-4 flex justify-between items-center snap-center border border-slate-100 dark:border-slate-800"
        >
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Grupo {res.group}</span>
            <div className="flex items-center gap-3">
               <div className="w-6 h-4 bg-slate-200 rounded-sm" /> 
               <span className="font-bold text-sm uppercase">{res.home}</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-6 h-4 bg-slate-200 rounded-sm" /> 
               <span className="font-bold text-sm uppercase">{res.away}</span>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-bold text-fifa-red uppercase block mb-1">Finalizado</span>
             <span className="stat-lg text-2xl tracking-normal">{res.score}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};