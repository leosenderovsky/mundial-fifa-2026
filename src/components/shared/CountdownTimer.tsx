import { useState, useEffect } from 'react';
import { intervalToDuration, isAfter, type Duration } from 'date-fns';
import { cn } from '../../lib/utils';

const TARGET_DATE = new Date(Date.UTC(2026, 5, 11, 20, 0, 0));

const FlipBlock = ({ value, label }: { value: number; label: string }) => {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-32 lg:w-32 lg:h-40 [perspective:1000px]">
        <div className={cn(
          "relative w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-transform duration-500",
          isFlipping && "[transform:rotateX(180deg)]"
        )}>
          <span className="stat-lg text-white text-6xl lg:text-8xl">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="label-caps text-white/80">{label}</span>
    </div>
  );
};

export const CountdownTimer = () => {
  const [duration, setDuration] = useState<Duration | null>(null);
  const isFinished = isAfter(new Date(), TARGET_DATE);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      const now = new Date();
      setDuration(intervalToDuration({ start: now, end: TARGET_DATE }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  if (isFinished || !duration) return null;

  const totalMonths = (duration.years ?? 0) * 12 + (duration.months ?? 0);

  if (totalMonths >= 1) {
    const monthsLabel = totalMonths === 1 ? 'mes' : 'meses';
    const daysValue = duration.days ?? 0;
    const daysLabel = daysValue === 1 ? 'día' : 'días';
    return (
      <div className="py-12 text-center">
        <p className="text-white text-4xl lg:text-5xl font-bold tracking-tight">
          {totalMonths} {monthsLabel} {daysValue} {daysLabel}
        </p>
        <p className="label-caps text-white/70 mt-3">Hasta el inicio</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 lg:gap-12 py-12">
      <FlipBlock value={duration.days ?? 0} label="Días" />
      <span className="text-white text-4xl hidden lg:block self-center mb-10">:</span>
      <FlipBlock value={duration.hours ?? 0} label="Horas" />
      <span className="text-white text-4xl hidden lg:block self-center mb-10">:</span>
      <FlipBlock value={duration.minutes ?? 0} label="Minutos" />
      <span className="text-white text-4xl hidden lg:block self-center mb-10">:</span>
      <FlipBlock value={duration.seconds ?? 0} label="Segundos" />
    </div>
  );
};
