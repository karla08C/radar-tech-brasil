import { useState, useEffect } from 'react';

interface CountdownBadgeProps {
  deadline: string;
  showHours?: boolean;
  className?: string;
}

export function CountdownBadge({ deadline, showHours = true, className = '' }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
    isUrgent: boolean;
    isWarning: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    isExpired: false,
    isUrgent: false,
    isWarning: false,
  });

  useEffect(() => {
    function calculateTime() {
      if (!deadline) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isExpired: true, isUrgent: false, isWarning: false });
        return;
      }

      const target = deadline.includes('T')
        ? new Date(deadline).getTime()
        : new Date(`${deadline}T23:59:59`).getTime();

      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isExpired: true, isUrgent: false, isWarning: false });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const isUrgent = days < 2;
      const isWarning = days < 7;

      setTimeLeft({ days, hours, minutes, isExpired: false, isUrgent, isWarning });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.isExpired) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-stone-100 text-stone-500 border border-stone-200 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
        <span>Encerrado</span>
      </span>
    );
  }

  if (timeLeft.isUrgent) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-amber-50/60 text-amber-800 border border-amber-200/50 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        <span>
          {showHours
            ? `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}${timeLeft.hours}h ${timeLeft.minutes}m`
            : timeLeft.days === 0 ? 'Encerra hoje' : `Restam ${timeLeft.days} dia${timeLeft.days === 1 ? '' : 's'}`}
        </span>
      </span>
    );
  }

  if (timeLeft.isWarning) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-stone-100 text-stone-700 border border-stone-200 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        <span>
          {timeLeft.days} dias restantes
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-stone-100 text-stone-700 border border-stone-200 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      <span>{timeLeft.days} dias restantes</span>
    </span>
  );
}
