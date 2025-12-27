import React from 'react';
import { useApp } from '../context';
import { TRANSLATIONS } from '../constants';
import { X, Trophy, BookOpen, CheckCircle2, Quote, Star } from 'lucide-react';
import { Language } from '../types';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ isOpen, onClose }) => {
  const { state, todayStr, getDailyHadith } = useApp();
  const t = TRANSLATIONS[state.settings.language];
  
  if (!isOpen) return null;

  const dailyTasks = state.tasks.filter(t => t.date === todayStr);
  const completedTasks = dailyTasks.filter(t => t.completed);
  const totalTasks = dailyTasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);

  // Learning: Items assigned to today and completed
  const completedLearning = state.learningPlan.filter(l => l.date === todayStr && l.completed);

  const hadith = getDailyHadith();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {/* Header with decorative background */}
            <div className="relative h-32 bg-barakah-600 flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-20 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <div className="text-center z-10 text-white">
                    <h2 className="text-2xl font-bold mb-1">{t.dailySummary}</h2>
                    <p className="text-barakah-100 text-sm font-medium opacity-90">{new Date().toLocaleDateString(state.settings.language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-barakah-50 dark:bg-slate-800 rounded-2xl text-center border border-barakah-100 dark:border-slate-700">
                        <div className="w-10 h-10 mx-auto mb-2 bg-barakah-100 dark:bg-barakah-900/50 text-barakah-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{completedTasks.length}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t.tasksCompleted}</div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-2xl text-center border border-emerald-100 dark:border-slate-700">
                        <div className="w-10 h-10 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-full flex items-center justify-center">
                            <Trophy size={20} />
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{progress}%</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t.focusScore}</div>
                    </div>
                </div>

                {/* Achievements List */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Star size={16} className="text-amber-400" fill="currentColor" /> {t.achievements}
                    </h3>
                    
                    {completedTasks.length === 0 && completedLearning.length === 0 ? (
                        <p className="text-sm text-slate-400 italic text-center py-2">
                           Every day is a new beginning.
                        </p>
                    ) : (
                        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3">
                             {completedTasks.slice(0, 3).map(task => (
                                <div key={task.id} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{task.title}</span>
                                </div>
                            ))}
                            {completedTasks.length > 3 && (
                                <p className="text-xs text-slate-400 pl-4">+ {completedTasks.length - 3} more tasks</p>
                            )}

                             {completedLearning.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">Learned: {item.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Spiritual / Wisdom Recap */}
                <div className="bg-amber-50 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                     <h3 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Quote size={12} /> {t.dailyWisdom}
                    </h3>
                    <p className="font-serif text-slate-800 dark:text-slate-200 text-center italic leading-relaxed text-lg">
                        "{hadith.english}"
                    </p>
                    <p className="font-arabic text-slate-600 dark:text-slate-400 text-center mt-2 text-sm opacity-80" dir="rtl">
                        {hadith.arabic}
                    </p>
                </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button 
                    onClick={onClose}
                    className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg transform transition-transform active:scale-[0.98]"
                >
                    {t.close}
                </button>
            </div>
        </div>
    </div>
  );
};
