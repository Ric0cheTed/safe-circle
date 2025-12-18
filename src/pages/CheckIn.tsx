import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Play, Square, Check, AlertTriangle, Loader2 } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Timer {
  id: string;
  duration_minutes: number;
  started_at: string;
  expires_at: string;
  status: string;
}

const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "240", label: "4 hours" },
  { value: "480", label: "8 hours" },
];

const CheckIn = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTimer, setActiveTimer] = useState<Timer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [contactsCount, setContactsCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch active timer and contacts count
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [timerResult, contactsResult] = await Promise.all([
        supabase
          .from("checkin_timers")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("trusted_contacts")
          .select("id", { count: "exact" })
      ]);

      if (timerResult.error) {
        console.error("Error fetching timer:", timerResult.error);
      } else if (timerResult.data) {
        setActiveTimer(timerResult.data);
      }

      if (contactsResult.error) {
        console.error("Error fetching contacts:", contactsResult.error);
      } else {
        setContactsCount(contactsResult.count || 0);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  // Update time remaining every second
  useEffect(() => {
    if (!activeTimer) {
      setTimeRemaining(0);
      return;
    }

    const updateTimeRemaining = () => {
      const expiresAt = new Date(activeTimer.expires_at).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);

      // Auto-expire if time is up
      if (remaining === 0 && activeTimer.status === "active") {
        handleExpired();
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleExpired = useCallback(async () => {
    if (!activeTimer) return;

    await supabase
      .from("checkin_timers")
      .update({ status: "expired" })
      .eq("id", activeTimer.id);

    setActiveTimer(null);
    toast.error("Timer expired! Your trusted contacts would be alerted.");
  }, [activeTimer]);

  const startTimer = async () => {
    if (!user) {
      toast.error("Please log in to start a timer");
      return;
    }

    if (contactsCount === 0) {
      toast.error("Please add trusted contacts first");
      navigate("/trusted-contacts");
      return;
    }

    setIsSaving(true);

    const durationMinutes = parseInt(selectedDuration);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const { data, error } = await supabase
      .from("checkin_timers")
      .insert({
        user_id: user.id,
        duration_minutes: durationMinutes,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to start timer");
      console.error(error);
    } else {
      setActiveTimer(data);
      toast.success(`Timer started for ${selectedDuration} minutes`);
    }

    setIsSaving(false);
  };

  const checkIn = async () => {
    if (!activeTimer) return;

    setIsSaving(true);

    const { error } = await supabase
      .from("checkin_timers")
      .update({ status: "checked_in" })
      .eq("id", activeTimer.id);

    if (error) {
      toast.error("Failed to check in");
      console.error(error);
    } else {
      setActiveTimer(null);
      toast.success("Checked in safely!");
    }

    setIsSaving(false);
  };

  const cancelTimer = async () => {
    if (!activeTimer) return;

    setIsSaving(true);

    const { error } = await supabase
      .from("checkin_timers")
      .update({ status: "cancelled" })
      .eq("id", activeTimer.id);

    if (error) {
      toast.error("Failed to cancel timer");
      console.error(error);
    } else {
      setActiveTimer(null);
      toast.success("Timer cancelled");
    }

    setIsSaving(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerPercentage = () => {
    if (!activeTimer) return 0;
    const totalSeconds = activeTimer.duration_minutes * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-display font-semibold text-foreground">
              Check-In Timer
            </h1>
            <p className="text-sm text-muted-foreground">
              Set a safety check-in timer
            </p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          {activeTimer ? (
            <>
              {/* Active Timer */}
              <div className="relative w-56 h-56 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="12"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke={timeRemaining < 300 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 100}`}
                    strokeDashoffset={`${2 * Math.PI * 100 * (getTimerPercentage() / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${timeRemaining < 300 ? "text-destructive" : "text-foreground"}`}>
                    {formatTime(timeRemaining)}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">remaining</span>
                </div>
              </div>

              {timeRemaining < 300 && timeRemaining > 0 && (
                <div className="flex items-center gap-2 text-destructive mb-4 animate-pulse">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Time running low!</span>
                </div>
              )}

              <div className="space-y-3 w-full max-w-xs">
                <Button
                  onClick={checkIn}
                  className="w-full"
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      I'm Safe - Check In
                    </>
                  )}
                </Button>
                <Button
                  onClick={cancelTimer}
                  variant="outline"
                  className="w-full"
                  disabled={isSaving}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Cancel Timer
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Set New Timer */}
              <div className="w-40 h-40 rounded-full bg-secondary flex items-center justify-center mb-8">
                <Clock className="h-16 w-16 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-medium text-foreground mb-2">
                Start a Check-In Timer
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs">
                If you don't check in before the timer expires, your {contactsCount} trusted contact{contactsCount !== 1 ? "s" : ""} will be alerted.
              </p>

              <div className="w-full max-w-xs space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Timer Duration</Label>
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={startTimer}
                  className="w-full"
                  size="lg"
                  disabled={isSaving || contactsCount === 0}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Timer
                    </>
                  )}
                </Button>

                {contactsCount === 0 && (
                  <p className="text-sm text-destructive text-center">
                    Add trusted contacts before starting a timer
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="bg-secondary/50 rounded-xl p-4 mt-4">
          <h3 className="font-medium text-foreground mb-2">How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Set a timer when going somewhere</li>
            <li>• Check in when you're safe</li>
            <li>• If you don't check in, contacts are alerted</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CheckIn;