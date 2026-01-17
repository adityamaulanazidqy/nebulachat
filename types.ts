export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 data URL
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
  status: 'sending' | 'sent' | 'error';
  attachments?: Attachment[];
}

export interface User {
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

export enum AppState {
  LOGIN,
  CHAT,
}

export type ChatType = 'channel' | 'direct';

export interface ChatSession {
  id: string;
  name: string;
  type: ChatType;
  status?: 'online' | 'offline' | 'busy';
  avatar?: string; // For DMs
  description?: string; // For channels
  isMe?: boolean;
}