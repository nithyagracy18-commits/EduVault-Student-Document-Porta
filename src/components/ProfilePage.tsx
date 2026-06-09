import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  HardDrive, 
  UserPlus, 
  Settings as SettingsIcon, 
  QrCode, 
  History, 
  HelpCircle, 
  Info, 
  Users, 
  LogOut, 
  ChevronRight,
  Loader2,
  X,
  Smartphone,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Languages,
  Lock,
  Unlock,
  Key,
  Upload,
  Folder as FolderIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { useTheme, Theme } from '../context/ThemeContext';
import { useActivity } from '../context/ActivityContext';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';
import { Palette } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, setVerified } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { activities, addActivity } = useActivity();
  const [showModal, setShowModal] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<'input' | 'otp'>('input');
  const [contact, setContact] = useState(user?.phone || user?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const menuSections = [
    { id: 'drive', label: t('drive'), icon: HardDrive, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'account', label: 'My Account', icon: UserIcon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'nominee', label: 'Nominee', icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'settings', label: t('settings'), icon: SettingsIcon, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'qr', label: 'Scan QR', icon: QrCode, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'activity', label: t('activity'), icon: History, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'help', label: t('help'), icon: HelpCircle, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'about', label: t('about'), icon: Info, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'switch', label: 'Switch Account', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'logout', label: t('logout'), icon: LogOut, color: 'text-red-500', bg: 'bg-red-50', danger: true },
  ];

  const handleMenuClick = (item: typeof menuSections[0]) => {
    setActiveMenu(item.id);
    if (item.id === 'logout') {
      logout();
      return;
    }
    if (['account', 'qr', 'activity', 'settings', 'help', 'about'].includes(item.id)) {
      setShowModal(item.id);
      return;
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: contact }),
        credentials: 'include'
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      setSuccess(`OTP Sent! (Demo: ${data.demo_otp})`);
      setVerificationStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: contact, otp }),
        credentials: 'include'
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setVerified(true);
      addActivity('PROFILE_VERIFY', 'Profile verification completed successfully.');
      setSuccess("Profile Verified Successfully!");
      setTimeout(() => {
        setShowModal(null);
        setSuccess(null);
        setVerificationStep('input');
        setOtp('');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-32 font-sans relative overflow-hidden">
      {/* Background Layers */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1 opacity-10" />
        <div className="aurora-blob blob-2 opacity-10" />
      </div>
      <div className="grid-overlay" />

      {/* Profile Header */}
      <div className="relative z-10 glass border-b border-white/5 p-8 pt-16 rounded-b-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 to-transparent" />
        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="w-28 h-28 bg-bg-secondary rounded-[2rem] flex items-center justify-center text-accent-green shadow-inner border border-white/10 group-hover:rotate-6 transition-all duration-500 relative z-10">
              <UserIcon className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
            </div>
            <div className="absolute inset-0 bg-accent-green/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            {user?.isVerified && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 bg-accent-green text-bg-primary p-2 rounded-2xl border-4 border-bg-primary shadow-lg z-20"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-text-primary tracking-tighter">{user?.name || 'Academic Identity'}</h2>
            <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60">
              {user?.phone || user?.email || 'Unauthorized Link'}
            </p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal('account')}
            className={cn(
              "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all border",
              user?.isVerified 
              ? 'bg-accent-green/10 text-accent-green border-accent-green/20' 
              : 'bg-accent-amber/10 text-accent-amber border-accent-amber/20 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            )}
          >
            {user?.isVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {user?.isVerified ? t('verified') : 'Verification Pending — Initialize Protocol'}
          </motion.div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="relative z-10 p-6 max-w-lg mx-auto space-y-6 mt-6">
        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
          {menuSections.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onClick={() => handleMenuClick(item)}
              className={cn(
                "flex items-center justify-between p-6 cursor-pointer border-b border-white/5 last:border-0 group transition-colors",
                activeMenu === item.id ? 'bg-white/5' : ''
              )}
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-inner border border-white/5",
                  item.danger ? "bg-accent-coral/10 text-accent-coral" : "bg-bg-primary text-text-muted group-hover:text-accent-green group-hover:border-accent-green/20 group-hover:shadow-[0_0_15px_rgba(0,212,170,0.15)]"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "font-black text-xs uppercase tracking-[0.1em] transition-colors",
                  item.danger ? 'text-accent-coral' : 'text-text-primary group-hover:text-accent-green'
                )}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className={cn(
                "w-5 h-5 transition-transform group-hover:translate-x-1",
                item.danger ? 'text-accent-coral/30' : 'text-text-muted/30'
              )} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-bg-primary/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-secondary w-full max-w-md rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl maxHeight-[80vh] overflow-y-auto custom-scrollbar"
            >
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between sticky top-0 bg-bg-secondary/90 backdrop-blur-md pb-6 z-10 border-b border-white/5 mb-4">
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">
                    {showModal === 'qr' ? 'Neural Identity' : 
                     showModal === 'activity' ? 'Access Logs' : 
                     showModal === 'settings' ? 'Core Settings' : 
                     showModal === 'help' ? 'Support Portal' : 
                     showModal === 'about' ? 'EduVault Specs' :
                     'Verification Hub'}
                  </h3>
                  <button 
                    onClick={() => { setShowModal(null); setSuccess(null); setError(null); }}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>

                {/* QR Section */}
                {showModal === 'qr' && (
                  <div className="flex flex-col items-center gap-8 py-10">
                    <div className="bg-white p-8 rounded-[2rem] border-8 border-accent-green/20 shadow-[0_0_50px_rgba(0,212,170,0.15)] transition-transform hover:scale-105 duration-500">
                      <QRCodeSVG 
                        value={JSON.stringify({ name: user?.name, phone: user?.phone, email: user?.email, verified: user?.isVerified })} 
                        size={220}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-black text-text-primary text-xl tracking-tight">{user?.name}</p>
                      <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] opacity-60">Verified Credentials Access Key</p>
                    </div>
                  </div>
                )}

                {/* Activity Section */}
                {showModal === 'activity' && (
                  <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                    {activities.length > 0 ? activities.map(act => (
                      <div key={act.id} className="flex gap-5 items-start p-5 glass border border-white/5 rounded-3xl group hover:border-accent-green/20 transition-all">
                        <div className="p-3 bg-bg-primary text-text-muted group-hover:text-accent-green rounded-2xl shadow-inner border border-white/5 transition-colors">
                          {act.type === 'UPLOAD' ? <Upload className="w-5 h-5" /> :
                           act.type === 'VERIFY' ? <ShieldCheck className="w-5 h-5" /> :
                           act.type === 'FOLDER_CREATE' ? <FolderIcon className="w-5 h-5" /> :
                           <History className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-text-primary tracking-tight leading-relaxed">{act.description}</p>
                          <p className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-50">{new Date(act.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 text-text-muted font-black uppercase tracking-[0.3em] opacity-40">No Logged Protocols</div>
                    )}
                  </div>
                )}

                {/* Settings Section */}
                {showModal === 'settings' && (
                  <div className="space-y-12">
                    {/* Theme Picker */}
                    <div className="space-y-6">
                      <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                        <Palette className="w-4 h-4 text-accent-green" /> Visual Identity
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'default', label: 'Strategic Teal', color: '#00D4AA' },
                          { id: 'purple', label: 'Royal Purple', color: '#A78BFA' },
                          { id: 'amber', label: 'Warn Amber', color: '#F59E0B' },
                          { id: 'blue', label: 'Command Blue', color: '#60A5FA' }
                        ].map(tOpt => (
                          <button
                            key={tOpt.id}
                            onClick={() => setTheme(tOpt.id as Theme)}
                            className={cn(
                              "px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border flex items-center gap-3",
                              theme === tOpt.id ? "bg-accent-green text-bg-primary border-accent-green shadow-lg shadow-accent-green/20" : "bg-bg-primary text-text-muted border-white/5 hover:border-accent-green/30"
                            )}
                          >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tOpt.color }} />
                            {tOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-6 border-t border-white/5 pt-10">
                      <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                        <Languages className="w-4 h-4 text-accent-purple" /> Linguistics Selection
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'en', label: 'English' },
                          { id: 'hi', label: 'हिन्दी' },
                          { id: 'es', label: 'Español' },
                          { id: 'fr', label: 'Français' },
                          { id: 'te', label: 'తెలుగు' }
                        ].map(lang => (
                          <button
                            key={lang.id}
                            onClick={() => {
                              setLanguage(lang.id as Language);
                              addActivity('SETTINGS_CHANGE', `Changed language to ${lang.label}`);
                            }}
                            className={cn(
                              "px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border",
                              language === lang.id ? "bg-accent-green text-bg-primary border-accent-green shadow-lg shadow-accent-green/20" : "bg-bg-primary text-text-muted border-white/5 hover:border-accent-green/30"
                            )}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Security */}
                    <div className="space-y-6 border-t border-white/5 pt-10">
                      <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                        <Lock className="w-4 h-4 text-accent-glow" /> Dynamic Locks
                      </label>
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-5 glass border border-white/5 rounded-3xl hover:border-accent-green/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <Smartphone className="w-5 h-5 text-accent-green" />
                            <span className="font-black text-[11px] uppercase tracking-widest text-text-primary">Biometric Sync</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-text-muted/30" />
                        </button>
                        <button className="w-full flex items-center justify-between p-5 glass border border-white/5 rounded-3xl hover:border-accent-green/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <Key className="w-5 h-5 text-accent-glow" />
                            <span className="font-black text-[11px] uppercase tracking-widest text-text-primary">Multi-Key Auth</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-text-muted/30" />
                        </button>
                        <button className="w-full flex items-center justify-between p-5 bg-accent-coral/5 border border-accent-coral/20 rounded-3xl hover:bg-accent-coral/10 transition-all group">
                          <div className="flex items-center gap-4">
                            <Unlock className="w-5 h-5 text-accent-coral" />
                            <span className="font-black text-[11px] uppercase tracking-widest text-accent-coral">Disable Protocol Lock</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Section */}
                {showModal === 'help' && (
                  <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                    {[
                      { q: 'Verification link expired?', a: 'Initialize a new protocol in the account hub. Codes expire after 300 seconds.' },
                      { q: 'Document upload limit?', a: 'Standard tier allows up to 50MB per document. Use Zip compression for large registries.' },
                      { q: 'External sharing policy?', a: 'Generate a temporal QR link in the Vault for single-use external verification.' },
                      { q: 'Cloud sync issues?', a: 'Check local cache or re-auth with Google Link for deep-sync recovery.' }
                    ].map((faq, i) => (
                      <div key={i} className="space-y-3 p-6 glass border border-white/5 rounded-3xl">
                        <p className="font-black text-accent-green text-[11px] uppercase tracking-widest">PROMPT: {faq.q}</p>
                        <p className="text-text-muted text-xs leading-relaxed font-bold border-l-2 border-accent-green/20 pl-4">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* About Section */}
                {showModal === 'about' && (
                  <div className="text-center space-y-10 py-6">
                    <div className="bg-bg-primary w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center text-accent-green border border-white/5 shadow-2xl relative">
                      <div className="absolute inset-0 bg-accent-green/20 blur-xl rounded-full" />
                      <ShieldCheck className="w-12 h-12 relative z-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-3xl font-black text-text-primary tracking-tighter">EduVault v2.0 Premium</h4>
                      <p className="text-[10px] text-accent-green font-black uppercase tracking-[0.3em]">Neural Custody Engine</p>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed font-bold glass p-8 rounded-[2.5rem] border border-white/5">
                      The premier strategic asset for Indian students. Engineered with SHA-256 fingerprinting and session-secured proxying to ensure 100% integrity across academic cycles.
                    </p>
                    <div className="pt-8 border-t border-white/5 text-[9px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40">
                      Constructed for Global Verifiability
                    </div>
                  </div>
                )}

                {/* Verification Hub */}
                {showModal === 'account' && (
                  <div className="space-y-8">
                    {error && (
                      <div className="bg-accent-coral/10 border border-accent-coral/20 p-5 rounded-2xl flex items-center gap-3 text-accent-coral text-[11px] font-black uppercase tracking-widest animate-shake">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="bg-accent-green/10 border border-accent-green/20 p-5 rounded-2xl flex items-center gap-3 text-accent-green text-[11px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        {success}
                      </div>
                    )}
                    
                    {verificationStep === 'input' ? (
                      <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-text-muted text-xs font-bold leading-relaxed px-1 opacity-70">Elevate your academic standing. Complete the verification protocol to unlock global trust markers.</p>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1">Secure Protocol Identifier</label>
                          <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Phone (+91) or Primary Email"
                            className="w-full px-5 py-5 bg-bg-primary/50 border border-white/10 rounded-2xl focus:outline-none focus:border-accent-green/50 focus:ring-4 focus:ring-accent-green/5 transition-all text-text-primary font-bold placeholder:text-text-muted/30"
                            required
                          />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-accent-green text-bg-primary font-black h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] uppercase tracking-widest">
                          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Request Protocol Code'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] text-center block">Transmission Verified - Enter Code</label>
                          <input
                            type="text"
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="••••"
                            className="w-full py-6 bg-bg-primary/50 border border-white/10 rounded-3xl text-center text-5xl font-black tracking-[0.5em] text-accent-green focus:outline-none focus:border-accent-green/50 shadow-inner"
                            required
                            autoFocus
                          />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-accent-glow text-bg-primary font-black h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,209,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] uppercase tracking-widest">
                          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Finalize Auth'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
