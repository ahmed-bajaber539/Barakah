import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { TIME_BLOCKS, TRANSLATIONS, CATEGORY_COLORS } from '../constants';
import { Task, TimeBlock, Priority, Category } from '../types';
import { Plus, Check, Sun, Moon, Sunrise, Sunset, ChevronLeft, ChevronRight, Layers, Layout, Edit3 } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { DailySummaryModal } from './DailySummaryModal';
import { Timer } from './Timer';
import { AiAssistant } from './AiAssistant';

// Helper to get time icon
const getTimeIcon = (block: TimeBlock) => {
    switch (block) {
        case TimeBlock.FAJR: return Sunrise;
        case TimeBlock.ISHA: return Moon;
        case TimeBlock.MAGHRIB: return Sunset;
        default: return Sun;
    }
}

const CATEGORY_ICONS: Record<Category, string> = {
    [Category.WORK]: '💼',
    [Category.LEARNING]: '📚',
    [Category.SPIRITUAL]: '📿',
    [Category.HEALTH]: '💪',
    [Category.OPEN]: '✨'
};

export const Dashboard: React.FC = () => {
  const { state, toggleTaskCompletion, todayStr, getDailyHadith, currentBlock, updateNote } = useApp();
  const t = TRANSLATIONS[state.settings.language];
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Dashboard View State
  const [viewMode, setViewMode] = useState<'segment' | 'full'>('segment');
  const [displayedBlock, setDisplayedBlock] = useState<TimeBlock>(currentBlock);
  const [noteText, setNoteText] = useState('');

  // Sync displayed block with current block on mount or reset
  useEffect(() => {
    setDisplayedBlock(currentBlock);
  }, [currentBlock]);

  // Load note for current block
  useEffect(() => {
    const noteKey = `${todayStr}_${displayedBlock}`;
    setNoteText(state.notes[noteKey] || '');
  }, [displayedBlock, todayStr, state.notes]);

  const dailyTasks = state.tasks.filter(t => t.date === todayStr);
  const hadith = getDailyHadith();
  
  // Progress Calculation
  const totalTasks = dailyTasks.length;
  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);
    updateNote(displayedBlock, text);
  };

  const navigateBlock = (direction: 'next' | 'prev') => {
    const currentIndex = TIME_BLOCKS.indexOf(displayedBlock);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // Cycle through
    if (newIndex >= TIME_BLOCKS.length) newIndex = 0;
    if (newIndex < 0) newIndex = TIME_BLOCKS.length - 1;
    
    setDisplayedBlock(TIME_BLOCKS[newIndex]);
  };

  // Render Logic for "Segment View"
  const renderSegmentView = () => {
    const blockTasks = dailyTasks.filter(t => t.timeBlock === displayedBlock);
    const BlockIcon = getTimeIcon(displayedBlock);
    const isCurrent = displayedBlock === currentBlock;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header / Nav for Segment */}
            <div className="flex items-center justify-between">
                 <button onClick={() => navigateBlock('prev')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} className="text-slate-400" />
                 </button>
                 <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <BlockIcon size={18} className={isCurrent ? "text-barakah-500" : "text-slate-400"} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? "text-barakah-500" : "text-slate-400"}`}>
                            {isCurrent ? 'Now Active' : 'Time Block'}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-all">
                        {t.timeBlocks[displayedBlock as keyof typeof t.timeBlocks]}
                    </h2>
                 </div>
                 <button onClick={() => navigateBlock('next')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronRight size={24} className="text-slate-400" />
                 </button>
            </div>

            {/* Timer for Productivity */}
            {isCurrent && <Timer />}

            {/* Task List for Segment */}
            <div className="space-y-3 min-h-[200px]">
                {blockTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center bg-gray-50/50 dark:bg-slate-900/50">
                        <span className="text-2xl mb-2 opacity-30">🌿</span>
                        <span className="text-sm text-slate-400 max-w-[200px]">{t.emptyState}</span>
                    </div>
                ) : (
                    blockTasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => handleEditTask(task)}
                            className={`relative flex items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all hover:shadow-md cursor-pointer group
                                ${task.completed 
                                    ? 'opacity-60 border-gray-100 dark:border-slate-800' 
                                    : 'border-l-4 border-l-barakah-500 border-t-gray-100 border-r-gray-100 border-b-gray-100 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800 shadow-sm'
                                }
                            `}
                        >
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTaskCompletion(task.id);
                                }}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mr-4 flex-shrink-0
                                    ${task.completed 
                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                        : 'border-slate-300 dark:border-slate-600 hover:border-barakah-500'
                                    }
                                `}
                            >
                                {task.completed && <Check size={14} strokeWidth={3} />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <h4 className={`text-base font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                    {task.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_COLORS[task.category]}`}>
                                        {CATEGORY_ICONS[task.category]} {task.category}
                                    </span>
                                    {task.priority === Priority.URGENT && !task.completed && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                            {t.urgent}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {/* Quick Add Button specific to this block */}
                 <button
                    onClick={() => {
                        setSelectedTask({ timeBlock: displayedBlock } as any);
                        setModalOpen(true);
                    }}
                    className="w-full py-3 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-slate-400 hover:text-barakah-500 hover:border-barakah-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus size={16} /> {t.addTask} to {t.timeBlocks[displayedBlock as keyof typeof t.timeBlocks]}
                </button>
            </div>

            {/* Quick Notes Area */}
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-500">
                    <Edit3 size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Focus Notes</span>
                </div>
                <textarea
                    value={noteText}
                    onChange={handleNoteChange}
                    placeholder="Reflections or quick notes for this time..."
                    className="w-full bg-transparent border-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:ring-0 p-0 resize-none leading-relaxed"
                    rows={3}
                />
            </div>
        </div>
    );
  };

  // Render Full Day List
  const renderFullView = () => (
     <div className="space-y-6 animate-fade-in">
        {TIME_BLOCKS.map((block) => {
            const blockTasks = dailyTasks.filter(t => t.timeBlock === block);
            const BlockIcon = getTimeIcon(block as TimeBlock);
            const isCurrent = block === currentBlock;
            
            return (
                <div key={block} className={`group ${isCurrent ? 'bg-barakah-50 dark:bg-slate-800/50 -mx-4 p-4 rounded-3xl' : ''}`}>
                    <div className="flex items-center gap-3 mb-3 pl-2">
                        <BlockIcon size={18} className={isCurrent ? "text-barakah-500" : "text-slate-400"} />
                        <h3 className={`font-bold ${isCurrent ? "text-barakah-700 dark:text-barakah-300" : "text-slate-700 dark:text-slate-300"}`}>
                           {t.timeBlocks[block as keyof typeof t.timeBlocks]}
                        </h3>
                         {isCurrent && <span className="text-[10px] bg-barakah-200 dark:bg-barakah-800 text-barakah-800 dark:text-barakah-200 px-2 py-0.5 rounded-full font-bold">NOW</span>}
                    </div>
                    
                    <div className="space-y-3">
                        {blockTasks.length === 0 ? (
                            <div className="ml-8 text-sm text-slate-400 italic opacity-50">No tasks</div>
                        ) : (
                            blockTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    onClick={() => handleEditTask(task)}
                                    className={`relative flex items-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md cursor-pointer ml-2
                                        ${task.completed ? 'opacity-60' : 'opacity-100'}
                                    `}
                                >
                                    <div className={`w-2 h-2 rounded-full mr-3 ${task.completed ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                                    <span className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            );
        })}
     </div>
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Stats & Toggle */}
      <div className="flex items-center justify-between">
         <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.appName}</h1>
            <button 
                onClick={() => setSummaryOpen(true)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-barakah-500 text-left"
            >
                {Math.round(progress)}% Completed &bull; {t.viewSummary}
            </button>
         </div>
         
         <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex">
            <button
                onClick={() => setViewMode('segment')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'segment' ? 'bg-white dark:bg-slate-700 shadow text-barakah-600' : 'text-slate-400'}`}
            >
                <Layers size={18} />
            </button>
            <button
                onClick={() => setViewMode('full')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'full' ? 'bg-white dark:bg-slate-700 shadow text-barakah-600' : 'text-slate-400'}`}
            >
                <Layout size={18} />
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'segment' ? renderSegmentView() : renderFullView()}

      {/* Daily Hadith Mini-Card */}
      {viewMode === 'segment' && (
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-2 text-slate-400 dark:text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.dailyWisdom}</span>
            </div>
             <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                "{hadith.english}"
            </p>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-4 z-30">
          <button
            onClick={handleAddTask}
            className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Plus size={28} />
          </button>
      </div>

      <AiAssistant />

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        editTask={selectedTask}
      />

      <DailySummaryModal 
        isOpen={isSummaryOpen} 
        onClose={() => setSummaryOpen(false)} 
      />
    </div>
  );
};
