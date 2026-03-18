import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthClientError } from "@/services/authClient";
import { chatApi } from "@/services/chatApi.service";
import { chatSocket } from "@/services/chatSocket.service";
import type {
  Conversation,
  ConversationMemberRole,
  Message,
} from "@/types/chat.types";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface UseChatStoreOptions {
  currentUserId: string;
  onUnauthorized?: () => void;
  onError?: (message: string) => void;
}

interface UseChatStoreResult {
  conversations: Conversation[];
  activeConversationId: string | null;
  messagesByConversationId: Record<string, Message[]>;
  typingByConversationId: Record<string, string[]>;
  connectionStatus: ConnectionStatus;
  loadingConversations: boolean;
  loadingMessages: boolean;
  loadConversations: () => Promise<void>;
  openDirectConversation: (peerUserId: string) => Promise<string | null>;
  setActiveConversation: (conversationId: string | null) => Promise<void>;
  sendTextMessage: (content: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  markRead: (messageIds?: string[]) => void;
  createGroupConversation: (
    name: string,
    memberIds: string[],
  ) => Promise<string | null>;
  addGroupMember: (
    conversationId: string,
    userId: string,
    role?: ConversationMemberRole,
  ) => Promise<void>;
  removeGroupMember: (conversationId: string, userId: string) => Promise<void>;
  refreshActiveMessages: () => Promise<void>;
}

const optimisticId = () =>
  `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const toStatusAndMessage = (
  error: unknown,
): { status: number; message: string } => {
  if (error instanceof AuthClientError) {
    return { status: error.status, message: error.message };
  }

  if (error instanceof Error) {
    return { status: 0, message: error.message };
  }

  return { status: 0, message: "Unknown error" };
};

const mapUiError = (status: number, message: string): string => {
  if (status === 401) return "Session expired. Please sign in again.";
  if (status === 403) return "No access";
  if (status === 404) return "Resource not found. Refreshing list...";
  if (status === 400) return message;
  return message || "Something went wrong";
};

const sortConversations = (list: Conversation[]): Conversation[] =>
  [...list].sort((a, b) => {
    const aTs = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
    const bTs = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
    return bTs - aTs;
  });

const upsertConversation = (
  list: Conversation[],
  updated: Conversation,
): Conversation[] => {
  const next = list.some((item) => item._id === updated._id)
    ? list.map((item) => (item._id === updated._id ? updated : item))
    : [updated, ...list];
  return sortConversations(next);
};

const normalizeMessage = (message: Message): Message => ({
  ...message,
  readBy: Array.isArray(message.readBy) ? message.readBy : [],
});

const reconcileOptimistic = (
  messages: Message[],
  incoming: Message,
  currentUserId: string,
): Message[] => {
  const normalizedIncoming = normalizeMessage(incoming);

  const optimisticIndex = messages.findIndex(
    (item) =>
      item.status === "sending" &&
      item.senderId === currentUserId &&
      item.content === normalizedIncoming.content,
  );

  if (optimisticIndex >= 0) {
    const next = [...messages];
    next[optimisticIndex] = { ...normalizedIncoming, status: "sent" };
    return next;
  }

  const exists = messages.some((item) => item._id === normalizedIncoming._id);
  if (exists) return messages;

  return [...messages, { ...normalizedIncoming, status: "sent" }];
};

export const useChatStore = ({
  currentUserId,
  onUnauthorized,
  onError,
}: UseChatStoreOptions): UseChatStoreResult => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messagesByConversationId, setMessagesByConversationId] = useState<
    Record<string, Message[]>
  >({});
  const [typingByConversationId, setTypingByConversationId] = useState<
    Record<string, string[]>
  >({});
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeConversationRef = useRef<string | null>(null);

  const handleError = useCallback(
    (error: unknown) => {
      const { status, message } = toStatusAndMessage(error);
      const mappedMessage = mapUiError(status, message);

      if (status === 401) {
        onUnauthorized?.();
      }

      onError?.(mappedMessage);
    },
    [onError, onUnauthorized],
  );

  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;

    setLoadingConversations(true);
    try {
      const [meConversations, userConversations] = await Promise.all([
        chatApi.listMyConversations(1, 20),
        chatApi.listConversationsByUser(currentUserId, 1, 20),
      ]);

      const merged = [...meConversations.items];
      userConversations.items.forEach((conversation) => {
        if (!merged.some((item) => item._id === conversation._id)) {
          merged.push(conversation);
        }
      });

      setConversations(sortConversations(merged));
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingConversations(false);
    }
  }, [currentUserId, handleError]);

  const refreshMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;
      setLoadingMessages(true);
      try {
        const response = await chatApi.getMessages(conversationId, 1, 50);
        const sorted = [...response.items]
          .map(normalizeMessage)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

        setMessagesByConversationId((prev) => ({
          ...prev,
          [conversationId]: sorted,
        }));
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingMessages(false);
      }
    },
    [handleError],
  );

  const ensureConnected = useCallback(async () => {
    if (chatSocket.connected) {
      setConnectionStatus("connected");
      return;
    }

    setConnectionStatus("connecting");
    try {
      await chatSocket.connect();
      setConnectionStatus("connected");
    } catch (error) {
      setConnectionStatus("error");
      handleError(error);
    }
  }, [handleError]);

  const setActiveConversation = useCallback(
    async (conversationId: string | null) => {
      const previous = activeConversationRef.current;

      if (previous && previous !== conversationId) {
        chatSocket.leaveConversation(previous);
      }

      setActiveConversationId(conversationId);
      activeConversationRef.current = conversationId;

      if (!conversationId) return;

      await refreshMessages(conversationId);
      chatSocket.joinConversation(conversationId);
      chatSocket.messageRead(conversationId);
    },
    [refreshMessages],
  );

  const openDirectConversation = useCallback(
    async (peerUserId: string): Promise<string | null> => {
      try {
        const conversation = await chatApi.createDirectConversation(peerUserId);
        setConversations((prev) => upsertConversation(prev, conversation));
        await setActiveConversation(conversation._id);
        return conversation._id;
      } catch (error) {
        handleError(error);
        return null;
      }
    },
    [handleError, setActiveConversation],
  );

  const refreshActiveMessages = useCallback(async () => {
    if (!activeConversationRef.current) return;
    await refreshMessages(activeConversationRef.current);
  }, [refreshMessages]);

  const sendTextMessage = useCallback(
    async (content: string) => {
      const conversationId = activeConversationRef.current;
      if (!conversationId || !content.trim()) return;

      const tempMessage: Message = {
        _id: optimisticId(),
        conversationId,
        senderId: currentUserId,
        content: content.trim(),
        type: "text",
        createdAt: new Date().toISOString(),
        readBy: [currentUserId],
        status: "sending",
      };

      setMessagesByConversationId((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), tempMessage],
      }));

      setConversations((prev) =>
        sortConversations(
          prev.map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  lastMessageText: tempMessage.content,
                  lastMessageAt: tempMessage.createdAt,
                }
              : conversation,
          ),
        ),
      );

      try {
        if (chatSocket.connected) {
          chatSocket.sendMessage(conversationId, tempMessage.content, "text");
        } else {
          const sent = await chatApi.sendMessage(
            conversationId,
            tempMessage.content,
            "text",
          );
          setMessagesByConversationId((prev) => ({
            ...prev,
            [conversationId]: reconcileOptimistic(
              prev[conversationId] || [],
              sent,
              currentUserId,
            ),
          }));
        }
      } catch (error) {
        setMessagesByConversationId((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((message) =>
            message._id === tempMessage._id
              ? { ...message, status: "failed" }
              : message,
          ),
        }));
        handleError(error);
      }
    },
    [currentUserId, handleError],
  );

  const setTyping = useCallback((isTyping: boolean) => {
    const conversationId = activeConversationRef.current;
    if (!conversationId || !chatSocket.connected) return;

    if (isTyping) {
      chatSocket.typingStart(conversationId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        chatSocket.typingStop(conversationId);
      }, 800);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    chatSocket.typingStop(conversationId);
  }, []);

  const markRead = useCallback(
    (messageIds?: string[]) => {
      const conversationId = activeConversationRef.current;
      if (!conversationId) return;

      chatSocket.messageRead(conversationId, messageIds);

      setMessagesByConversationId((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((message) => {
          const readBy = Array.isArray(message.readBy) ? message.readBy : [];

          const shouldMark =
            !messageIds ||
            messageIds.length === 0 ||
            messageIds.includes(message._id);

          if (!shouldMark) return message;
          if (readBy.includes(currentUserId)) return { ...message, readBy };

          return {
            ...message,
            readBy: [...readBy, currentUserId],
          };
        }),
      }));
    },
    [currentUserId],
  );

  const createGroupConversation = useCallback(
    async (name: string, memberIds: string[]): Promise<string | null> => {
      try {
        const conversation = await chatApi.createGroupConversation(
          name,
          memberIds,
        );
        setConversations((prev) => upsertConversation(prev, conversation));
        await setActiveConversation(conversation._id);
        return conversation._id;
      } catch (error) {
        handleError(error);
        return null;
      }
    },
    [handleError, setActiveConversation],
  );

  const addGroupMember = useCallback(
    async (
      conversationId: string,
      userId: string,
      role: ConversationMemberRole = "member",
    ) => {
      try {
        const updated = await chatApi.addConversationMember(
          conversationId,
          userId,
          role,
        );
        setConversations((prev) => upsertConversation(prev, updated));
      } catch (error) {
        handleError(error);
      }
    },
    [handleError],
  );

  const removeGroupMember = useCallback(
    async (conversationId: string, userId: string) => {
      try {
        const updated = await chatApi.removeConversationMember(
          conversationId,
          userId,
        );
        setConversations((prev) => upsertConversation(prev, updated));
      } catch (error) {
        handleError(error);
      }
    },
    [handleError],
  );

  useEffect(() => {
    if (!currentUserId) return;

    ensureConnected();
    loadConversations();

    const offNew = chatSocket.on("message:new", (message) => {
      setMessagesByConversationId((prev) => ({
        ...prev,
        [message.conversationId]: reconcileOptimistic(
          prev[message.conversationId] || [],
          message,
          currentUserId,
        ),
      }));

      setConversations((prev) =>
        sortConversations(
          prev.map((conversation) =>
            conversation._id === message.conversationId
              ? {
                  ...conversation,
                  lastMessageText: message.content,
                  lastMessageAt: message.createdAt,
                }
              : conversation,
          ),
        ),
      );
    });

    const offSent = chatSocket.on("message:sent", (message) => {
      setMessagesByConversationId((prev) => ({
        ...prev,
        [message.conversationId]: reconcileOptimistic(
          prev[message.conversationId] || [],
          message,
          currentUserId,
        ),
      }));
    });

    const offTyping = chatSocket.on("typing:update", (payload) => {
      setTypingByConversationId((prev) => {
        const current = prev[payload.conversationId] || [];
        if (payload.isTyping) {
          if (current.includes(payload.userId)) return prev;
          return {
            ...prev,
            [payload.conversationId]: [...current, payload.userId],
          };
        }

        return {
          ...prev,
          [payload.conversationId]: current.filter(
            (id) => id !== payload.userId,
          ),
        };
      });
    });

    const offRead = chatSocket.on("message:read", (payload) => {
      const ids = payload.messageIds || [];
      if (ids.length === 0) return;

      setMessagesByConversationId((prev) => ({
        ...prev,
        [payload.conversationId]: (prev[payload.conversationId] || []).map(
          (message) =>
            ids.includes(message._id)
              ? {
                  ...message,
                  readBy: (Array.isArray(message.readBy)
                    ? message.readBy
                    : []
                  ).includes(currentUserId)
                    ? Array.isArray(message.readBy)
                      ? message.readBy
                      : []
                    : [
                        ...(Array.isArray(message.readBy)
                          ? message.readBy
                          : []),
                        currentUserId,
                      ],
                }
              : message,
        ),
      }));
    });

    return () => {
      offNew();
      offSent();
      offTyping();
      offRead();
      chatSocket.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentUserId, ensureConnected, loadConversations]);

  const stableTypingByConversationId = useMemo(
    () => typingByConversationId,
    [typingByConversationId],
  );

  return {
    conversations,
    activeConversationId,
    messagesByConversationId,
    typingByConversationId: stableTypingByConversationId,
    connectionStatus,
    loadingConversations,
    loadingMessages,
    loadConversations,
    openDirectConversation,
    setActiveConversation,
    sendTextMessage,
    setTyping,
    markRead,
    createGroupConversation,
    addGroupMember,
    removeGroupMember,
    refreshActiveMessages,
  };
};
