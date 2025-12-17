import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileLayout from '@/components/layout/MobileLayout';
import Logo from '@/components/guardian/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let result;
    if (isLogin) {
      result = await login(email, password);
      if (!result.error) {
        toast({
          title: "Welcome back",
          description: "You're now signed in to Guardian Circle",
        });
        navigate('/home');
      }
    } else {
      result = await register(email, password, name);
      if (!result.error) {
        toast({
          title: "Account created",
          description: "Welcome to Guardian Circle",
        });
        navigate('/home');
      }
    }

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MobileLayout className="justify-between py-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 pt-8 animate-fade-in">
        <Logo size="lg" />
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin 
              ? 'Sign in to access your safety network' 
              : 'Join your personal safety circle'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isLogin && (
          <button type="button" className="text-sm text-primary hover:text-primary/80 text-right transition-colors">
            Forgot password?
          </button>
        )}

        <Button
          type="submit"
          size="xl"
          disabled={isLoading}
          className="mt-4 group"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <p className="text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 ml-2 font-medium transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </MobileLayout>
  );
};

export default Auth;