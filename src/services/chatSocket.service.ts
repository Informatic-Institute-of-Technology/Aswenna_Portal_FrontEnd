import { config } from "@/core/config";
import type { Message } from "@/types/chat.types";
import { io, type Socket } from "socket.io-client";
import { authClient } from "./authClient";

export interface TypingUpdatePayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface MessageReadPayload {
  conversationId: string;
  messageIds?: string[];
  userId?: string;
}

export interface ConversationSyncPayload {
  action: "created" | "deleted";
  conversationId: string;
}

type ServerEvents = {
  "conversation:joined": (payload: { conversationId: string }) => void;
  "conversation:left": (payload: { conversationId: string }) => void;
  "conversation:sync": (payload: ConversationSyncPayload) => void;
  "message:new": (payload: Message) => void;
  "message:sent": (payload: Message) => void;
  "typing:update": (payload: TypingUpdatePayload) => void;
  "message:read": (payload: MessageReadPayload) => void;
  "message:read:ack": (payload: MessageReadPayload) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
};

const toSocketBaseUrl = (apiBaseUrl: string): string =>
  apiBaseUrl.replace(/\/api\/?$/, "");

class ChatSocketService {
  private socket: Socket | null = null;

  private handlers: Partial<
    Record<keyof ServerEvents, Set<(payload: unknown) => void>>
  > = {};

  get connected(): boolean {
    return !!this.socket?.connected;
  }

  async connect(): Promise<void> {
    if (this.socket?.connected) return;

    const authorizationHeader = await authClient.getAuthorizationHeader();
    const rawToken = await authClient.getRawToken();

    if (!authorizationHeader || !rawToken) {
      throw new Error("Authentication token is missing");
    }

    const socketBaseUrl = toSocketBaseUrl(config.api.baseUrl);

    this.socket = io(`${socketBaseUrl}/chat`, {
      transports: ["websocket", "polling"],
      auth: {
        token: rawToken,
      },
      extraHeaders: {
        Authorization: authorizationHeader,
      },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.bindCoreListeners();

    await new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket initialization failed"));
        return;
      }

      const onConnect = () => {
        this.socket?.off("connect_error", onError);
        resolve();
      };

      const onError = (err: Error) => {
        this.socket?.off("connect", onConnect);
        reject(err);
      };

      this.socket.once("connect", onConnect);
      this.socket.once("connect_error", onError);
    });
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }

  private bindCoreListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => this.emitLocal("connect", undefined));
    this.socket.on("disconnect", () => this.emitLocal("disconnect", undefined));
    this.socket.io.on("reconnect", () =>
      this.emitLocal("reconnect", undefined),
    );

    this.socket.on(
      "conversation:joined",
      (payload: { conversationId: string }) =>
        this.emitLocal("conversation:joined", payload),
    );
    this.socket.on("conversation:left", (payload: { conversationId: string }) =>
      this.emitLocal("conversation:left", payload),
    );
    this.socket.on("conversation:sync", (payload: ConversationSyncPayload) =>
      this.emitLocal("conversation:sync", payload),
    );
    this.socket.on("message:new", (payload: Message) =>
      this.emitLocal("message:new", payload),
    );
    this.socket.on("message:sent", (payload: Message) =>
      this.emitLocal("message:sent", payload),
    );
    this.socket.on("typing:update", (payload: TypingUpdatePayload) =>
      this.emitLocal("typing:update", payload),
    );
    this.socket.on("message:read", (payload: MessageReadPayload) =>
      this.emitLocal("message:read", payload),
    );
    this.socket.on("message:read:ack", (payload: MessageReadPayload) =>
      this.emitLocal("message:read:ack", payload),
    );
  }

  private emitLocal<K extends keyof ServerEvents>(
    event: K,
    payload: Parameters<ServerEvents[K]>[0],
  ): void {
    const listeners = this.handlers[event];
    if (!listeners) return;
    listeners.forEach((handler) => handler(payload));
  }

  on<K extends keyof ServerEvents>(
    event: K,
    handler: ServerEvents[K],
  ): () => void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }
    this.handlers[event]?.add(handler as (payload: unknown) => void);

    return () => {
      this.handlers[event]?.delete(handler as (payload: unknown) => void);
    };
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit("conversation:join", { conversationId });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit("conversation:leave", { conversationId });
  }

  sendMessage(
    conversationId: string,
    content: string,
    type: string = "text",
  ): void {
    this.socket?.emit("message:send", {
      conversationId,
      content,
      type,
    });
  }

  typingStart(conversationId: string): void {
    this.socket?.emit("typing:start", { conversationId });
  }

  typingStop(conversationId: string): void {
    this.socket?.emit("typing:stop", { conversationId });
  }

  messageRead(conversationId: string, messageIds?: string[]): void {
    this.socket?.emit("message:read", { conversationId, messageIds });
  }
}

export const chatSocket = new ChatSocketService();
