import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';
import Logo from '@/components/guardian/Logo';
import SOSButton from '@/components/guardian/SOSButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSOS } from '@/contexts/SOSContext';
import { supabase } from '@/integrations/supabase/client';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { activateSOS } = useSOS();
  const [contactCount, setContactCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch contact count
  useEffect(() => {
    const fetchContactCount = async () => {
      if (!user) return;
      const { count } = await supabase
        .from('trusted_contacts')
        .select('*', { count: 'exact', head: true });
      setContactCount(count || 0);
    };
    fetchContactCount();
  }, [user]);

  const handleSOSActivate = () => {
    activateSOS();
    navigate('/active-sos');
  };

  const quickActions = [
    { icon: Users, label: 'Contacts', description: 'Manage trusted contacts', path: '/contacts' },
    { icon: Bell, label: 'Alerts', description: 'Check-in reminders', path: null },
    { icon: Shield, label: 'Safety Tips', description: 'Stay informed', path: null },
  ];

  return (
    <MobileLayout
      showHeader
      headerContent={
        <>
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </>
      }
      className="justify-between py-4"
    >
      {/* Welcome section */}
      <div className="text-center animate-fade-in">
        <p className="text-muted-foreground">
          Hello, <span className="text-foreground font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}</span>
        </p>
        <h1 className="text-2xl font-display font-bold text-foreground mt-1">
          You're Protected
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Tap the SOS button in an emergency to call 999 and alert your trusted contacts
        </p>
      </div>

      {/* SOS Button */}
      <div className="flex-1 flex items-center justify-center py-8">
        <SOSButton onActivate={handleSOSActivate} />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => action.path && navigate(action.path)}
              className="gradient-card rounded-2xl p-4 shadow-card border border-border/50 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-secondary text-primary group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Status */}
      <div className="gradient-card rounded-2xl p-4 shadow-card border border-success/30 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/20">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Guardian Circle Active</p>
            <p className="text-xs text-muted-foreground">{contactCount} trusted contact{contactCount !== 1 ? 's' : ''} ready to receive alerts</p>
          </div>
          <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home;