export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  hash?: string;
  status: 'verified' | 'pending' | 'flagged';
  category: 'education' | 'job' | 'internship' | 'identity' | 'other';
  description?: string;
  keywords?: string[];
  location: 'drive' | 'vault';
  folderId?: string;
  fileData?: string; // Base64 data if available
}

export interface Folder {
  id: string;
  name: string;
  location: 'drive' | 'vault';
  createdAt: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GoalRequirement {
  name: string;
  type: 'essential' | 'supporting';
  category: 'education' | 'job' | 'internship' | 'identity' | 'other';
  matchPattern?: string; // Regex pattern to match document names
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  requirements: GoalRequirement[];
  icon: string; // Lucide icon name
}

export interface UserGoal {
  goalId: string;
  progress: number;
  completedDocs: string[]; // List of goal requirement names completed
}
