import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, LogOut, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileLayout from '@/components/layout/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  
  // Notification preferences (stored locally for now)
  const [notifications, setNotifications] = useState({
    sosAlerts: true,
    checkInReminders: true,
    safetyTips: false,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Preferences updated');
  };

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <MobileLayout
      showHeader
      headerContent={
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold text-foreground">Settings</h1>
          <div className="w-10" />
        </>
      }
      className="py-4"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </h2>
          <div className="gradient-card rounded-2xl p-4 shadow-card border border-border/50 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  disabled
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-secondary/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </h2>
          <div className="gradient-card rounded-2xl shadow-card border border-border/50 divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">SOS Alerts</p>
                <p className="text-xs text-muted-foreground">Receive alerts when SOS is activated</p>
              </div>
              <Switch
                checked={notifications.sosAlerts}
                onCheckedChange={() => handleNotificationChange('sosAlerts')}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Check-in Reminders</p>
                <p className="text-xs text-muted-foreground">Get reminded to check in periodically</p>
              </div>
              <Switch
                checked={notifications.checkInReminders}
                onCheckedChange={() => handleNotificationChange('checkInReminders')}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Safety Tips</p>
                <p className="text-xs text-muted-foreground">Receive helpful safety information</p>
              </div>
              <Switch
                checked={notifications.safetyTips}
                onCheckedChange={() => handleNotificationChange('safetyTips')}
              />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </h2>
          <div className="gradient-card rounded-2xl p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Account Protected</p>
                <p className="text-xs text-muted-foreground">Your data is encrypted and secure</p>
              </div>
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Guardian Circle v1.0.0
        </p>
      </div>
    </MobileLayout>
  );
};

export default Settings;
