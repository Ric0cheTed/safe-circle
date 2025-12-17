import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Users, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';
import StatusCard from '@/components/guardian/StatusCard';
import { useSOS } from '@/contexts/SOSContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ActiveSOS: React.FC = () => {
  const navigate = useNavigate();
  const { isSOSActive, sosStartTime, currentLocation, deactivateSOS, updateLocation } = useSOS();
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (!isSOSActive) {
      navigate('/home');
      return;
    }

    // Update elapsed time
    const interval = setInterval(() => {
      if (sosStartTime) {
        const diff = Date.now() - sosStartTime.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    // Update location every 30 seconds
    const locationInterval = setInterval(updateLocation, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(locationInterval);
    };
  }, [isSOSActive, sosStartTime, navigate, updateLocation]);

  const handleMarkSafe = () => {
    navigate('/safe-confirmation');
  };

  const handleCancel = () => {
    deactivateSOS();
    navigate('/home');
  };

  const formatLocation = () => {
    if (!currentLocation) return 'Acquiring location...';
    return `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;
  };

  return (
    <MobileLayout className="justify-between py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-50" />
            <div className="relative h-4 w-4 bg-accent rounded-full" />
          </div>
          <span className="text-accent font-semibold uppercase tracking-wider">Emergency Active</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowCancelDialog(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Status */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-40 w-40 rounded-full bg-accent/10 animate-location-ping" />
          <div className="absolute h-40 w-40 rounded-full bg-accent/10 animate-location-ping" style={{ animationDelay: '0.5s' }} />
          <div className="h-32 w-32 rounded-full gradient-sos shadow-glow-sos flex items-center justify-center">
            <Phone className="h-14 w-14 text-accent-foreground" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Help is Coming
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Your location is being shared with your emergency contacts
          </p>
        </div>

        {/* Status Cards */}
        <div className="w-full grid gap-3">
          <StatusCard
            icon="location"
            label="Your Location"
            value={formatLocation()}
            status="active"
          />
          <StatusCard
            icon="contacts"
            label="Contacts Notified"
            value="3 people alerted"
            status="success"
          />
          <StatusCard
            icon="time"
            label="Time Elapsed"
            value={elapsedTime}
            status="active"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="safe"
          size="xl"
          onClick={handleMarkSafe}
          className="w-full"
        >
          I'm Safe Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location.href = 'tel:999'}
          className="w-full"
        >
          <Phone className="h-5 w-5 mr-2" />
          Call 999 Again
        </Button>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Cancel Emergency?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to cancel this emergency alert? Your contacts will be notified that you cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">
              Keep Active
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Alert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default ActiveSOS;