import React from 'react';
import { Hash, Settings, LogOut, Sparkles } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  currentUser: string;
  onLogout: () => void;
  isOpen: boolean;
  activeId: string;
  onSelectChat: (id: string) => void;
  onOpenSettings: () => void;
  channels: ChatSession[];
  users: ChatSession[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  onLogout, 
  isOpen, 
  activeId, 
  onSelectChat,
  onOpenSettings,
  channels,
  users
}) => {

  return (
    <div className={`
      fixed inset-y-0 left-0 z-20 w-64 bg-slate-900/60 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
    `}>
      {/* Header */}
      <div className="h-24 flex items-center px-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 backdrop-blur-md group-hover:bg-white/10 transition-colors shadow-lg shadow-black/20">
          <Sparkles className="w-5 h-5 text-white/90" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold text-white tracking-wide font-sans leading-none mb-1">
            NebulaChat
          </h1>
          <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-medium">
            Quantum Relay
          </p>
        </div>
      </div>

      {/* Lists */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        {/* Channels */}
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 mt-2">
          Channels
        </h3>
        <div className="space-y-1 mb-8">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelectChat(channel.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                activeId === channel.id
                  ? 'bg-white/10 text-white shadow-sm border border-white/5' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Hash className={`w-4 h-4 mr-3 transition-colors ${activeId === channel.id ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="text-sm font-medium tracking-wide">{channel.name}</span>
            </button>
          ))}
        </div>

        {/* Users */}
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
          Online Users
        </h3>
        <div className="space-y-2">
          {users.map((user) => (
            <button 
              key={user.id} 
              onClick={() => onSelectChat(user.id)}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group border border-transparent ${
                 activeId === user.id ? 'bg-white/5 border-white/5 shadow-sm' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border border-white/10 shadow-inner ${
                   user.isMe ? 'bg-indigo-500/20 text-indigo-200' : 'bg-slate-800/50 text-slate-400'
                }`}>
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                {/* Status Dot on Avatar */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-slate-900 ${
                  user.status === 'online' ? 'bg-emerald-400' : 
                  user.status === 'busy' ? 'bg-rose-400' : 'bg-slate-500'
                }`}></div>
              </div>
              
              <div className="ml-3 flex flex-col items-start min-w-0">
                <div className={`text-sm font-medium truncate w-full text-left transition-colors ${
                  activeId === user.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                }`}>
                  {user.name} {user.isMe && <span className="text-[10px] text-indigo-400 ml-1 font-normal opacity-80">(You)</span>}
                </div>
                
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'online' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 
                      user.status === 'busy' ? 'bg-rose-500' : 'bg-slate-600'
                   }`}></div>
                   <span className={`text-[10px] uppercase tracking-widest font-medium ${
                      activeId === user.id ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-400'
                   }`}>
                     {user.status}
                   </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between">
           <button 
             onClick={onOpenSettings}
             className="p-2 rounded-xl text-slate-500 hover:bg-white/5 hover:text-white transition-all duration-300"
           >
              <Settings className="w-5 h-5" />
           </button>
           <button 
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;