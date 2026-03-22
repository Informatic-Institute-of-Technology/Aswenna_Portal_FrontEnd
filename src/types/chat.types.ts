export type ConversationKind = "direct" | "group";

export type ConversationMemberRole = "owner" | "admin" | "member";

export interface ConversationMember {
  userId:
    | string
    | {
        _id?: string;
        fullName?: string;
        email?: string;
        personalInfo?: {
          profilePicture?:
            | string
            | {
                filename?: string;
                url?: string;
              }
            | null;
        };
      };
  role?: ConversationMemberRole;
  joinedAt?: string;
  user?: {
    _id?: string;
    fullName?: string;
    email?: string;
  };
}

export interface Conversation {
  _id: string;
  type: ConversationKind;
  name?: string;
  members: ConversationMember[];
  lastMessageText?: string;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId:
    | string
    | {
        _id?: string;
        fullName?: string;
        email?: string;
      };
  content: string;
  type: "text" | string;
  createdAt: string;
  readBy: Array<
    | string
    | {
        userId:
          | string
          | {
              _id?: string;
            };
        readAt?: string;
      }
  >;
  clientTempId?: string;
  status?: "sending" | "sent" | "failed";
}

export interface Paginated<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
}

export interface ChatApiError {
  status: number;
  message: string;
}
