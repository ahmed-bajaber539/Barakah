import React, { useState } from 'react';
import { useApp } from '../context';
import { TRANSLATIONS } from '../constants';
import { BookOpen, CheckCircle2, Circle, Plus, Trash2, X } from 'lucide-react';
import { Timer } from './Timer';

export const LearningView: React.FC = () => {
  const { state, toggleLearningCompletion, addLearningItem, deleteLearningItem } = useApp();
  const t = TRANSLATIONS[state.settings.language];
  const items = state.learningPlan;
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const total = items.length;
  const completed = items.filter(i => i.completed).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addLearningItem({
        title: newTitle,
        description: newDesc,
        dayNumber: items.length + 1
    });
    setNewTitle('');
    setNewDesc('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.learning}</h2>
                    <p className="text-slate-500 text-sm mt-1">{completed} of {total} completed</p>
                </div>
                <div className="text-4xl font-black text-emerald-100 dark:text-emerald-900/30">
                    {total === 0 ? 0 : Math.round((completed / total) * 100)}%
                </div>
            </div>
             <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${total === 0 ? 0 : (completed / total) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Focus Timer for Learning */}
        <Timer />

        {/* List */}
        <div className="space-y-3">
            {items.map((item, index) => (
                <div 
                    key={item.id}
                    className={`group flex items-start justify-between p-5 rounded-2xl transition-all border relative
                        ${item.completed 
                            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20' 
                            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:shadow-md'
                        }
                    `}
                >
                    <div 
                        className="flex gap-4 cursor-pointer flex-1"
                        onClick={() => toggleLearningCompletion(item.id)}
                    >
                        <div className="flex-shrink-0 mt-1">
                            {item.completed ? (
                                <CheckCircle2 className="text-emerald-500" size={24} />
                            ) : (
                                <Circle className="text-slate-300 dark:text-slate-600" size={24} />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {item.dayNumber && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Day {item.dayNumber}</span>
                                )}
                            </div>
                            <h3 className={`text-lg font-medium ${item.completed ? 'text-emerald-800 dark:text-emerald-200 line-through opacity-70' : 'text-slate-800 dark:text-slate-100'}`}>
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => deleteLearningItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 transition-opacity"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
        
        {/* Add Item Trigger */}
        {!isAddOpen && (
            <button 
                onClick={() => setIsAddOpen(true)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 text-slate-400 font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} /> Add Lesson
            </button>
        )}

        {/* Add Item Form */}
        {isAddOpen && (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white">Add New Lesson</h3>
                    <button onClick={() => setIsAddOpen(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                <form onSubmit={handleAddItem} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Lesson Title" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
                        autoFocus
                    />
                    <textarea 
                        placeholder="Description (optional)" 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-none text-slate-900 dark:text-white h-24 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                         <button 
                            type="button" 
                            onClick={() => setIsAddOpen(false)}
                            className="px-4 py-2 text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!newTitle.trim()}
                            className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>
                </form>
             </div>
        )}
    </div>
  );
};
