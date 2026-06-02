import { useState } from 'react';

interface TeamCrestProps {
  crestUrl?: string;
  teamName: string;
  size?: number;
  className?: string;
}

/**
 * Componente para mostrar el escudo de un equipo con fallback elegante.
 * Si la imagen no carga, muestra un avatar con las iniciales del equipo.
 */
export const TeamCrest = ({
  crestUrl,
  teamName,
  size = 32,
  className = '',
}: TeamCrestProps) => {
  const [error, setError] = useState(false);
  const initials = teamName.slice(0, 3).toUpperCase();

  if (!crestUrl || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-full text-white font-bold text-xs shadow-md ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.35,
        }}
        title={teamName}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={crestUrl}
      alt={teamName}
      width={size}
      height={size}
      className={`object-contain rounded-full shadow-md ${className}`}
      onError={() => setError(true)}
      loading="lazy"
      title={teamName}
    />
  );
};

export default TeamCrest;
