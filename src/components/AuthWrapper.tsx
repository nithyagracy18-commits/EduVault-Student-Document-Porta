import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './ManualLogin';
import { Loader2, Shield } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-bg-primary relative overflow-hidden">
        <div className="aurora-bg">
          <div className="aurora-blob blob-1 opacity-10" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-accent-green animate-spin opacity-20" />
            <Shield className="w-8 h-8 text-accent-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_15px_rgba(0,212,170,0.5)]" />
          </div>
          <p className="mt-8 text-text-muted font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
            Establishing Secure Link...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}
