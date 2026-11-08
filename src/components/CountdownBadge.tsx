import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownBadgeProps {
  deadline: string; // ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  showHours?: boolean;
  className?: string;
}

export function CountdownBadge({ deadline, showHours = true, className = '' }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
    isUrgent: boolean; // < 48 hours
    isWarning: boolean; // < 7 days
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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-900/80 text-slate-400 border border-white/5 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-600"></span>
        <span>Prazo encerrado</span>
      </span>
    );
  }

  if (timeLeft.isUrgent) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)] ${className}`}>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
        </span>
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {showHours ? `${timeLeft.hours}h ${timeLeft.minutes}m restantes` : `${timeLeft.days} dias`}
        </span>
      </span>
    );
  }

  if (timeLeft.isWarning) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        <span>
          {timeLeft.days} dias restantes
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
      <span>{timeLeft.days} dias restantes</span>
    </span>
  );
}
