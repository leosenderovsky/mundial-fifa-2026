import { useEffect, useState } from 'react';
import { getGeminiContent } from '../../lib/gemini';
import { TypewriterText } from '../shared/TypewriterText';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  matchId: number;
  stats: any;
}

export const GeminiMatchAnalysis = ({ matchId, stats }: Props) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prompt = `Analizá este partido de fútbol del Mundial 2026 y describí los momentos clave, el rendimiento de ambos equipos y el jugador más influyente. 3 párrafos, tono profesional pero emocionante en español. Stats: ${JSON.stringify(stats)}`;
    
    getGeminiContent(prompt, `analysis-${matchId}`)
      .then(setAnalysis)
      .finally(() => setLoading(false));
  }, [matchId, stats]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-fifa-gold">
        <Sparkles size={20} className="animate-pulse" />
        <h4 className="label-caps">Análisis Táctico Generado por IA</h4>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-12 gap-4">
          <Loader2 className="animate-spin text-fifa-blue" size={32} />
          <p className="text-xs font-bold uppercase text-slate-400">Gemini está analizando la jugada...</p>
        </div>
      ) : (
        <TypewriterText text={analysis} />
      )}
    </div>
  );
};