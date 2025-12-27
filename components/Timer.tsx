import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

export const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play sound or vibrate
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const toggleMode = () => {
    const nextIsBreak = !isBreak;
    setIsBreak(nextIsBreak);
    setIsActive(false);
    setTimeLeft(nextIsBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isBreak ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
          <TimerIcon size={20} />
        </div>
        <div>
          <div className="font-mono text-2xl font-bold tracking-wider leading-none">
            {formatTime(timeLeft)}
          </div>
          <button onClick={toggleMode} className="text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity">
            {isBreak ? 'Break Mode' : 'Focus Mode'}
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTimer}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/70 hover:text-white"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};