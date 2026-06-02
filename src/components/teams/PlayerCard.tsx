/**
 * Componente para mostrar tarjeta de jugador con avatar generado desde iniciales.
 * La API de football-data.org (tier gratuito) no proporciona fotos de jugadores,
 * por lo que utilizamos un avatar basado en número de camiseta o iniciales del nombre.
 */

interface PlayerCardProps {
  player: {
    id: number;
    name: string;
    position: string;
    shirtNumber?: number;
    nationality?: string;
  };
  countryCode?: string;
  className?: string;
}

// Colores por posición del jugador
const POSITION_COLORS: Record<string, string> = {
  Goalkeeper: 'bg-yellow-500',
  Defender: 'bg-blue-600',
  Midfielder: 'bg-green-600',
  Forward: 'bg-red-600',
  Coach: 'bg-purple-600',
};

export const PlayerCard = ({
  player,
  className = '',
}: PlayerCardProps) => {
  const positionColor =
    POSITION_COLORS[player.position] ?? 'bg-gray-600';

  // Mostrar número de camiseta si existe, si no las iniciales del nombre
  const avatarContent =
    player.shirtNumber ?? player.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${className}`}
    >
      {/* Avatar con número de camiseta o iniciales */}
      <div
        className={`w-10 h-10 rounded-full ${positionColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}
        title={`${player.position} - ${player.nationality || ''}`}
      >
        {avatarContent}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{player.name}</p>
        <p className="text-xs text-gray-400">{player.position}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
