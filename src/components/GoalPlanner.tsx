import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Briefcase, 
  Wallet, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ArrowLeft,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { GOALS } from '../constants/goals';
import { Goal, GoalRequirement } from '../types';
import { cn } from '../lib/utils';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Briefcase,
  Wallet
};

export default function GoalPlanner() {
  const { documents } = useDocuments();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const isRequirementMet = (req: GoalRequirement) => {
    return documents.some(doc => {
      const nameMatch = req.matchPattern 
        ? new RegExp(req.matchPattern, 'i').test(doc.name)
        : true;
      return doc.category === req.category && nameMatch;
    });
  };

  const getProgress = (goal: Goal) => {
    const metCount = goal.requirements.filter(isRequirementMet).length;
    return Math.round((metCount / goal.requirements.length) * 100);
  };

  if (selectedGoal) {
    const progress = getProgress(selectedGoal);
    const essential = selectedGoal.requirements.filter(r => r.type === 'essential');
    const supporting = selectedGoal.requirements.filter(r => r.type === 'supporting');

    return (
      <div className="min-h-full flex flex-col p-6 md:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 space-y-8">
          <button 
            onClick={() => setSelectedGoal(null)}
            className="flex items-center gap-2 text-text-muted hover:text-accent-green transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-[10px] uppercase tracking-[0.3em]">Back to Hub</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-accent-green/10 rounded-3xl flex items-center justify-center text-accent-green shadow-inner border border-accent-green/20">
                {React.createElement(iconMap[selectedGoal.icon] || GraduationCap, { className: "w-10 h-10" })}
              </div>
              <div>
                <h2 className="text-4xl font-black text-text-primary tracking-tighter">{selectedGoal.title}</h2>
                <p className="text-text-muted font-medium max-w-md">{selectedGoal.description}</p>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Readiness Level</span>
                <span className="text-3xl font-black text-accent-glow drop-shadow-[0_0_10px_rgba(0,255,209,0.3)]">{progress}%</span>
              </div>
              <div className="h-4 bg-bg-secondary rounded-full border border-white/5 p-1 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-accent-green to-accent-glow rounded-full relative"
                >
                  <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm -skew-x-12 animate-[pulse_2s_infinite]" />
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-32">
          {/* Essential Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1.5 h-6 bg-accent-green rounded-full shadow-[0_0_10px_#00D4AA]" />
              <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Mandatory Artifacts</h3>
            </div>
            <div className="grid gap-4">
              {essential.map((req, idx) => (
                <RequirementCard key={idx} req={req} met={isRequirementMet(req)} />
              ))}
            </div>
          </section>

          <div className="space-y-12">
            {/* Supporting Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1 text-text-muted">
                <Plus className="w-5 h-5 opacity-50" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Supplementary Evidence</h3>
              </div>
              <div className="grid gap-4">
                {supporting.map((req, idx) => (
                  <RequirementCard key={idx} req={req} met={isRequirementMet(req)} />
                ))}
              </div>
            </section>

            {/* AI Strategic Tip */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-[2.5rem] border border-accent-purple/20 text-text-primary shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex gap-6">
                <div className="w-16 h-16 bg-accent-purple/20 rounded-[1.5rem] flex items-center justify-center text-accent-purple shrink-0 shadow-inner">
                   <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-accent-purple mb-1">AI Strategic Intelligence</h4>
                  <p className="text-sm font-medium leading-relaxed">
                    Based on thousands of successful {selectedGoal.title} applications, 
                    Gemini AI recommends verifying your "Aadhaar Card" first as it anchors 
                    90% of your academic identity.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto min-h-full">
      <header className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_10px_#00D4AA]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Tactical Planning Interface</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter leading-none">Strategic <span className="text-accent-green drop-shadow-[0_0_15px_rgba(0,212,170,0.3)]">Blueprint.</span></h1>
        <p className="text-text-muted font-medium text-lg leading-relaxed">Engineered to map your academic milestones with document precision.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {GOALS.map((goal, i) => {
            const progress = getProgress(goal);
            const Icon = iconMap[goal.icon] || GraduationCap;

            return (
              <motion.button
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGoal(goal)}
                className="group glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-accent-green/30 transition-all flex flex-col items-start gap-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 bg-bg-primary rounded-2xl flex items-center justify-center text-text-muted group-hover:bg-accent-green/10 group-hover:text-accent-green transition-all shadow-inner border border-white/5">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-4 w-full text-left">
                  <h3 className="text-2xl font-black text-text-primary tracking-tight leading-tight group-hover:text-accent-green transition-colors">{goal.title}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Readiness</span>
                      <span className="text-[11px] font-black text-accent-glow">{progress}%</span>
                    </div>
                    <div className="h-2 bg-bg-primary rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-accent-green transition-all duration-1000"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                  <ChevronRight className="w-6 h-6 text-accent-green" />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Custom Goal Placeholder */}
        <button className="p-8 glass-card rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-text-muted hover:bg-white/5 transition-all group min-h-[300px]">
          <div className="w-16 h-16 rounded-[1.5rem] border-2 border-dashed border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 opacity-20" />
          </div>
          <span className="font-black text-[10px] tracking-[0.3em] uppercase opacity-50">Custom Directive</span>
        </button>
      </div>
    </div>
  );
}

function RequirementCard({ req, met }: { req: GoalRequirement, met: boolean }) {
  return (
    <div className={cn(
      "p-5 rounded-3xl border transition-all flex items-center gap-5 relative overflow-hidden group",
      met 
        ? "bg-accent-green/10 border-accent-green/30" 
        : "glass-card border-white/5 hover:border-white/10"
    )}>
      {met && <div className="absolute top-0 right-0 w-24 h-24 bg-accent-green/10 blur-3xl -z-10" />}
      <div className={cn(
        "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
        met ? "bg-accent-green text-bg-primary shadow-accent-green/20" : "bg-bg-primary text-text-muted border border-white/5"
      )}>
        {met ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6 opacity-30" />}
      </div>
      <div className="flex-1">
        <h4 className={cn("font-bold text-base tracking-tight", met ? "text-accent-glow" : "text-text-primary")}>{req.name}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded",
            req.type === 'essential' 
              ? "bg-accent-purple/20 text-accent-purple" 
              : "bg-white/5 text-text-muted"
          )}>
            {req.type}
          </span>
          <span className="text-[9px] font-black text-text-muted/50 uppercase tracking-widest">{req.category}</span>
        </div>
      </div>
      {!met && (
        <button className="p-3 glass rounded-xl text-accent-green hover:bg-accent-green/20 transition-all border border-accent-green/10">
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
