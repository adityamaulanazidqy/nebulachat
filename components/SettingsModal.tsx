import React, { useState } from 'react';
import { X, User, Bell, Volume2, Shield, Trash2, Check, Monitor } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  currentStatus: 'online' | 'offline' | 'busy';
  onUpdateStatus: (status: 'online' | 'offline' | 'busy') => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onClearHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentStatus,
  onUpdateStatus,
  soundEnabled,
  onToggleSound,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'preferences'>('account');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5 bg-white/5 shrink-0">
          <h2 className="text-xl font-bold text-white tracking-wide">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'account' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              Account
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'preferences' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Preferences
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-[#0f111a] to-[#1a1d2d] overflow-y-auto custom-scrollbar">
            
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                {/* Profile Card */}
                <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl md:text-2xl font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
                    {currentUser.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">{currentUser}</h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">Commander Level • ID: #8821</p>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Online Status</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => onUpdateStatus('online')}
                      className={`relative flex flex-row sm:flex-col items-center sm:justify-center p-3 md:p-4 rounded-xl border transition-all gap-3 sm:gap-2 ${
                        currentStatus === 'online' 
                          ? 'bg-emerald-500/10 border-emerald-500/50' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                      <span className={`text-sm font-medium ${currentStatus === 'online' ? 'text-emerald-300' : 'text-slate-400'}`}>Online</span>
                      {currentStatus === 'online' && <div className="ml-auto sm:ml-0 sm:absolute sm:top-2 sm:right-2 text-emerald-400"><Check className="w-4 h-4" /></div>}
                    </button>

                    <button
                      onClick={() => onUpdateStatus('busy')}
                      className={`relative flex flex-row sm:flex-col items-center sm:justify-center p-3 md:p-4 rounded-xl border transition-all gap-3 sm:gap-2 ${
                        currentStatus === 'busy' 
                          ? 'bg-rose-500/10 border-rose-500/50' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]"></div>
                      <span className={`text-sm font-medium ${currentStatus === 'busy' ? 'text-rose-300' : 'text-slate-400'}`}>Busy</span>
                      {currentStatus === 'busy' && <div className="ml-auto sm:ml-0 sm:absolute sm:top-2 sm:right-2 text-rose-400"><Check className="w-4 h-4" /></div>}
                    </button>

                    <button
                      onClick={() => onUpdateStatus('offline')}
                      className={`relative flex flex-row sm:flex-col items-center sm:justify-center p-3 md:p-4 rounded-xl border transition-all gap-3 sm:gap-2 ${
                        currentStatus === 'offline' 
                          ? 'bg-slate-500/10 border-slate-500/50' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span className={`text-sm font-medium ${currentStatus === 'offline' ? 'text-slate-300' : 'text-slate-400'}`}>Invisible</span>
                      {currentStatus === 'offline' && <div className="ml-auto sm:ml-0 sm:absolute sm:top-2 sm:right-2 text-slate-400"><Check className="w-4 h-4" /></div>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                
                {/* Sound Settings */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Sound Effects</h4>
                      <p className="text-xs text-slate-400">Play sounds for incoming messages</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onToggleSound(!soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 self-end sm:self-auto ${soundEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Notifications (Mock) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 opacity-70 cursor-not-allowed gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Desktop Notifications</h4>
                      <p className="text-xs text-slate-400">Receive alerts when app is in background</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium px-2 py-1 border border-slate-700 rounded self-start sm:self-center">COMING SOON</div>
                </div>

                <div className="h-px bg-white/5 my-6"></div>

                {/* Danger Zone */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h4>
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                       <h5 className="text-white font-medium">Clear Chat History</h5>
                       <p className="text-xs text-rose-300/70 mt-0.5">This action cannot be undone.</p>
                    </div>
                    <button 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to delete all local message history?')) {
                          onClearHistory();
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-lg transition-colors border border-rose-500/30 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Data
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;