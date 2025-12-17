export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  url?: string;
  thumbnail: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  coordinates: { x: number; y: number };
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export enum SystemStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}