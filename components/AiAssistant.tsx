import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { useApp } from '../context';
import { ChatMessage, Priority, Category, Task } from '../types';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';

const addTaskTool: FunctionDeclaration = {
  name: "addTask",
  description: "Add a new task to the user's schedule.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { 
          type: Type.STRING, 
          description: "The title of the task" 
      },
      category: { 
          type: Type.STRING, 
          description: "The category: Work, Learning, Spiritual, Health, or Open" 
      },
      priority: { 
          type: Type.STRING, 
          description: "Urgent or Normal" 
      },
      timeBlock: { 
          type: Type.STRING, 
          description: "The time block (e.g., 'After Fajr', 'Before Dhuhr')" 
      }
    },
    required: ["title"],
  }
};

export const AiAssistant: React.FC = () => {
  const { state, addTask, currentBlock, todayStr } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: 'init', role: 'model', text: 'Salam! I am Barakah, your personal assistant. How can I help you organize your day?', timestamp: Date.now() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Context building
      const taskContext = state.tasks
        .filter(t => !t.completed && t.date === todayStr)
        .map(t => `- ${t.title} (${t.category}, ${t.timeBlock})`).join('\n');
      
      const systemPrompt = `You are Barakah, a wise and calm productivity assistant. 
      Current Time Block: ${currentBlock}.
      Today's Date: ${todayStr}.
      User's Pending Tasks:\n${taskContext}
      
      Help the user prioritize, suggest spiritual or learning activities, and add tasks if requested.
      Keep responses concise, encouraging, and clear.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: userMsg.text }] }
        ],
        config: {
            systemInstruction: systemPrompt,
            tools: [{functionDeclarations: [addTaskTool]}],
        }
      });

      // Handle Function Calls
      const functionCalls = response.functionCalls;
      let responseText = response.text || "";

      if (functionCalls && functionCalls.length > 0) {
          for (const call of functionCalls) {
              if (call.name === 'addTask') {
                  const args = call.args as any;
                  // Default values if AI misses them
                  const newTask: Omit<Task, 'id' | 'createdAt'> = {
                      title: args.title,
                      category: (args.category as Category) || Category.OPEN,
                      priority: (args.priority as Priority) || Priority.NORMAL,
                      timeBlock: args.timeBlock || currentBlock,
                      completed: false,
                      date: todayStr
                  };
                  addTask(newTask);
                  responseText += `\n\n[Task added: ${newTask.title}]`;
              }
          }
      }

      const botMsg: ChatMessage = { 
          id: crypto.randomUUID(), 
          role: 'model', 
          text: responseText || "I've updated your schedule.", 
          timestamp: Date.now() 
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: "I'm having trouble connecting right now. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-barakah-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md h-[600px] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-gray-100 dark:border-slate-800">
                
                {/* Header */}
                <div className="bg-barakah-50 dark:bg-slate-800 p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-barakah-100 dark:bg-barakah-900 flex items-center justify-center text-barakah-600 dark:text-barakah-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Ask Barakah</h3>
                            <p className="text-xs text-slate-500">AI Productivity Assistant</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-full text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-barakah-100 text-barakah-600'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-slate-700 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-700 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-barakah-500" />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for advice or add a task..."
                            className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-barakah-500 dark:text-white"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-3 bg-barakah-600 text-white rounded-xl hover:bg-barakah-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}
    </>
  );
};
