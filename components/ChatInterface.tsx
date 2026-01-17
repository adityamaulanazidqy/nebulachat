import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Paperclip, Smile, Menu, X, Hash, Info, File as FileIcon, Trash2, Download } from 'lucide-react';
import { Message, ChatSession, Attachment } from '../types';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  currentUser: string;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser, onLogout }) => {
  const [activeId, setActiveId] = useState('general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  
  // Settings State
  const [userStatus, setUserStatus] = useState<'online' | 'offline' | 'busy'>('online');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Dummy Data Setup ---
  
  // Available Channels
  const channels: ChatSession[] = [
    { id: 'general', name: 'General', type: 'channel', description: 'Welcome to the galaxy hub' },
    { id: 'tech', name: 'Tech-Talk', type: 'channel', description: 'Quantum computing & AI' },
    { id: 'news', name: 'Space-News', type: 'channel', description: 'Latest from the cosmos' },
    { id: 'random', name: 'Random', type: 'channel', description: 'Memes and stardust' },
  ];

  // Available Users
  const staticUsers: ChatSession[] = [
    { id: 'nova', name: 'Nova', type: 'direct', status: 'online' },
    { id: 'cosmo', name: 'Cosmo_Bot', type: 'direct', status: 'busy' },
    { id: 'orion', name: 'Orion7', type: 'direct', status: 'offline' },
  ];

  // Combine static users with "Me" user dynamically based on status state
  const users = useMemo(() => [
    { id: 'me', name: currentUser, type: 'direct', status: userStatus, isMe: true } as ChatSession,
    ...staticUsers
  ], [currentUser, userStatus]);

  // Initial Messages Dictionary
  const initialHistories: Record<string, Message[]> = useMemo(() => ({
    'general': [
      { id: 'g1', sender: 'System', text: 'Welcome to the NebulaChat General Channel. 🚀', timestamp: new Date(Date.now() - 10000000), isOwn: false, status: 'sent', avatar: 'SY' },
      { id: 'g2', sender: 'Orion7', text: 'Has anyone seen the latest star charts for the Andromeda sector?', timestamp: new Date(Date.now() - 5000000), isOwn: false, status: 'sent', avatar: 'OR' },
      { id: 'g3', sender: 'Cosmo_Bot', text: 'Star charts updated at 0800 hours. Access them in the #Space-News channel.', timestamp: new Date(Date.now() - 4000000), isOwn: false, status: 'sent', avatar: 'CB' },
    ],
    'tech': [
      { id: 't1', sender: 'Nova', text: 'Quantum entanglement latency is down by 0.04% this week. Impressive work team.', timestamp: new Date(Date.now() - 8000000), isOwn: false, status: 'sent', avatar: 'NO' },
    ],
    'news': [
      { id: 'n1', sender: 'System', text: 'Breaking: Supernova detected in Sector 7G.', timestamp: new Date(Date.now() - 100000), isOwn: false, status: 'sent', avatar: 'SY' },
    ],
    'random': [
      { id: 'r1', sender: 'Orion7', text: 'Why did the star go to school? To get brighter! 😂', timestamp: new Date(Date.now() - 200000), isOwn: false, status: 'sent', avatar: 'OR' },
    ],
    'nova': [
       { id: 'ai1', sender: 'Nova', text: `Greetings, ${currentUser}. I am Nova, your AI assistant on this vessel. How can I assist you today?`, timestamp: new Date(), isOwn: false, status: 'sent', avatar: 'NO' }
    ],
    'cosmo': [
      { id: 'cb1', sender: 'Cosmo_Bot', text: 'I am a bot. I perform automated tasks. Beep boop.', timestamp: new Date(Date.now() - 9000000), isOwn: false, status: 'sent', avatar: 'CB' }
    ],
    'orion': [
      { id: 'or1', sender: 'Orion7', text: 'Hey, are you new here?', timestamp: new Date(Date.now() - 86400000), isOwn: false, status: 'sent', avatar: 'OR' }
    ],
    'me': [] // Self chat
  }), [currentUser]);

  // State for all message histories
  const [histories, setHistories] = useState<Record<string, Message[]>>(initialHistories);

  // Derived state for active session
  const activeSession = [...channels, ...users].find(c => c.id === activeId) || channels[0];
  const activeMessages = histories[activeId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping, activeId, pendingAttachments]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newAttachments: Attachment[] = [];
      const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

      files.forEach(file => {
        if (file.size > MAX_SIZE) {
          alert(`File ${file.name} exceeds the 10MB limit.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          setPendingAttachments(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            data: loadEvent.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      });
      
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleClearHistory = () => {
    // Reset to empty arrays but keep keys
    const cleared: Record<string, Message[]> = {};
    Object.keys(histories).forEach(key => cleared[key] = []);
    setHistories(cleared);
    setIsSettingsOpen(false);
  };

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    // Simple beep using Web Audio API or just skip for now as we don't have assets
    // A real implementation would use: new Audio('/sounds/pop.mp3').play();
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && pendingAttachments.length === 0) return;

    const currentAttachments = [...pendingAttachments];
    setPendingAttachments([]); // Clear pending immediately
    setInputValue('');

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      text: inputValue,
      timestamp: new Date(),
      isOwn: true,
      status: 'sent',
      avatar: currentUser.substring(0, 2).toUpperCase(),
      attachments: currentAttachments
    };

    // Update history for current chat
    setHistories(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), userMsg]
    }));
    
    // Logic for responses
    if (activeId === 'nova') {
      setIsTyping(true);
      const aiMsgId = (Date.now() + 1).toString();
      
      // Placeholder
      const initialAiMsg: Message = {
        id: aiMsgId,
        sender: 'Nova',
        text: '', 
        timestamp: new Date(),
        isOwn: false,
        status: 'sending',
        avatar: 'NO'
      };

      setHistories(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), initialAiMsg]
      }));

      try {
        await sendMessageToGemini(userMsg.text, currentAttachments, (chunkText) => {
           setHistories(prev => {
             const currentChatMsgs = prev[activeId];
             const updatedMsgs = currentChatMsgs.map(msg => 
               msg.id === aiMsgId ? { ...msg, text: chunkText, status: 'sent' as const } : msg
             );
             return { ...prev, [activeId]: updatedMsgs };
           });
        });
        playNotificationSound();
      } catch (error) {
         setHistories(prev => ({
           ...prev,
           [activeId]: prev[activeId].map(msg => msg.id === aiMsgId ? { ...msg, text: "Error connecting to AI core.", status: 'error' } : msg)
         }));
      } finally {
        setIsTyping(false);
      }
    } else if (activeId === 'cosmo') {
       // Simple bot auto-reply
       setTimeout(() => {
          const botMsg: Message = {
            id: Date.now().toString(),
            sender: 'Cosmo_Bot',
            text: `[AUTO-REPLY] Processed ${currentAttachments.length > 0 ? 'attachment' : 'message'}.`,
            timestamp: new Date(),
            isOwn: false,
            status: 'sent',
            avatar: 'CB'
          };
          setHistories(prev => ({ ...prev, [activeId]: [...prev[activeId], botMsg] }));
          playNotificationSound();
       }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-screen relative z-10">
      <Sidebar 
        currentUser={currentUser} 
        onLogout={onLogout} 
        isOpen={isSidebarOpen}
        activeId={activeId}
        onSelectChat={(id) => {
          setActiveId(id);
          setIsSidebarOpen(false);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        channels={channels}
        users={users}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        currentStatus={userStatus}
        onUpdateStatus={setUserStatus}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
        onClearHistory={handleClearHistory}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/30">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-white/10 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-4 text-slate-300 hover:text-white"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            
            {/* Dynamic Header Content */}
            <div className="flex items-center gap-3">
              {activeSession.type === 'channel' ? (
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400 border border-white/5">
                    <Hash className="w-4 h-4" />
                 </div>
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-white/10 ${
                   activeSession.isMe ? 'bg-indigo-500/20 text-indigo-200' : 'bg-slate-800 text-white'
                }`}>
                  {activeSession.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              
              <div>
                <h2 className="text-white font-bold text-sm md:text-base flex items-center gap-2">
                  {activeSession.name}
                  {activeSession.status === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span>}
                </h2>
                <p className="text-[10px] md:text-xs text-slate-400">
                  {activeSession.type === 'channel' 
                    ? activeSession.description 
                    : activeSession.status === 'online' ? 'Active now' : `Status: ${activeSession.status}`
                  }
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                 <Hash className="w-8 h-8" />
              </div>
              <p>This is the start of the <span className="text-cyan-400 font-bold">{activeSession.name}</span> history.</p>
            </div>
          ) : (
            activeMessages.map((msg, index) => {
             const isSequence = index > 0 && activeMessages[index - 1].sender === msg.sender;
             return (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.isOwn ? 'justify-end' : 'justify-start'} ${isSequence ? 'mt-2' : 'mt-6'}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {!isSequence && (
                    <div className={`
                      flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-white shadow-lg
                      ${msg.isOwn ? 'ml-3 bg-gradient-to-br from-indigo-500 to-purple-600' : 'mr-3 bg-gradient-to-br from-cyan-500 to-blue-600'}
                    `}>
                      {msg.avatar || msg.sender[0]}
                    </div>
                  )}
                  {isSequence && <div className="w-11 md:w-13" />} {/* Spacer for alignment */}

                  <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                     {!isSequence && (
                       <span className="text-xs text-slate-400 mb-1 px-1">
                         {msg.sender} <span className="opacity-50 mx-1">•</span> {formatTime(msg.timestamp)}
                       </span>
                     )}
                     
                     <div className={`
                        p-1.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg backdrop-blur-sm border flex flex-col gap-2
                        ${msg.isOwn 
                          ? 'bg-indigo-600/80 border-indigo-500/50 text-white rounded-tr-sm' 
                          : 'bg-slate-800/60 border-white/10 text-slate-100 rounded-tl-sm'
                        }
                     `}>
                        {/* Attachments Display */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-col gap-1 p-1">
                            {msg.attachments.map(att => (
                              att.type.startsWith('image/') ? (
                                <img 
                                  key={att.id} 
                                  src={att.data} 
                                  alt={att.name} 
                                  className="rounded-xl max-w-full max-h-60 object-cover border border-white/10"
                                />
                              ) : (
                                <div key={att.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 hover:bg-black/30 transition-colors cursor-pointer group">
                                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-cyan-400">
                                    <FileIcon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate text-white/90">{att.name}</div>
                                    <div className="text-xs text-slate-400">{formatFileSize(att.size)}</div>
                                  </div>
                                  <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                                </div>
                              )
                            ))}
                          </div>
                        )}

                        {/* Text Message */}
                        {msg.text && (
                          <div className="px-3 py-2">
                             {msg.text}
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            );
          }))}
          
          {isTyping && activeId === 'nova' && (
             <div className="flex w-full justify-start mt-4">
                <div className="flex items-end">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mr-3 flex items-center justify-center text-xs font-bold text-white">N</div>
                   <div className="bg-slate-800/60 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex space-x-1 items-center h-10">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Input (Hidden) */}
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
          {/* Attachments Preview */}
          {pendingAttachments.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mb-3 p-2 bg-slate-900/60 rounded-xl border border-white/10 backdrop-blur-md">
              {pendingAttachments.map((att) => (
                <div key={att.id} className="relative group flex-shrink-0">
                   {att.type.startsWith('image/') ? (
                     <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 relative">
                       <img src={att.data} alt="preview" className="w-full h-full object-cover" />
                     </div>
                   ) : (
                     <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center justify-center text-xs gap-1 p-1">
                       <FileIcon className="w-5 h-5 text-cyan-400" />
                       <span className="truncate w-full text-center text-[9px] text-slate-400">{att.name}</span>
                     </div>
                   )}
                   <button 
                    onClick={() => removeAttachment(att.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <X className="w-3 h-3" />
                   </button>
                </div>
              ))}
            </div>
          )}

          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30"
          >
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${activeSession.type === 'channel' ? '#' + activeSession.name : activeSession.name}...`}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none px-2 py-1"
            />
            
            <button type="button" className="p-2 text-slate-400 hover:text-yellow-400 transition-colors rounded-full hover:bg-white/5 md:block hidden">
              <Smile className="w-5 h-5" />
            </button>
            
            <button 
              type="submit" 
              disabled={(!inputValue.trim() && pendingAttachments.length === 0) || (isTyping && activeId === 'nova')}
              className={`
                p-2 rounded-xl flex items-center justify-center transition-all duration-300
                ${(inputValue.trim() || pendingAttachments.length > 0) && !(isTyping && activeId === 'nova') 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] transform hover:scale-105 active:scale-95' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
              `}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2 text-[10px] text-slate-600">
            Powered by Gemini API • Encryption Level: Quantum
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;