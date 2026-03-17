export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

const CONVERSATIONS_KEY = "aswenna_conversations";
const MESSAGES_KEY = "aswenna_messages";

const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const loadConversations = (): Record<string, Conversation[]> => {
  try {
    return JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveConversations = (data: Record<string, Conversation[]>) => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(data));
};

const loadMessages = (): Record<string, ChatMessage[]> => {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveMessages = (data: Record<string, ChatMessage[]>) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(data));
};

class ChatService {
  getConversations(userId: string): Conversation[] {
    const all = loadConversations();
    return (all[userId] || []).sort((a, b) => {
      const ta = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const tb = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return tb - ta;
    });
  }

  getOrCreateConversation(userId: string, otherUserId: string): Conversation {
    const all = loadConversations();
    const userConvs = all[userId] || [];

    const existing = userConvs.find(
      (c) =>
        c.participantIds.includes(userId) &&
        c.participantIds.includes(otherUserId),
    );
    if (existing) return existing;

    const newConv: Conversation = {
      id: generateId(),
      participantIds: [userId, otherUserId],
      unreadCount: 0,
    };

    all[userId] = [...userConvs, newConv];
    all[otherUserId] = [...(all[otherUserId] || []), newConv];
    saveConversations(all);

    return newConv;
  }

  getMessages(conversationId: string): ChatMessage[] {
    const all = loadMessages();
    return (all[conversationId] || []).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }

  sendMessage(
    conversationId: string,
    senderId: string,
    text: string,
  ): ChatMessage {
    const msg: ChatMessage = {
      id: generateId(),
      conversationId,
      senderId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allMsgs = loadMessages();
    allMsgs[conversationId] = [...(allMsgs[conversationId] || []), msg];
    saveMessages(allMsgs);

    const allConvs = loadConversations();
    for (const userId of Object.keys(allConvs)) {
      allConvs[userId] = allConvs[userId].map((c) => {
        if (c.id !== conversationId) return c;
        const isRecipient = userId !== senderId;
        return {
          ...c,
          lastMessage: text.trim(),
          lastMessageTime: msg.timestamp,
          unreadCount: isRecipient ? (c.unreadCount || 0) + 1 : c.unreadCount,
        };
      });
    }
    saveConversations(allConvs);

    return msg;
  }

  markAsRead(conversationId: string, userId: string) {
    const allMsgs = loadMessages();
    if (allMsgs[conversationId]) {
      allMsgs[conversationId] = allMsgs[conversationId].map((m) =>
        m.senderId !== userId ? { ...m, read: true } : m,
      );
      saveMessages(allMsgs);
    }

    const allConvs = loadConversations();
    if (allConvs[userId]) {
      allConvs[userId] = allConvs[userId].map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      );
      saveConversations(allConvs);
    }
  }

  clearAll() {
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(MESSAGES_KEY);
  }
}

export const chatService = new ChatService();
