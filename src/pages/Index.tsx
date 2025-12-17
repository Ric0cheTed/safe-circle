import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, MapPin, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';
import Logo from '@/components/guardian/Logo';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Phone,
      title: 'One-Tap SOS',
      description: 'Instantly call 999 with a single tap',
    },
    {
      icon: MapPin,
      title: 'Live Location',
      description: 'Share your real-time GPS with trusted contacts',
    },
    {
      icon: Users,
      title: 'Guardian Circle',
      description: 'Alert your trusted network instantly',
    },
  ];

  return (
    <MobileLayout className="justify-between py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 pt-8 animate-fade-in">
        <Logo size="lg" />
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
            Your Personal
            <br />
            <span className="text-primary">Safety Network</span>
          </h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Feel safer when you're out. One tap connects you to emergency services and alerts your trusted contacts.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 py-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="gradient-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-4"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/20 text-primary">
              <feature.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Button
          size="xl"
          onClick={() => navigate('/auth')}
          className="w-full group"
        >
          Get Started
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span>Privacy-first</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;