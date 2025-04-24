import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Please check your email to confirm your signup!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Welcome to Swift</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in or create an account</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleEmailSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-swift-600 hover:bg-swift-700"
              disabled={loading}
            >
              Sign In
            </Button>

            <Button
              type="button"
              onClick={handleEmailSignUp}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Sign Up
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="mr-2 h-4 w-4"
              >
                <path d="M22 12.1401C22 6.54012 17.5 2.04012 12 2.04012C6.5 2.04012 2 6.54012 2 12.1401C2 17.0601 5.66 21.0901 10.4375 21.8901V14.8901H7.89844V12.1401H10.4375V9.98762C10.4375 7.48762 11.9156 6.11012 14.2031 6.11012C15.2938 6.11012 16.4375 6.30012 16.4375 6.30012V8.74012H15.1719C13.9219 8.74012 13.5625 9.48762 13.5625 10.2626V12.1401H16.3344L15.9219 14.8901H13.5625V21.8901C18.34 21.0901 22 17.0601 22 12.1401Z" fill="#1877F2"/>
              </svg>
              Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
