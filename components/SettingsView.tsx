import React, { useState } from 'react';
import { useApp } from '../context';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Upload, Moon, Sun, Globe, Database, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mb-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 ml-1">{title}</h3>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          {children}
      </div>
  </div>
);

interface RowProps {
  icon: React.ElementType;
  label: string;
  action: React.ReactNode;
  border?: boolean;
}

const Row: React.FC<RowProps> = ({ icon: Icon, label, action, border = true }) => (
  <div className={`flex items-center justify-between p-5 ${border ? 'border-b border-gray-100 dark:border-slate-800' : ''}`}>
      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
              <Icon size={20} />
          </div>
          <span className="font-medium">{label}</span>
      </div>
      <div>{action}</div>
  </div>
);

export const SettingsView: React.FC = () => {
  const { state, setLanguage, setTheme, uploadContent, addHadith, deleteHadith, addDhikr, deleteDhikr } = useApp();
  const t = TRANSLATIONS[state.settings.language];
  
  // Content Manager State
  const [activeTab, setActiveTab] = useState<'hadith' | 'dhikr'>('hadith');
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  
  // Form States
  const [hArabic, setHArabic] = useState('');
  const [hEnglish, setHEnglish] = useState('');
  const [hSource, setHSource] = useState('');
  
  const [dText, setDText] = useState('');
  const [dCount, setDCount] = useState('33');

  const handleAddHadith = (e: React.FormEvent) => {
      e.preventDefault();
      addHadith({ arabic: hArabic, english: hEnglish, source: hSource });
      setHArabic(''); setHEnglish(''); setHSource('');
  };

  const handleAddDhikr = (e: React.FormEvent) => {
      e.preventDefault();
      addDhikr({ text: dText, count: parseInt(dCount) });
      setDText('');
  };

  const handleFileUpload = (type: 'learning' | 'hadith' | 'dhikr') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json)) {
            uploadContent(type, json);
            alert('Upload successful!');
          } else {
            alert('Invalid JSON format. Expected an array.');
          }
        } catch (error) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <Section title={t.theme}>
        <Row 
            icon={state.settings.theme === 'dark' ? Moon : Sun} 
            label={t.theme}
            border={false}
            action={
                <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                    <button 
                        onClick={() => setTheme('light')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${state.settings.theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                        {t.light}
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${state.settings.theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}
                    >
                        {t.dark}
                    </button>
                </div>
            }
        />
      </Section>

      <Section title={t.language}>
        <Row 
            icon={Globe} 
            label={t.language}
            border={false}
            action={
                <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                    <button 
                        onClick={() => setLanguage(Language.ENGLISH)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${state.settings.language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                        EN
                    </button>
                    <button 
                        onClick={() => setLanguage(Language.ARABIC)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${state.settings.language === 'ar' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}
                    >
                        عربي
                    </button>
                </div>
            }
        />
      </Section>
      
      {/* Manual Content Manager */}
      <Section title="Content Manager">
          <div className="p-5">
              <button 
                onClick={() => setIsManagerOpen(!isManagerOpen)}
                className="w-full flex justify-between items-center text-slate-700 dark:text-slate-200 font-medium"
              >
                  <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                          <Database size={20} />
                      </div>
                      <span>Manage Hadith & Dhikr</span>
                  </div>
                  {isManagerOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {isManagerOpen && (
                  <div className="mt-6 animate-fade-in">
                      <div className="flex gap-4 border-b border-gray-100 dark:border-slate-800 mb-4">
                          <button 
                            onClick={() => setActiveTab('hadith')}
                            className={`pb-2 text-sm font-bold ${activeTab === 'hadith' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
                          >
                              Hadith ({state.hadithCollection.length})
                          </button>
                           <button 
                            onClick={() => setActiveTab('dhikr')}
                            className={`pb-2 text-sm font-bold ${activeTab === 'dhikr' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
                          >
                              Dhikr ({state.dhikrCollection.length})
                          </button>
                      </div>
                      
                      {/* List & Add Form */}
                      <div className="space-y-4">
                          {activeTab === 'hadith' ? (
                              <>
                                <form onSubmit={handleAddHadith} className="space-y-3 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                    <input value={hArabic} onChange={e => setHArabic(e.target.value)} placeholder="Arabic Text" className="w-full p-2 rounded-lg text-sm" required dir="rtl" />
                                    <input value={hEnglish} onChange={e => setHEnglish(e.target.value)} placeholder="English Translation" className="w-full p-2 rounded-lg text-sm" required />
                                    <input value={hSource} onChange={e => setHSource(e.target.value)} placeholder="Source (e.g. Bukhari)" className="w-full p-2 rounded-lg text-sm" required />
                                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Add Hadith</button>
                                </form>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {state.hadithCollection.map(h => (
                                        <div key={h.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm">
                                            <div className="truncate flex-1 pr-2">{h.english}</div>
                                            <button onClick={() => deleteHadith(h.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                              </>
                          ) : (
                              <>
                                <form onSubmit={handleAddDhikr} className="space-y-3 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                    <input value={dText} onChange={e => setDText(e.target.value)} placeholder="Dhikr Text" className="w-full p-2 rounded-lg text-sm" required />
                                    <input type="number" value={dCount} onChange={e => setDCount(e.target.value)} placeholder="Count" className="w-full p-2 rounded-lg text-sm" required />
                                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Add Dhikr</button>
                                </form>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {state.dhikrCollection.map(d => (
                                        <div key={d.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm">
                                            <div className="truncate flex-1 pr-2">{d.text} ({d.count})</div>
                                            <button onClick={() => deleteDhikr(d.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                              </>
                          )}
                      </div>
                  </div>
              )}
          </div>
      </Section>

      <Section title="Data Upload (JSON)">
         <div className="p-5 border-b border-gray-100 dark:border-slate-800">
            <label className="flex flex-col gap-2 cursor-pointer group">
                <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                        <Upload size={20} />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                        {t.uploadLearning}
                    </span>
                </div>
                <input type="file" accept=".json" onChange={handleFileUpload('learning')} className="hidden" />
            </label>
         </div>

         <div className="p-5 border-b border-gray-100 dark:border-slate-800">
            <label className="flex flex-col gap-2 cursor-pointer group">
                <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                        <Upload size={20} />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-amber-600 transition-colors">
                        {t.uploadHadith}
                    </span>
                </div>
                <input type="file" accept=".json" onChange={handleFileUpload('hadith')} className="hidden" />
            </label>
         </div>

         <div className="p-5">
            <label className="flex flex-col gap-2 cursor-pointer group">
                <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                        <Upload size={20} />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                        {t.uploadDhikr}
                    </span>
                </div>
                <input type="file" accept=".json" onChange={handleFileUpload('dhikr')} className="hidden" />
            </label>
         </div>
      </Section>
      
      <div className="text-center text-xs text-slate-400 mt-8">
        Barakah v2.0 AI-Enabled
      </div>
    </div>
  );
};
