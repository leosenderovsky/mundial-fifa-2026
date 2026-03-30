import { useState, useEffect } from 'react';
import { getGeminiContent } from '../../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

export const GeminiPlayerBio = ({ playerName, isOpen }: { playerName: string, isOpen: boolean }) => {
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (isOpen) {
      const prompt = `En 2 oraciones, describí a ${playerName} como jugador de fútbol para un sitio del Mundial 2026, destacando sus fortalezas. Sé conciso y objetivo en español.`;
      getGeminiContent(prompt, `bio-${playerName}`).then(setBio);
    }
  }, [isOpen, playerName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute z-50 bottom-full mb-4 w-64 bg-slate-900 border border-white/20 p-4 rounded-xl shadow-2xl"
        >
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-white/20 rotate-45" />
          <p className="text-[11px] leading-relaxed text-white font-medium italic">
            {bio || "Generando perfil..."}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};