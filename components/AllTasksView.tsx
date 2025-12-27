import React from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, CATEGORY_COLORS } from '../constants';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onClick: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => (
  <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
  >
      <div className="flex items-center gap-3 overflow-hidden">
           {task.completed ? (
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
          ) : (
              <Circle className="text-slate-300 shrink-0" size={20} />
          )}
          <div className="min-w-0">
              <p className={`font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                  {task.title}
              </p>
              <div className="flex gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_COLORS[task.category as keyof typeof CATEGORY_COLORS]}`}>
                      {task.category}
                  </span>
                   <span className="text-[10px] text-slate-400">{task.date}</span>
              </div>
          </div>
      </div>
  </div>
);

export const AllTasksView: React.FC = () => {
  const { state, toggleTaskCompletion } = useApp();
  const t = TRANSLATIONS[state.settings.language];
  const { tasks } = state;

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 px-2">{t.inProgress} ({incompleteTasks.length})</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                {incompleteTasks.length > 0 ? (
                    incompleteTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onClick={() => toggleTaskCompletion(task.id)} 
                      />
                    ))
                ) : (
                    <div className="p-6 text-center text-slate-400 text-sm">No active tasks</div>
                )}
            </div>
        </div>

        <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 px-2">{t.completed} ({completedTasks.length})</h2>
             <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                {completedTasks.length > 0 ? (
                    completedTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onClick={() => toggleTaskCompletion(task.id)} 
                      />
                    ))
                ) : (
                    <div className="p-6 text-center text-slate-400 text-sm">No completed tasks yet</div>
                )}
            </div>
        </div>
    </div>
  );
};