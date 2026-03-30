import { useState, useEffect } from 'react';
import { getGeminiContent } from '../../lib/gemini';
import { Sparkles, RefreshCw } from 'lucide-react';

export const GeminiTournamentSummary = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummary = () => {
    setLoading(true);
    const prompt = "Dá un resumen dinámico y breve (1 párrafo) de la Copa Mundial 2026 hasta el momento, mencionando qué selección es la sorpresa y quién decepciona. Sé narrativo y vibrante en español.";
    
    // Forzamos actualización diaria usando la fecha como key de caché
    const today = new Date().toISOString().split('T')[0];
    getGeminiContent(prompt, `tourney-summary-${today}`)
      .then(setSummary)
      .finally(() => setLoading(false));
  };

  useEffect(fetchSummary, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-fifa-blue p-6 rounded-2xl border border-white/10 shadow-stadium relative overflow-hidden group">
      <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white opacity-5 rotate-12" />
      
      <div className="flex justify-between items-center mb-4">
        <h4 className="label-caps text-fifa-gold">IA Global Summary</h4>
        <button onClick={fetchSummary} className="text-white/40 hover:text-white transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
        ) : (
          <p className="text-xs text-white/90 leading-relaxed font-medium italic">
            "{summary}"
          </p>
        )}
      </div>
    </div>
  );
};