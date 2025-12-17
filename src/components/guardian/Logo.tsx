import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
        <div className={cn(
          "relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80",
          sizeClasses[size]
        )}>
          <Shield className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-display font-bold text-foreground leading-tight", textSizeClasses[size])}>
            Guardian
          </span>
          <span className={cn("font-display font-semibold text-primary leading-tight", textSizeClasses[size])}>
            Circle
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;