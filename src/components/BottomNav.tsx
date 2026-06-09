import React from 'react';
import { LayoutDashboard, FolderOpen, MessageSquare, ShieldCheck, User, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'vault', label: 'Vault', icon: FolderOpen },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'chat', label: 'Ask AI', icon: MessageSquare },
    { id: 'security', label: 'Care', icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
      <nav className="glass border border-accent-green/10 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[64px]",
                isActive ? "text-accent-glow" : "text-text-muted hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-accent-green/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(0,212,170,0.5)]" : "opacity-70"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.1em] transition-all",
                isActive ? "opacity-100" : "opacity-50"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-accent-green rounded-full shadow-[0_0_10px_#00D4AA]"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
