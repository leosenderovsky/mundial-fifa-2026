import { getCountryCode } from '@/lib/utils';

interface FlagIconProps {
  isoAlpha3?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

/**
 * Componente reutilizable para mostrar banderas de países.
 * Convierte códigos ISO 3166-1 alpha-3 al formato alpha-2 requerido por flag-icons.
 */
export const FlagIcon = ({
  isoAlpha3,
  size = 'md',
  className = '',
  title,
}: FlagIconProps) => {
  if (!isoAlpha3) return null;

  const code = getCountryCode(isoAlpha3);
  const sizes = { sm: 'w-5 h-4', md: 'w-8 h-6', lg: 'w-12 h-8' };

  return (
    <span
      className={`fi fi-${code} rounded shadow-sm ${sizes[size]} inline-block ${className}`}
      title={title || isoAlpha3}
      aria-label={title || isoAlpha3}
    />
  );
};

export default FlagIcon;
