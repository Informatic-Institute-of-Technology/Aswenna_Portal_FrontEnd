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
  hasMoreConversations: boolean;
  loadingMessages: boolean;
  loadConversations: () => Promise<void>;
  loadMoreConversations: () => Promise<void>;
  openDirectConversation: (peerUserId: string) => Promise<string | null>;
  setActiveConversation: (conversationId: string | null) => Promise<void>;
  sendTextMessage: (content: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  markRead: (messageIds?: string[]) => void;
  createGroupConversation: (
    name: string,
    memberIds: string[],
  ) => Promise<string | null>;
  deleteConversation: (conversationId: string) => Promise<void>;
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

const getMessageSenderId = (senderId: Message["senderId"]): string => {
  if (typeof senderId === "string") return senderId;
  return senderId?._id || "";
};

const getReadByUserIds = (readBy: Message["readBy"]): string[] => {
  if (!Array.isArray(readBy)) return [];

  return readBy
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (!entry || typeof entry !== "object") return "";

      const userId = entry.userId;
      if (typeof userId === "string") return userId;
      return userId?._id || "";
    })
    .filter((id): id is string => !!id);
};

const resolveMessageTimestamp = (message: Message): string => {
  const createdAt =
    typeof message.createdAt === "string" ? message.createdAt : "";

  if (createdAt) {
    const createdAtDate = new Date(createdAt);
    if (!Number.isNaN(createdAtDate.getTime())) {
      return createdAtDate.toISOString();
    }
  }

  const updatedAt = (message as { updatedAt?: string }).updatedAt;
  if (typeof updatedAt === "string" && updatedAt) {
    const updatedAtDate = new Date(updatedAt);
    if (!Number.isNaN(updatedAtDate.getTime())) {
      return updatedAtDate.toISOString();
    }
  }

  return new Date().toISOString();
};

const normalizeMessage = (message: Message): Message => ({
  ...message,
  senderId: getMessageSenderId(message.senderId),
  content: typeof message.content === "string" ? message.content : "",
  readBy: getReadByUserIds(message.readBy),
  createdAt: resolveMessageTimestamp(message),
});

const shouldIgnoreIncomingMessage = (message: Message): boolean => {
  if (!message._id || !message.conversationId) return true;
  if (message.type === "text" && !message.content.trim()) return true;
  return false;
};

const reconcileOptimistic = (
  messages: Message[],
  incoming: Message,
  currentUserId: string,
): Message[] => {
  const normalizedIncoming = normalizeMessage(incoming);

  const optimisticIndex = messages.findIndex(
    (item) =>
      item.status === "sending" &&
      getMessageSenderId(item.senderId) === currentUserId &&
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
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [conversationPage, setConversationPage] = useState(1);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeConversationRef = useRef<string | null>(null);
  const initializedUserRef = useRef<string | null>(null);

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
      const meConversations = await chatApi.listMyConversations(1, 20);

      setConversations(sortConversations(meConversations.items));
      setConversationPage(1);
      setHasMoreConversations(
        meConversations.page < meConversations.totalPages,
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingConversations(false);
    }
  }, [currentUserId, handleError]);

  const loadMoreConversations = useCallback(async () => {
    if (!currentUserId || loadingConversations || !hasMoreConversations) return;

    setLoadingConversations(true);
    try {
      const nextPage = conversationPage + 1;
      const nextConversations = await chatApi.listMyConversations(nextPage, 20);

      setConversations((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const appended = nextConversations.items.filter(
          (item) => !existingIds.has(item._id),
        );
        return sortConversations([...prev, ...appended]);
      });

      setConversationPage(nextPage);
      setHasMoreConversations(
        nextConversations.page < nextConversations.totalPages,
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingConversations(false);
    }
  }, [
    conversationPage,
    currentUserId,
    handleError,
    hasMoreConversations,
    loadingConversations,
  ]);

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
      // Socket.io will automatically keep retrying, so we show it as "connecting" in the background
      setConnectionStatus("connecting");
      // Optionally suppress the hard error dialog so it doesn't annoy the user
      console.warn(
        "Socket connection failed. Retrying in background...",
        error,
      );
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
          const readBy = getReadByUserIds(message.readBy);

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

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;

      try {
        if (activeConversationRef.current === conversationId) {
          chatSocket.leaveConversation(conversationId);
        }

        await chatApi.deleteConversation(conversationId);

        setConversations((prev) =>
          prev.filter((conversation) => conversation._id !== conversationId),
        );

        setMessagesByConversationId((prev) => {
          const next = { ...prev };
          delete next[conversationId];
          return next;
        });

        setTypingByConversationId((prev) => {
          const next = { ...prev };
          delete next[conversationId];
          return next;
        });

        if (activeConversationRef.current === conversationId) {
          activeConversationRef.current = null;
          setActiveConversationId(null);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError],
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

    if (initializedUserRef.current !== currentUserId) {
      initializedUserRef.current = currentUserId;
      ensureConnected();
      loadConversations();
    }

    const offConnect = chatSocket.on("connect", () =>
      setConnectionStatus("connected"),
    );
    const offDisconnect = chatSocket.on("disconnect", () =>
      setConnectionStatus("disconnected"),
    );
    const offReconnect = chatSocket.on("reconnect", () => {
      setConnectionStatus("connected");
      if (activeConversationRef.current) {
        chatSocket.joinConversation(activeConversationRef.current);
      }
    });

    const offNew = chatSocket.on("message:new", (message) => {
      const normalizedMessage = normalizeMessage(message);

      if (shouldIgnoreIncomingMessage(normalizedMessage)) {
        return;
      }

      setMessagesByConversationId((prev) => ({
        ...prev,
        [normalizedMessage.conversationId]: reconcileOptimistic(
          prev[normalizedMessage.conversationId] || [],
          normalizedMessage,
          currentUserId,
        ),
      }));

      setConversations((prev) =>
        sortConversations(
          prev.map((conversation) =>
            conversation._id === normalizedMessage.conversationId
              ? {
                  ...conversation,
                  lastMessageText: normalizedMessage.content,
                  lastMessageAt: normalizedMessage.createdAt,
                }
              : conversation,
          ),
        ),
      );
    });

    const offSent = chatSocket.on("message:sent", (message) => {
      const normalizedMessage = normalizeMessage(message);

      if (getMessageSenderId(normalizedMessage.senderId) !== currentUserId) {
        return;
      }

      if (shouldIgnoreIncomingMessage(normalizedMessage)) {
        console.warn("[chat][store] ignored message:sent payload", message);
        return;
      }

      setMessagesByConversationId((prev) => ({
        ...prev,
        [normalizedMessage.conversationId]: reconcileOptimistic(
          prev[normalizedMessage.conversationId] || [],
          normalizedMessage,
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

      // If backend provides the userId of who read it, use it.
      // Otherwise, infer it: if we receive 'message:read', it implies the peer read it.
      // We look up the message to see who sent it. If we sent it, and someone read it,
      // and we don't know who (group chat without userId), we just put "peer" so it turns blue.
      const fallbackReaderId = payload.userId || "peer";

      setMessagesByConversationId((prev) => ({
        ...prev,
        [payload.conversationId]: (prev[payload.conversationId] || []).map(
          (message) => {
            if (!ids.includes(message._id)) return message;

            const readBy = getReadByUserIds(message.readBy);
            if (readBy.includes(fallbackReaderId)) return message;

            return {
              ...message,
              readBy: [...message.readBy, fallbackReaderId],
            };
          },
        ),
      }));
    });

    return () => {
      offConnect();
      offDisconnect();
      offReconnect();
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
    hasMoreConversations,
    loadingMessages,
    loadConversations,
    loadMoreConversations,
    openDirectConversation,
    setActiveConversation,
    sendTextMessage,
    setTyping,
    markRead,
    createGroupConversation,
    deleteConversation,
    addGroupMember,
    removeGroupMember,
    refreshActiveMessages,
  };
};
