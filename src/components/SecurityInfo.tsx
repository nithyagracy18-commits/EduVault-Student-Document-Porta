import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Search, Lock, QrCode, FileCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SecurityInfo() {
  const features = [
    {
      title: 'Persistent Storage',
      description: 'Your documents are permanently stored in the secure EduVault infrastructure, ensuring they remain accessible across page refreshes and sessions until you delete them.',
      icon: ShieldCheck,
      color: 'text-accent-green',
      glow: 'shadow-accent-green/20'
    },
    {
      title: 'QR Dynamic Reveal',
      description: 'Generate secure QR codes for your documents that recruiters can scan to verify authenticity instantly against our decentralized ledger.',
      icon: QrCode,
      color: 'text-accent-purple',
      glow: 'shadow-accent-purple/20'
    },
    {
      title: 'End-to-End Encryption',
      description: 'Your documents are encrypted before they leave your device. Only you (and those you explicitly share with) can view the contents.',
      icon: Lock,
      color: 'text-accent-glow',
      glow: 'shadow-accent-glow/20'
    }
  ];

  return (
    <div className="p-6 md:p-12 space-y-16 max-w-6xl mx-auto pb-40">
      <header className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass border-accent-green/20 text-accent-green rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ShieldCheck className="w-4 h-4 shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
          Quantum Security Tier
        </motion.div>
        <h2 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter leading-[0.9]">How EduVault <span className="text-accent-green drop-shadow-[0_0_15px_rgba(0,212,170,0.3)]">Protects You.</span></h2>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-medium">
          We use industry-standard cryptographic techniques to ensure your academic achievements are permanent, portable, and impossible to forge.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6 hover:border-accent-green/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-bg-primary shadow-inner border border-white/5 transition-transform group-hover:scale-110", f.color)}>
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight leading-tight">{f.title}</h3>
            <p className="text-text-muted text-sm font-medium leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>

      <section className="glass-card p-10 md:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h3 className="text-4xl font-black tracking-tighter">The Verification <span className="text-accent-purple">Protocol.</span></h3>
            <div className="space-y-6">
              {[
                { step: '01', text: 'Document is uploaded to the persistent vault.' },
                { step: '02', text: 'Metadata is indexed for instant retrieval.' },
                { step: '03', text: 'Access your files securely from any device.' },
                { step: '04', text: 'Files remain safe until manually removed by you.' }
              ].map((item, idx) => (
                <motion.div 
                  key={item.step} 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-6 group/step"
                >
                  <span className="text-accent-purple font-mono font-black text-2xl group-hover/step:translate-x-1 transition-transform">{item.step}</span>
                  <div className="h-px flex-1 bg-white/5 group-hover/step:bg-accent-purple/20 transition-colors" />
                  <p className="text-text-primary font-bold text-sm tracking-tight">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] border border-accent-amber/10 space-y-8 relative group/alert">
            <div className="absolute inset-0 bg-accent-amber/5 opacity-0 group-hover/alert:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 text-accent-amber">
              <div className="p-3 bg-accent-amber/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 shadow-[0_0_10px_#F59E0B]" />
              </div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px]">Quantum Integrity Alert</span>
            </div>
            <p className="text-text-muted text-sm font-medium italic leading-relaxed">
              "Credential falsification costs students thousands of job opportunities. EduVault's SHA-256 fingerprinting makes your digital profile 100% immune to modification."
            </p>
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-bg-primary flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                  <FileCheck className="w-7 h-7 text-accent-green" />
                </div>
                <div>
                  <p className="text-text-primary font-black tracking-tighter">Verified Protocol</p>
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">EduVault Security v2.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-purple/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-green/5 blur-[120px] rounded-full" />
      </section>
    </div>
  );
}
