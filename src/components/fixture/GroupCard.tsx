import { cn } from '../../lib/utils';

export const GroupCard = ({ groupName }: { groupName: string }) => {
  return (
    <div className="stadium-card flex flex-col h-full border border-transparent hover:border-fifa-blue/20 transition-all">
      <div className="bg-gradient-to-r from-fifa-blue to-blue-900 p-5 flex justify-between items-center">
        <h3 className="font-headline font-bold text-white uppercase tracking-tight">{groupName}</h3>
        <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-1 rounded">ESTADIO AZTECA</span>
      </div>

      <div className="p-5 flex-1">
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <th className="text-left pb-2">POS</th>
              <th className="text-left pb-2">SELECCIÓN</th>
              <th className="text-center pb-2">PJ</th>
              <th className="text-center pb-2">PTS</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {[1, 2, 3, 4].map((pos) => (
              <tr key={pos} className="border-b border-slate-50 dark:border-slate-800/50 group">
                <td className="py-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                    pos <= 2 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {pos}
                  </span>
                </td>
                <td className="py-3 flex items-center gap-3">
                  <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                  <span className="font-bold uppercase tracking-tight text-xs">México</span>
                </td>
                <td className="py-3 text-center font-mono text-xs">3</td>
                <td className="py-3 text-center font-mono font-bold text-fifa-blue dark:text-fifa-gold">9</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Próximo Partido</p>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 group cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="font-bold text-xs">MEX</span>
            <div className="flex flex-col items-center">
              <span className="font-mono font-bold text-xs">18:00</span>
              <span className="text-[8px] text-slate-400">11 JUN</span>
            </div>
            <span className="font-bold text-xs">USA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
