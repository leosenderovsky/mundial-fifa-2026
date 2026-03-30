import { cn } from "../../lib/utils";

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  unit?: string;
}

export const StatBar = ({ label, homeValue, awayValue, unit = "" }: StatBarProps) => {
  const total = homeValue + awayValue;
  const homePct = total === 0 ? 50 : (homeValue / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>{homeValue}{unit}</span>
        <span className="text-slate-900 dark:text-white">{label}</span>
        <span>{awayValue}{unit}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-fifa-blue transition-all duration-1000" 
          style={{ width: `${homePct}%` }} 
        />
        <div 
          className="h-full bg-slate-300 dark:bg-slate-600 transition-all duration-1000" 
          style={{ width: `${100 - homePct}%` }} 
        />
      </div>
    </div>
  );
};