import React, { useState } from 'react';
import StarBackground from './components/StarBackground';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import { AppState } from './types';
import { initChatSession } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [currentUser, setCurrentUser] = useState<string>('');

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setAppState(AppState.CHAT);
    // Initialize the AI chat service on login
    initChatSession();
  };

  const handleLogout = () => {
    setAppState(AppState.LOGIN);
    setCurrentUser('');
  };

  return (
    <div className="relative min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-white">
      <StarBackground />
      
      {appState === AppState.LOGIN ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatInterface currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;