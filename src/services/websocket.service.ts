import type { Message, SendMessageRequest } from '@/types/chat.types';
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = 'http://localhost:3000'; // Update with your backend URL
  private messageHandlers: ((message: Message) => void)[] = [];
  private statusHandlers: ((data: { userId: string; isOnline: boolean }) => void)[] = [];
  private typingHandlers: ((data: { userId: string; isTyping: boolean }) => void)[] = [];
  private deliveredHandlers: ((messageId: string) => void)[] = [];

  connect(userId: string, token?: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(this.SOCKET_URL, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Message received
    this.socket.on('message:receive', (message: Message) => {
      console.log('Message received:', message);
      this.messageHandlers.forEach(handler => handler(message));
    });

    // Message delivered acknowledgment
    this.socket.on('message:delivered', (messageId: string) => {
      console.log('Message delivered:', messageId);
      this.deliveredHandlers.forEach(handler => handler(messageId));
    });

    // User online/offline status
    this.socket.on('user:status', (data: { userId: string; isOnline: boolean }) => {
      console.log('User status:', data);
      this.statusHandlers.forEach(handler => handler(data));
    });

    // Typing indicator
    this.socket.on('typing:status', (data: { userId: string; isTyping: boolean }) => {
      this.typingHandlers.forEach(handler => handler(data));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(data: SendMessageRequest): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('message:send', data);
  }

  markMessageAsRead(messageId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('message:read', messageId);
  }

  startTyping(receiverId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('typing:start', receiverId);
  }

  stopTyping(receiverId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('typing:stop', receiverId);
  }

  onMessageReceived(handler: (message: Message) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onMessageDelivered(handler: (messageId: string) => void): () => void {
    this.deliveredHandlers.push(handler);
    return () => {
      this.deliveredHandlers = this.deliveredHandlers.filter(h => h !== handler);
    };
  }

  onUserStatusChange(handler: (data: { userId: string; isOnline: boolean }) => void): () => void {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
    };
  }

  onTypingStatusChange(handler: (data: { userId: string; isTyping: boolean }) => void): () => void {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const webSocketService = new WebSocketService();
