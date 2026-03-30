import { useParams } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';

export default function TeamDetail() {
  const { teamId } = useParams();
  const { data: team, isLoading } = useApiData(['team', teamId!], () => api.getTeamById(Number(teamId)));

  if (isLoading) return <SkeletonLoader variant="player" />;

  // Se renderiza la misma estructura hero que en Teams pero mapeando team.crest, team.name, etc.
  return (
    <div className="min-h-screen bg-slate-950">
       {/* Hero dinámico... */}
    </div>
  );
}