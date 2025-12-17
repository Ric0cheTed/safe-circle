import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  onActivate: () => void;
  className?: string;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onActivate, className }) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-52 w-52 rounded-full bg-accent/10 animate-pulse-ring" />
        <div className="absolute h-52 w-52 rounded-full bg-accent/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <div className="absolute h-52 w-52 rounded-full bg-accent/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Glow effect */}
      <div className="absolute h-44 w-44 rounded-full bg-accent/20 blur-2xl" />
      
      {/* Main button */}
      <Button
        variant="sos"
        size="sosLarge"
        onClick={onActivate}
        className="relative z-10 animate-pulse-sos"
        aria-label="Emergency SOS - Call 999"
      >
        <div className="flex flex-col items-center gap-2">
          <Phone className="h-12 w-12" />
          <span className="text-3xl font-bold">SOS</span>
        </div>
      </Button>
    </div>
  );
};

export default SOSButton;