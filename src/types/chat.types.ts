export type UserRole = 'SUPER_ADMIN' | 'INVESTOR' | 'FARMER' | 'LANDOWNER';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: ChatUser;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}

export interface ConversationResponse {
  conversations: Conversation[];
  total: number;
}

export interface MessageResponse {
  messages: Message[];
  total: number;
}

export interface UserSearchParams {
  query?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface UserSearchResponse {
  users: ChatUser[];
  total: number;
}

// WebSocket Event Types
export interface SocketEvents {
  // Client to Server
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  'message:send': (data: SendMessageRequest) => void;
  'message:read': (messageId: string) => void;
  'typing:start': (receiverId: string) => void;
  'typing:stop': (receiverId: string) => void;
  
  // Server to Client
  'message:receive': (message: Message) => void;
  'message:delivered': (messageId: string) => void;
  'user:status': (data: { userId: string; isOnline: boolean }) => void;
  'typing:status': (data: { userId: string; isTyping: boolean }) => void;
  'conversation:updated': (conversation: Conversation) => void;
}
