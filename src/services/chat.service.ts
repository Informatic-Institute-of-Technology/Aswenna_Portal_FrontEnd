import type {
    ChatUser,
    Conversation,
    ConversationResponse,
    Message,
    MessageResponse,
    SendMessageRequest,
    UserSearchParams,
    UserSearchResponse,
} from '@/types/chat.types';
import { httpClient } from './httpClient';

class ChatService {
  private readonly BASE_PATH = '/chat';

  // Get all conversations for the current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await httpClient.get<ConversationResponse>(`${this.BASE_PATH}/conversations`);
      return response.conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Get conversation with a specific user
  async getConversation(userId: string): Promise<Conversation | null> {
    try {
      const response = await httpClient.get<Conversation>(`${this.BASE_PATH}/conversations/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  }

  // Get messages for a specific conversation
  async getMessages(conversationId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    try {
      const response = await httpClient.get<MessageResponse>(
        `${this.BASE_PATH}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return response.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a message (via REST API as backup or initial send)
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      const response = await httpClient.post<Message>(`${this.BASE_PATH}/messages`, data);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    try {
      await httpClient.post(`${this.BASE_PATH}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Mark all messages in a conversation as read
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await httpClient.post(`${this.BASE_PATH}/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }

  // Search users (Super Admin feature)
  async searchUsers(params: UserSearchParams): Promise<ChatUser[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('query', params.query);
      if (params.role) queryParams.append('role', params.role);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await httpClient.get<UserSearchResponse>(
        `${this.BASE_PATH}/users/search?${queryParams.toString()}`
      );
      return response.users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get or create a conversation with a user
  async getOrCreateConversation(userId: string): Promise<Conversation> {
    try {
      const response = await httpClient.post<Conversation>(`${this.BASE_PATH}/conversations`, {
        participantId: userId,
      });
      return response;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await httpClient.delete(`${this.BASE_PATH}/conversations/${conversationId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
