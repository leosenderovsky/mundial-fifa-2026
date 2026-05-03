import { useState, useEffect } from 'react';
import { intervalToDuration, isAfter, differenceInDays, type Duration } from 'date-fns';
import { cn } from '../../lib/utils';

const TARGET_DATE = new Date(Date.UTC(2026, 5, 11, 20, 0, 0));

interface FlipBlockProps {
  value: number;
  label: string;
  variant?: 'hero' | 'site';
}

const FlipBlock = ({ value, label, variant = 'hero' }: FlipBlockProps) => {
  const [prev, setPrev] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrev(value);
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [value, prev]);

  const isHero = variant === 'hero';

  return (
    <div className="flex flex-col items-center gap-2 lg:gap-4">
      <div className={cn(
        "relative w-20 h-24 lg:w-32 lg:h-40 [perspective:1000px]",
        variant === 'site' && "w-16 h-20 lg:w-24 lg:h-32"
      )}>
        <div className={cn(
          "relative w-full h-full flex items-center justify-center transition-transform duration-500 rounded-xl border",
          isHero 
            ? "bg-white/10 backdrop-blur-md border-white/20" 
            : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-stadium",
          isFlipping && "[transform:rotateX(180deg)]"
        )}>
          <span className={cn(
            "stat-lg text-4xl lg:text-8xl",
            isHero ? "text-white" : "text-fifa-blue dark:text-fifa-gold lg:text-6xl"
          )}>
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className={cn(
        "label-caps text-xs lg:text-sm",
        isHero ? "text-white/80" : "text-slate-400 dark:text-slate-500"
      )}>
        {label}
      </span>
    </div>
  );
};

interface CountdownTimerProps {
  variant?: 'hero' | 'site';
}

export const CountdownTimer = ({ variant = 'hero' }: CountdownTimerProps) => {
  const [duration, setDuration] = useState<Duration | null>(null);
  const now = new Date();
  const isFinished = isAfter(now, TARGET_DATE);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setDuration(intervalToDuration({ start: new Date(), end: TARGET_DATE }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  if (isFinished || !duration) return null;

  const totalMonths = (duration.years ?? 0) * 12 + (duration.months ?? 0);
  const separator = (
    <span className={cn(
      "text-4xl hidden lg:block self-center mb-10",
      variant === 'hero' ? "text-white" : "text-slate-200 dark:text-slate-700"
    )}>:</span>
  );

  if (totalMonths >= 1) {
    return (
      <div className={cn(
        "flex flex-wrap justify-center gap-4 lg:gap-12 py-8 lg:min-h-[220px]",
        variant === 'site' && "py-4 lg:min-h-[180px]"
      )}>
        <FlipBlock value={totalMonths} label="Meses" variant={variant} />
        {separator}
        <FlipBlock value={duration.days ?? 0} label="Días" variant={variant} />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-wrap justify-center gap-4 lg:gap-12 py-8",
      variant === 'site' && "py-4"
    )}>
      <FlipBlock value={duration.days ?? 0} label="Días" variant={variant} />
      {separator}
      <FlipBlock value={duration.hours ?? 0} label="Horas" variant={variant} />
      {separator}
      <FlipBlock value={duration.minutes ?? 0} label="Minutos" variant={variant} />
      {separator}
      <FlipBlock value={duration.seconds ?? 0} label="Segundos" variant={variant} />
    </div>
  );
};

export const getDaysToTournament = () => {
  return differenceInDays(TARGET_DATE, new Date());
};

