import React, { useState, useEffect } from 'react';
import { Task, Category, Priority, TimeBlock, Language } from '../types';
import { TIME_BLOCKS, CATEGORIES, PRIORITIES, TRANSLATIONS } from '../constants';
import { useApp } from '../context';
import { X } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, editTask }) => {
  const { addTask, updateTask, deleteTask, state, todayStr } = useApp();
  const t = TRANSLATIONS[state.settings.language];
  const isRtl = state.settings.language === Language.ARABIC;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.WORK);
  const [priority, setPriority] = useState<Priority>(Priority.NORMAL);
  const [timeBlock, setTimeBlock] = useState<string>(TimeBlock.PRE_DHUHR);
  const [date, setDate] = useState(todayStr);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setCategory(editTask.category);
      setPriority(editTask.priority);
      setTimeBlock(editTask.timeBlock);
      setDate(editTask.date);
    } else {
      setTitle('');
      setCategory(Category.WORK);
      setPriority(Priority.NORMAL);
      setTimeBlock(TimeBlock.PRE_DHUHR);
      setDate(todayStr);
    }
  }, [editTask, isOpen, todayStr]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editTask) {
      updateTask({
        ...editTask,
        title,
        category,
        priority,
        timeBlock,
        date
      });
    } else {
      addTask({
        title,
        category,
        priority,
        timeBlock,
        date,
        completed: false,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (editTask) {
      deleteTask(editTask.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl transform transition-all overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editTask ? t.editTask : t.addTask}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} className="text-slate-500" />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto no-scrollbar">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400 block">{t.title}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="..."
              className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-barakah-500"
              autoFocus
            />
          </div>

          {/* Time Block */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400 block">{t.timeBlock}</label>
            <div className="grid grid-cols-2 gap-2">
                {TIME_BLOCKS.map(tb => (
                    <button
                        key={tb}
                        type="button"
                        onClick={() => setTimeBlock(tb)}
                        className={`p-2 text-xs rounded-lg border transition-all ${
                            timeBlock === tb
                            ? 'bg-barakah-500 text-white border-barakah-500'
                            : 'bg-transparent border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        {t.timeBlocks[tb as keyof typeof t.timeBlocks]}
                    </button>
                ))}
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 block">{t.category}</label>
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-900 dark:text-white text-sm"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 block">{t.priority}</label>
                <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-900 dark:text-white text-sm"
                >
                    {PRIORITIES.map(p => (
                        <option key={p} value={p}>{p === Priority.URGENT ? t.urgent : t.normal}</option>
                    ))}
                </select>
              </div>
          </div>

          {/* Actions */}
          <div className={`flex gap-3 pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>
            {editTask && (
                 <button
                 type="button"
                 onClick={handleDelete}
                 className="px-4 py-3 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-200 font-medium"
               >
                 {t.deleteTask}
               </button>
            )}
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-barakah-600 text-white font-medium hover:bg-barakah-700 shadow-lg shadow-barakah-500/20"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
