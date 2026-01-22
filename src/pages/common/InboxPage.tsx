import ChatWindow from '@/components/chat/ChatWindow';
import ConversationList from '@/components/chat/ConversationList';
import UserSearchModal from '@/components/chat/UserSearchModal';
import { useAuth } from '@/Context';
import DashboardLayout from '@/layouts/DashboardLayout';
import { chatService, webSocketService } from '@/services';
import '@/styles/Inbox.css';
import type { ChatUser, Conversation, Message, UserRole } from '@/types/chat.types';
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const InboxPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [typingStatus, setTypingStatus] = useState<{ userId: string; isTyping: boolean } | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize WebSocket connection
  useEffect(() => {
    if (user?.id) {
      webSocketService.connect(user.id);

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [user?.id]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
      
      // Mark conversation as read
      await chatService.markConversationAsRead(conversationId);
      
      // Update unread count in conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id, loadMessages]);

  // WebSocket event listeners
  useEffect(() => {
    const unsubscribeMessage = webSocketService.onMessageReceived((message) => {
      // Add message to current chat if it's the active conversation
      if (selectedConversation?.id === message.conversationId) {
        setMessages(prev => [...prev, message]);
        chatService.markAsRead(message.id);
      }
      
      // Update conversation list
      loadConversations();
    });

    const unsubscribeStatus = webSocketService.onUserStatusChange(({ userId, isOnline }) => {
      setConversations(prev =>
        prev.map(conv =>
          conv.participant.id === userId
            ? { ...conv, participant: { ...conv.participant, isOnline } }
            : conv
        )
      );
      
      if (selectedConversation?.participant.id === userId) {
        setSelectedConversation(prev => 
          prev ? { ...prev, participant: { ...prev.participant, isOnline } } : null
        );
      }
    });

    const unsubscribeTyping = webSocketService.onTypingStatusChange((data) => {
      if (selectedConversation?.participant.id === data.userId) {
        setTypingStatus(data);
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      unsubscribeTyping();
    };
  }, [selectedConversation, loadConversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !user) return;

    const messageData = {
      receiverId: selectedConversation.participant.id,
      content,
    };

    // Send via WebSocket
    webSocketService.sendMessage(messageData);

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      receiverId: selectedConversation.participant.id,
      content,
      timestamp: new Date(),
      status: 'sent',
      isRead: false,
    };

    setMessages(prev => [...prev, optimisticMessage]);
  };

  const handleSearchUsers = async (query: string, role?: UserRole): Promise<ChatUser[]> => {
    try {
      const users = await chatService.searchUsers({ query, role });
      return users;
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  };

  const handleSelectUser = async (user: ChatUser) => {
    try {
      // Get or create conversation with the selected user
      const conversation = await chatService.getOrCreateConversation(user.id);
      
      // Add to conversations list if new
      setConversations(prev => {
        const exists = prev.find(c => c.id === conversation.id);
        return exists ? prev : [conversation, ...prev];
      });
      
      // Select the conversation
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <DashboardLayout>
      <div className="inbox-container">
        {/* Left Sidebar - Conversations */}
        <div className="inbox-sidebar">
          <div className="inbox-sidebar-header">
            <h2 className="inbox-title">Inbox</h2>
            {totalUnread > 0 && (
              <span className="total-unread-badge">{totalUnread}</span>
            )}
          </div>

          {/* Active Users (Optional - can be implemented later) */}
          <div className="active-users">
            <h3>Active</h3>
            <div className="active-users-list">
              {conversations
                .filter(c => c.participant.isOnline)
                .slice(0, 6)
                .map(conv => (
                  <div key={conv.id} className="active-user-avatar" title={conv.participant.name}>
                    {conv.participant.profileImage ? (
                      <img src={conv.participant.profileImage} alt={conv.participant.name} />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {conv.participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="online-dot"></span>
                  </div>
                ))}
            </div>
          </div>

          {/* Messages Section */}
          <div className="messages-section">
            <div className="messages-header">
              <h3>Messages</h3>
              <span className="message-count">{conversations.length}</span>
            </div>

            {/* Search Bar */}
            <div className="conversation-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* New Chat Button (Super Admin only) */}
            {isSuperAdmin && (
              <button 
                className="new-chat-button"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Plus size={18} />
                New Chat
              </button>
            )}

            {/* Conversation List */}
            {isLoading ? (
              <div className="loading-state">Loading conversations...</div>
            ) : (
              <ConversationList
                conversations={filteredConversations}
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
                currentUserId={user?.id || ''}
              />
            )}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="inbox-main">
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={user?.id || ''}
            onSendMessage={handleSendMessage}
            typingStatus={typingStatus}
          />
        </div>

        {/* User Search Modal (Super Admin only) */}
        {isSuperAdmin && (
          <UserSearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSelectUser={handleSelectUser}
            onSearch={handleSearchUsers}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
