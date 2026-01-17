import React, { useState } from 'react';
import { ArrowRight, Sparkles, User } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] transform hover:scale-[1.005] transition-all duration-500">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-md">
            NebulaChat
          </h1>
          <p className="text-slate-300 text-sm font-light">
            Enter the quantum stream. No password required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            {/* Input Container */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your codename..."
                autoFocus
                className="block w-full pl-12 pr-4 py-4 text-white bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-400 focus:bg-black/60 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-500 font-medium"
              />
            </div>
            {/* Glow effect behind input */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white font-bold tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
          >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
             <span className="flex items-center justify-center gap-2">
               Connect to Server <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
           <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
             System Status: <span className="text-emerald-400 animate-pulse">Online</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;