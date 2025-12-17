import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  showHeader = false,
  headerContent,
}) => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {showHeader && (
        <header className="safe-area-top px-6 py-4 flex items-center justify-between">
          {headerContent}
        </header>
      )}
      <main className={cn("flex-1 flex flex-col px-6 pb-safe", className)}>
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;