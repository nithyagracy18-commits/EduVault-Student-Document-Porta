/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Vault from './components/Vault';
import Chat from './components/Chat';
import SecurityInfo from './components/SecurityInfo';
import ProfilePage from './components/ProfilePage';
import GoalPlanner from './components/GoalPlanner';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { DocumentProvider } from './context/DocumentContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ActivityProvider } from './context/ActivityContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthWrapper from './components/AuthWrapper';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'vault':
        return <Vault />;
      case 'chat':
        return <Chat />;
      case 'security':
        return <SecurityInfo />;
      case 'goals':
        return <GoalPlanner />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <ActivityProvider>
            <AuthWrapper>
              <DocumentProvider>
                <ErrorBoundary>
                  <div 
                    className="relative min-h-screen bg-bg-primary overflow-hidden font-sans selection:bg-accent-green/20"
                    onMouseMove={handleMouseMove}
                  >
                    {/* Background Layers */}
                    <div className="aurora-bg">
                      <div className="aurora-blob blob-1" />
                      <div className="aurora-blob blob-2" />
                      <div className="aurora-blob blob-3" />
                    </div>
                    <div className="grid-overlay" />
                    
                    {/* Mouse Glow */}
                    <div 
                      className="fixed pointer-events-none w-[600px] h-[600px] rounded-full blur-[120px] bg-accent-green/5 z-0 transition-opacity duration-500"
                      style={{ 
                        left: mousePos.x - 300, 
                        top: mousePos.y - 300,
                      }}
                    />

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col h-screen">
                      <main className="flex-1 overflow-y-auto relative pb-32">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full"
                          >
                            {renderContent()}
                          </motion.div>
                        </AnimatePresence>

                        {/* Floating AI Bubble (only visible when not in chat tab) */}
                        {activeTab !== 'chat' && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('chat')}
                            className="fixed bottom-32 right-8 bg-accent-green text-bg-primary p-4 rounded-2xl shadow-[0_0_30px_rgba(0,212,170,0.3)] z-50 flex items-center gap-2 group border border-accent-glow/20"
                          >
                            <div className="relative">
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-glow border-2 border-bg-primary rounded-full animate-pulse" />
                              <MessageSquare className="w-6 h-6" />
                            </div>
                            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                              Ask EduVault AI
                            </span>
                          </motion.button>
                        )}
                      </main>

                      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                  </div>
                </ErrorBoundary>
              </DocumentProvider>
            </AuthWrapper>
          </ActivityProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

