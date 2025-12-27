export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar'
}

export enum TimeBlock {
  FAJR = 'After Fajr',
  PRE_DHUHR = 'Before Dhuhr',
  POST_DHUHR = 'After Dhuhr',
  ASR = 'After Asr',
  MAGHRIB = 'After Maghrib',
  ISHA = 'After Isha'
}

export enum Priority {
  URGENT = 'Urgent',
  NORMAL = 'Normal'
}

export enum Category {
  WORK = 'Work',
  LEARNING = 'Learning',
  SPIRITUAL = 'Spiritual',
  HEALTH = 'Health',
  OPEN = 'Open'
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  timeBlock: string; // Stored as string to allow flexibility, mapped to TimeBlock enum
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface LearningItem {
  id: string;
  title: string;
  description?: string;
  dayNumber?: number; // Optional: if part of a sequenced plan
  completed: boolean;
  date?: string; // Assigned date
}

export interface Hadith {
  id: string;
  arabic: string;
  english: string;
  source: string;
}

export interface Dhikr {
  id: string;
  text: string;
  count?: number;
  time?: string;
}

export interface AppData {
  tasks: Task[];
  learningPlan: LearningItem[];
  hadithCollection: Hadith[];
  dhikrCollection: Dhikr[];
  notes: Record<string, string>; // Key: "YYYY-MM-DD_TimeBlock"
  settings: {
    language: Language;
    theme: 'light' | 'dark';
    lastActiveDate: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'dashboard' | 'learning' | 'settings' | 'all-tasks';
