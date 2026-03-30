import { motion } from 'framer-motion';

export const TopScorers = () => {
  const players = [
    { name: 'K. Mbappé', team: 'Francia', goals: 7 },
    { name: 'L. Martínez', team: 'Argentina', goals: 5 },
    { name: 'Vini Jr.', team: 'Brasil', goals: 4 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {players.map((p, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -10 }}
          className="stadium-card aspect-[4/5] relative group"
        >
          {/* Placeholder para foto de jugador */}
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-12 h-10 bg-fifa-gold flex items-center justify-center font-mono font-bold text-xl rounded">
                  {p.goals}
               </div>
               <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Goles</span>
            </div>
            <h3 className="headline-md text-white text-3xl uppercase leading-none">{p.name}</h3>
            <p className="text-fifa-gold font-bold uppercase text-xs tracking-[0.3em]">{p.team}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};