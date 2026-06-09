import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Shield, 
  LogOut, 
  FolderOpen, 
  MessageSquare,
  User as UserIcon 
} from 'lucide-react';
import { GOALS } from '../constants/goals';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export default function Dashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { documents, loading: docsLoading } = useDocuments();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const isRequirementMet = (category: string, matchPattern?: string) => {
    return documents.some(doc => {
      const nameMatch = matchPattern 
        ? new RegExp(matchPattern, 'i').test(doc.name)
        : true;
      return doc.category === category && nameMatch;
    });
  };

  const getProgress = (requirements: any[]) => {
    const metCount = requirements.filter(r => isRequirementMet(r.category, r.matchPattern)).length;
    return Math.round((metCount / requirements.length) * 100);
  };
  
  const stats = [
    { label: 'Total Files', value: docsLoading ? '...' : documents.length, icon: FileText, color: 'text-accent-green', glow: 'shadow-accent-green/20' },
    { label: 'Verified', value: docsLoading ? '...' : documents.filter(d => d.status === 'verified').length, icon: CheckCircle2, color: 'text-emerald-400', glow: 'shadow-emerald-400/20' },
    { label: 'Authentic', value: '100%', icon: Shield, color: 'text-accent-purple', glow: 'shadow-accent-purple/20' },
  ];

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto min-h-full">
      {/* Hero Section */}
      <header className="relative py-12 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
            <motion.span 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="block"
            >
              Your Documents,
            </motion.span>
            <motion.span 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="block text-accent-green drop-shadow-[0_0_15px_rgba(0,212,170,0.3)]"
            >
              Understood.
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="block text-2xl md:text-3xl text-text-muted font-medium mt-4 tracking-normal"
            >
              Not Just Stored.
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-muted max-w-lg mx-auto font-medium"
          >
            The futuristic decentralized vault for your academic records. 
            Powered by Gemini AI for smart insights.
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button 
            onClick={() => onNavigate?.('vault')}
            className="px-8 py-4 bg-accent-green text-bg-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,212,170,0.4)] flex items-center gap-2"
          >
            <FolderOpen className="w-5 h-5" />
            Launch Vault
          </button>
          <button 
            onClick={() => onNavigate?.('chat')}
            className="px-8 py-4 glass border-accent-green/20 text-text-primary font-black rounded-2xl hover:bg-accent-green/10 active:scale-95 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5 text-accent-green" />
            Ask Gemini AI
          </button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + (i * 0.1) }}
            className="glass-card p-6 rounded-[2rem] hover:border-accent-green/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl bg-bg-primary border border-white/5 shadow-inner transition-transform group-hover:scale-110", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</p>
                <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Active Goals Section */}
        <section className="lg:col-span-4 glass-card p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 blur-3xl -z-10 group-hover:bg-accent-green/10 transition-colors" />
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent-green rounded-full" />
              Strategic Goals
            </h3>
            <button 
              onClick={() => onNavigate?.('goals')}
              className="text-[10px] font-black uppercase tracking-widest px-4 py-2 glass rounded-full hover:bg-accent-green/10 transition-colors"
            >
              Analyze Readiness
            </button>
          </div>
          
          <div className="space-y-8">
            {GOALS.slice(0, 2).map((goal) => {
              const progress = getProgress(goal.requirements);
              const missingCount = goal.requirements.filter(r => !isRequirementMet(r.category, r.matchPattern)).length;
              
              return (
                <div key={goal.id} className="space-y-4 cursor-pointer group/goal" onClick={() => onNavigate?.('goals')}>
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-lg group-hover/goal:text-accent-green transition-colors">{goal.title}</h4>
                      <p className="text-xs text-text-muted font-medium">{goal.description.split('.')[0]}</p>
                    </div>
                    <span className="text-2xl font-black text-accent-glow drop-shadow-[0_0_8px_rgba(0,255,209,0.3)]">{progress}%</span>
                  </div>
                  <div className="h-4 bg-bg-primary rounded-full border border-white/5 p-1 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-accent-green to-accent-glow rounded-full relative"
                    >
                      <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm -skew-x-12 animate-[pulse_2s_infinite]" />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                      {missingCount === 0 ? (
                        <span className="text-accent-green flex items-center gap-1.5 px-3 py-1 glass rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Ready to Deploy
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 glass rounded-full">
                          <AlertCircle className="w-3 h-3" /> {missingCount} Blockers
                        </span>
                      )}
                    </p>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security & System Info */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <section className="flex-1 bg-accent-purple text-white p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-8 h-8 opacity-50" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quantum Security</span>
              </div>
              <h3 className="text-3xl font-black leading-none">Security & Privacy.</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                Your vault utilizes military-grade encryption. 
                Documents are processed by EduVault AI for instant understanding.
              </p>
            </div>
            {/* Animated orbital effect */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute -right-10 -bottom-10 w-60 h-60 border border-white/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
          </section>

          {/* Logout Button */}
          <button 
            onClick={() => logout()}
            className="w-full glass-card p-4 rounded-3xl group flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.3em] text-accent-coral hover:bg-accent-coral/10 hover:border-accent-coral/30 transition-all"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Terminate Session
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass border-accent-purple/20 p-8 rounded-[2rem] flex items-center gap-6 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="shrink-0 w-16 h-16 bg-accent-purple/20 rounded-2xl flex items-center justify-center text-accent-purple shadow-inner">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-black text-accent-purple uppercase tracking-widest text-xs mb-1">System Status</h4>
          <p className="text-text-primary text-sm font-medium">
            Your document vault is synchronized and ready. You can access all your uploaded artifacts directly from the Vault section.
          </p>
        </div>
        <div className="ml-auto hidden md:block">
          <button 
            onClick={() => onNavigate?.('vault')}
            className="px-6 py-2 glass rounded-full border-accent-purple/20 text-[10px] font-black uppercase tracking-widest hover:bg-accent-purple/20 transition-all"
          >
            Manage Vault
          </button>
        </div>
      </motion.section>
    </div>
  );
}
