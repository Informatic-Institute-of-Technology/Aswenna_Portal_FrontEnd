import { authClient } from "./authClient";
import type {
  Conversation,
  ConversationMemberRole,
  Message,
  Paginated,
} from "@/types/chat.types";

interface PaginationLike {
  page?: number;
  limit?: number;
  total?: number;
  totalDocs?: number;
  totalPages?: number;
}

interface PaginatedApiShape<T> {
  items?: T[];
  data?: T[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  pagination?: PaginationLike;
}

const toPaginated = <T>(
  response: PaginatedApiShape<T>,
  fallbackPage: number,
  fallbackLimit: number,
): Paginated<T> => {
  const pagination = response.pagination;
  const items = response.items ?? response.data ?? [];
  const page = response.page ?? pagination?.page ?? fallbackPage;
  const limit = response.limit ?? pagination?.limit ?? fallbackLimit;
  const total =
    response.total ??
    pagination?.total ??
    pagination?.totalDocs ??
    items.length;
  const totalPages = response.totalPages ?? pagination?.totalPages ?? 1;

  return {
    page,
    limit,
    total,
    totalPages,
    items,
  };
};

const toConversation = (payload: unknown): Conversation =>
  payload as Conversation;
const toMessage = (payload: unknown): Message => payload as Message;

class ChatApiService {
  async createDirectConversation(peerUserId: string): Promise<Conversation> {
    const response = await authClient.post<
      { data?: Conversation } | Conversation
    >("/v1/conversations/direct", { peerUserId });
    return toConversation(
      (response as { data?: Conversation }).data ?? response,
    );
  }

  async createGroupConversation(
    name: string,
    memberIds: string[],
  ): Promise<Conversation> {
    const response = await authClient.post<
      { data?: Conversation } | Conversation
    >("/v1/conversations/group", { name, memberIds });
    return toConversation(
      (response as { data?: Conversation }).data ?? response,
    );
  }

  async listMyConversations(
    page: number = 1,
    limit: number = 20,
  ): Promise<Paginated<Conversation>> {
    const response = await authClient.get<PaginatedApiShape<Conversation>>(
      `/v1/conversations/me?page=${page}&limit=${limit}`,
    );
    return toPaginated(response, page, limit);
  }

  async listConversationsByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<Paginated<Conversation>> {
    const response = await authClient.get<PaginatedApiShape<Conversation>>(
      `/v1/conversations/user/${userId}?page=${page}&limit=${limit}`,
    );
    return toPaginated(response, page, limit);
  }

  async addConversationMember(
    conversationId: string,
    userId: string,
    role: ConversationMemberRole = "member",
  ): Promise<Conversation> {
    const response = await authClient.post<
      { data?: Conversation } | Conversation
    >(`/v1/conversations/${conversationId}/members`, { userId, role });
    return toConversation(
      (response as { data?: Conversation }).data ?? response,
    );
  }

  async removeConversationMember(
    conversationId: string,
    memberUserId: string,
  ): Promise<Conversation> {
    const response = await authClient.delete<
      { data?: Conversation } | Conversation
    >(`/v1/conversations/${conversationId}/members/${memberUserId}`);
    return toConversation(
      (response as { data?: Conversation }).data ?? response,
    );
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await authClient.delete<unknown>(`/v1/conversations/${conversationId}`);
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<Paginated<Message>> {
    const response = await authClient.get<PaginatedApiShape<Message>>(
      `/v1/messages/${conversationId}?page=${page}&limit=${limit}`,
    );
    return toPaginated(response, page, limit);
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: string = "text",
  ): Promise<Message> {
    const response = await authClient.post<{ data?: Message } | Message>(
      "/v1/messages",
      { conversationId, content, type },
    );
    return toMessage((response as { data?: Message }).data ?? response);
  }
}

export const chatApi = new ChatApiService();
