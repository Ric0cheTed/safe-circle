import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';
import { useSOS } from '@/contexts/SOSContext';

const SafeConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { deactivateSOS } = useSOS();

  useEffect(() => {
    // Deactivate SOS when this page loads
    deactivateSOS();
  }, [deactivateSOS]);

  return (
    <MobileLayout className="justify-center items-center py-8">
      <div className="flex flex-col items-center gap-8 text-center animate-scale-in">
        {/* Success Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-success/20 rounded-full blur-3xl scale-150" />
          <div className="relative h-32 w-32 rounded-full gradient-safe shadow-glow-safe flex items-center justify-center animate-safe-pulse">
            <CheckCircle2 className="h-16 w-16 text-success-foreground" strokeWidth={2} />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold text-foreground">
            You're Safe
          </h1>
          <p className="text-muted-foreground max-w-xs">
            We're glad you're okay. Your emergency contacts have been notified that you're safe.
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="w-full gradient-card rounded-2xl p-5 shadow-card border border-success/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/20">
              <MessageCircle className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Safety Update Sent</p>
              <p className="text-xs text-muted-foreground">
                3 contacts received your safety confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 pt-4">
          <Button
            size="xl"
            onClick={() => navigate('/home')}
            className="w-full"
          >
            <Home className="h-5 w-5 mr-2" />
            Return Home
          </Button>
          
          <p className="text-xs text-muted-foreground pt-2">
            If you need support after this incident, please reach out to someone you trust or contact a support helpline.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SafeConfirmation;