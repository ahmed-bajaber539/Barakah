import React from 'react';
import { useApp } from '../context';
import { ViewState, Language } from '../types';
import { LayoutDashboard, BookOpen, Settings, ListTodo } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  const { state } = useApp();
  const t = TRANSLATIONS[state.settings.language];

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`flex flex-col items-center justify-center w-full py-3 space-y-1 transition-colors duration-200
        ${currentView === view 
          ? 'text-barakah-600 dark:text-barakah-400' 
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex-none px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between z-10 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
          {t.appName}
        </h1>
        <div className="w-8 h-8 rounded-full bg-barakah-100 dark:bg-barakah-900 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-barakah-500"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar pb-24">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile First approach) */}
      <nav className="flex-none fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pb-safe z-20">
        <div className="max-w-3xl mx-auto flex justify-around">
          <NavItem view="dashboard" icon={LayoutDashboard} label={t.dashboard} />
          <NavItem view="all-tasks" icon={ListTodo} label={t.allTasks} />
          <NavItem view="learning" icon={BookOpen} label={t.learning} />
          <NavItem view="settings" icon={Settings} label={t.settings} />
        </div>
      </nav>
    </div>
  );
};
