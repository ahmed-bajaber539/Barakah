import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppData, Language, Task, LearningItem, Hadith, Dhikr, Priority, Category, TimeBlock } from './types';
import { DEFAULT_HADITH } from './constants';

interface AppContextType {
  state: AppData;
  isLoading: boolean;
  currentBlock: TimeBlock;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  
  // Content Management
  addLearningItem: (item: Omit<LearningItem, 'id' | 'completed'>) => void;
  deleteLearningItem: (id: string) => void;
  toggleLearningCompletion: (id: string) => void;
  
  addHadith: (item: Omit<Hadith, 'id'>) => void;
  deleteHadith: (id: string) => void;
  
  addDhikr: (item: Omit<Dhikr, 'id'>) => void;
  deleteDhikr: (id: string) => void;

  updateNote: (block: string, text: string) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  uploadContent: (type: 'learning' | 'hadith' | 'dhikr', content: any[]) => void;
  getDailyHadith: () => Hadith;
  getDailyDhikr: () => Dhikr[];
  todayStr: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'barakah_app_data_v1';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const getCurrentTimeBlock = (): TimeBlock => {
  const hour = new Date().getHours();
  // Simple heuristic for day segments
  if (hour >= 4 && hour < 11) return TimeBlock.FAJR;
  if (hour >= 11 && hour < 13) return TimeBlock.PRE_DHUHR;
  if (hour >= 13 && hour < 16) return TimeBlock.POST_DHUHR;
  if (hour >= 16 && hour < 18) return TimeBlock.ASR;
  if (hour >= 18 && hour < 20) return TimeBlock.MAGHRIB;
  return TimeBlock.ISHA;
};

const INITIAL_STATE: AppData = {
  tasks: [],
  learningPlan: [],
  hadithCollection: [DEFAULT_HADITH],
  dhikrCollection: [],
  notes: {},
  settings: {
    language: Language.ENGLISH,
    theme: 'light',
    lastActiveDate: getTodayStr(),
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppData>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBlock, setCurrentBlock] = useState<TimeBlock>(TimeBlock.FAJR);
  const todayStr = getTodayStr();

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Handle Rollover Logic immediately on load
        const lastActive = parsed.settings.lastActiveDate;
        
        if (lastActive !== todayStr) {
          // Move unfinished tasks to today
          parsed.tasks = parsed.tasks.map((t: Task) => {
             // If task is from past AND not completed, move it to today
             if (t.date < todayStr && !t.completed) {
               return { ...t, date: todayStr };
             }
             return t;
          });
          parsed.settings.lastActiveDate = todayStr;
        }
        
        // Ensure notes object exists for legacy data
        if (!parsed.notes) parsed.notes = {};

        setState({ ...INITIAL_STATE, ...parsed });
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    setIsLoading(false);
    
    // Set initial time block
    setCurrentBlock(getCurrentTimeBlock());

    // Update time block every minute
    const interval = setInterval(() => {
        setCurrentBlock(getCurrentTimeBlock());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoading]);

  // Apply Theme & Language Direction
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Language Direction
    if (state.settings.language === Language.ARABIC) {
      root.dir = 'rtl';
      root.lang = 'ar';
    } else {
      root.dir = 'ltr';
      root.lang = 'en';
    }
  }, [state.settings.theme, state.settings.language]);

  // --- Task Management ---
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const updateTask = (updatedTask: Task) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const toggleTaskCompletion = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  // --- Learning Management ---
  const addLearningItem = (item: Omit<LearningItem, 'id' | 'completed'>) => {
    const newItem: LearningItem = {
      ...item,
      id: crypto.randomUUID(),
      completed: false
    };
    setState(prev => ({ ...prev, learningPlan: [...prev.learningPlan, newItem] }));
  };

  const deleteLearningItem = (id: string) => {
    setState(prev => ({
      ...prev,
      learningPlan: prev.learningPlan.filter(l => l.id !== id)
    }));
  };

  const toggleLearningCompletion = (id: string) => {
    setState(prev => ({
      ...prev,
      learningPlan: prev.learningPlan.map(l => 
        l.id === id ? { ...l, completed: !l.completed } : l
      )
    }));
  };

  // --- Hadith Management ---
  const addHadith = (item: Omit<Hadith, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, hadithCollection: [...prev.hadithCollection, newItem] }));
  };

  const deleteHadith = (id: string) => {
    setState(prev => ({ ...prev, hadithCollection: prev.hadithCollection.filter(h => h.id !== id) }));
  };

  // --- Dhikr Management ---
  const addDhikr = (item: Omit<Dhikr, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, dhikrCollection: [...prev.dhikrCollection, newItem] }));
  };

  const deleteDhikr = (id: string) => {
    setState(prev => ({ ...prev, dhikrCollection: prev.dhikrCollection.filter(d => d.id !== id) }));
  };


  const updateNote = (block: string, text: string) => {
    setState(prev => ({
        ...prev,
        notes: {
            ...prev.notes,
            [`${todayStr}_${block}`]: text
        }
    }));
  };

  const setLanguage = (lang: Language) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, language: lang } }));
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, theme } }));
  };

  const uploadContent = (type: 'learning' | 'hadith' | 'dhikr', content: any[]) => {
    setState(prev => {
      const newState = { ...prev };
      if (type === 'learning') newState.learningPlan = content.map(i => ({...i, id: i.id || crypto.randomUUID(), completed: false}));
      if (type === 'hadith') newState.hadithCollection = content.map(i => ({...i, id: i.id || crypto.randomUUID()}));
      if (type === 'dhikr') newState.dhikrCollection = content.map(i => ({...i, id: i.id || crypto.randomUUID()}));
      return newState;
    });
  };

  // Deterministic daily rotation based on date hash
  const getDailyHadith = () => {
    if (state.hadithCollection.length === 0) return DEFAULT_HADITH;
    const dayIndex = new Date().getDate() % state.hadithCollection.length;
    return state.hadithCollection[dayIndex];
  };

  const getDailyDhikr = () => {
    return state.dhikrCollection;
  };

  return (
    <AppContext.Provider value={{
      state,
      isLoading,
      currentBlock,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      addLearningItem,
      deleteLearningItem,
      toggleLearningCompletion,
      addHadith,
      deleteHadith,
      addDhikr,
      deleteDhikr,
      updateNote,
      setLanguage,
      setTheme,
      uploadContent,
      getDailyHadith,
      getDailyDhikr,
      todayStr
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
