import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Activity {
  id: string;
  type: 'UPLOAD' | 'VERIFY' | 'LOGIN' | 'PROFILE_VERIFY' | 'SETTINGS_CHANGE' | 'FOLDER_CREATE';
  description: string;
  timestamp: string;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (type: Activity['type'], description: string) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`eduvault_activity_${user.uid}`);
      if (stored) setActivities(JSON.parse(stored));
    } else {
      setActivities([]);
    }
  }, [user]);

  const addActivity = (type: Activity['type'], description: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description,
      timestamp: new Date().toISOString(),
    };

    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 50); // Keep last 50
      if (user) {
        localStorage.setItem(`eduvault_activity_${user.uid}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) throw new Error('useActivity must be used within an ActivityProvider');
  return context;
}
