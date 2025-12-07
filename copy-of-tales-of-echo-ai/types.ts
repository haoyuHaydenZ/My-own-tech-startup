export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  projectId?: string; // For grouping
  messages: Message[];
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  isExpanded: boolean;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  APP = 'APP'
}