import { WifiOff, RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  lastUpdated?: Date;
}

export const ErrorState = ({ message, onRetry, lastUpdated }: ErrorStateProps) => (
  <div className="stadium-card p-12 flex flex-col items-center text-center border-2 border-fifa-red/10">
    <WifiOff className="text-fifa-red mb-6" size={48} />
    <h3 className="headline-md mb-2">Hubo un problema</h3>
    <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
    
    <button 
      onClick={onRetry}
      className="flex items-center gap-2 bg-fifa-blue hover:bg-blue-800 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95"
    >
      <RefreshCcw size={18} />
      Reintentar
    </button>

    {lastUpdated && (
      <p className="mt-6 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
        Actualizado hace {formatDistanceToNow(lastUpdated, { locale: es })}
      </p>
    )}
  </div>
);