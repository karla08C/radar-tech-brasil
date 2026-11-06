import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>Prazo encerrado</span>
      </span>
    );
  }

  if (timeLeft.isUrgent) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
        <span>
          Encerra em {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </span>
    );
  }

  if (timeLeft.isWarning) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-amber-700" />
        <span>
          {timeLeft.days} {timeLeft.days === 1 ? 'dia' : 'dias'} restantes
          {showHours ? ` (${timeLeft.hours}h)` : ''}
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 ${className}`}>
      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
      <span>
        {timeLeft.days} dias restantes
      </span>
    </span>
  );
}
