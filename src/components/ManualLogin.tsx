import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Mail, ChevronRight, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ManualLogin() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer logic for resend
  React.useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // 1. Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
        credentials: 'include'
      });
      const data = await resp.json();
      
      if (!resp.ok) throw new Error(data.error);

      setSuccess(`Security Code Dispatched! For demo: ${data.demo_otp}`);
      setStep('otp');
      setResendTimer(60);
      console.log(`[DEMO] OTP for ${phoneNumber} is: ${data.demo_otp}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter the 4-digit OTP.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp }),
        credentials: 'include'
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error);

      setSuccess("Login Successful!");
      // Add the name captured in the first step to the user object
      const finalUser = { 
        ...data.user, 
        name,
        firebaseCustomToken: data.firebaseCustomToken 
      };
      setTimeout(async () => {
        await login(finalUser);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Layers */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
      </div>
      <div className="grid-overlay" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-[2.5rem] p-10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-bg-primary rounded-3xl shadow-inner border border-white/5 mb-2 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="w-10 h-10 text-accent-green drop-shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-text-primary tracking-tighter leading-none">EduVault <span className="text-accent-green drop-shadow-[0_0_15px_rgba(0,212,170,0.3)]">Portal</span></h1>
              <p className="text-text-muted font-bold text-[10px] uppercase tracking-[0.3em] opacity-60">Strategic Document Custody</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-accent-coral/10 border border-accent-coral/20 p-4 rounded-2xl flex items-center gap-3 text-accent-coral text-[11px] font-black uppercase tracking-wider"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-accent-green/10 border border-accent-green/20 p-4 rounded-2xl flex items-center gap-3 text-accent-green text-[11px] font-black uppercase tracking-wider"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1">Identity Identifier</label>
                  <input
                    type="text"
                    placeholder="Enter Full Legal Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-5 bg-bg-primary/50 border border-white/10 rounded-2xl focus:outline-none focus:border-accent-green/50 focus:ring-4 focus:ring-accent-green/5 transition-all text-text-primary font-bold placeholder:text-text-muted/30"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1">Secure Contact Link</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/5 pr-4 h-8">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-text-primary font-black">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-32 pr-5 py-5 bg-bg-primary/50 border border-white/10 rounded-2xl focus:outline-none focus:border-accent-green/50 focus:ring-4 focus:ring-accent-green/5 transition-all text-text-primary font-black text-lg tracking-[0.2em] placeholder:text-text-muted/30"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10 || !name.trim()}
                  className="w-full bg-accent-green text-bg-primary font-black h-16 rounded-[1.5rem] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,212,170,0.3)] disabled:opacity-50 group text-xs uppercase tracking-[0.3em]"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      Initialize OTP
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Code transmitted to</p>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                      <span className="text-text-primary font-black">+91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}</span>
                      <button 
                        type="button"
                        onClick={() => { setStep('phone'); setOtp(''); }}
                        className="text-[9px] font-black text-accent-green uppercase tracking-widest hover:text-accent-glow transition-colors ml-2"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-6 bg-bg-primary/50 border border-white/10 rounded-3xl focus:outline-none focus:border-accent-green/50 transition-all text-center text-5xl font-black tracking-[0.5em] text-accent-glow placeholder:text-text-muted/10 shadow-inner"
                      required
                      autoFocus
                    />
                    <div className="text-center">
                      {resendTimer > 0 ? (
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                          Resend in <span className="text-accent-green">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-[10px] font-black text-accent-green uppercase tracking-[0.3em] hover:text-accent-glow transition-colors animate-pulse"
                        >
                          Resend Security Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="w-full bg-accent-glow text-bg-primary font-black h-16 rounded-[1.5rem] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(0,255,209,0.4)] disabled:opacity-50 text-xs uppercase tracking-[0.3em]"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Authorize Access'}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[8px] text-text-muted/40 font-black uppercase tracking-[0.2em] leading-relaxed">
            By accessing the vault, you accept the<br/>
            <span className="text-text-muted">Command Protocols</span> and <span className="text-text-muted">Privacy Directives</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
