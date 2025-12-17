import React from 'react';
import { MapPin, Clock, Users, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  icon: 'location' | 'time' | 'contacts' | 'signal';
  label: string;
  value: string;
  status?: 'active' | 'pending' | 'success';
  className?: string;
}

const iconMap = {
  location: MapPin,
  time: Clock,
  contacts: Users,
  signal: Signal,
};

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  label,
  value,
  status = 'active',
  className,
}) => {
  const Icon = iconMap[icon];
  
  const statusColors = {
    active: 'text-accent',
    pending: 'text-warning',
    success: 'text-success',
  };

  return (
    <div className={cn(
      "gradient-card rounded-2xl p-4 shadow-card border border-border/50",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center h-10 w-10 rounded-xl bg-secondary",
          statusColors[status]
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-foreground font-medium truncate">{value}</p>
        </div>
        {status === 'active' && (
          <div className="relative flex items-center justify-center h-3 w-3">
            <div className="absolute h-3 w-3 rounded-full bg-accent animate-ping opacity-75" />
            <div className="h-2 w-2 rounded-full bg-accent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;