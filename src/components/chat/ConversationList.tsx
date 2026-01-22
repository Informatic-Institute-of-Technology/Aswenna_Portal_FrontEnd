import type { Conversation } from '@/types/chat.types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  currentUserId: string;
}

const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) => {
  
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'investor': return 'investor';
      case 'farmer': return 'farmer';
      case 'landowner': return 'landowner';
      case 'super_admin': return 'admin';
      default: return 'admin';
    }
  };

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false });
    } catch {
      return '';
    }
  };

  return (
    <div className="conversation-list">
      {conversations.length === 0 ? (
        <div className="empty-conversations">
          <p>No conversations yet</p>
          <span>Start chatting with users</span>
        </div>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${
              selectedConversationId === conversation.id ? 'active' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="conversation-avatar">
              {conversation.participant.profileImage ? (
                <img src={conversation.participant.profileImage} alt={conversation.participant.name} />
              ) : (
                <div className="avatar-placeholder">
                  {conversation.participant.name.charAt(0).toUpperCase()}
                </div>
              )}
              {conversation.participant.isOnline && (
                <span className="online-indicator"></span>
              )}
            </div>
            
            <div className="conversation-content">
              <div className="conversation-header">
                <div className="participant-info">
                  <span className="participant-name">{conversation.participant.name}</span>
                  <span className={`role-badge ${getRoleBadgeColor(conversation.participant.role)}`}>
                    {conversation.participant.role}
                  </span>
                </div>
                {conversation.lastMessage && (
                  <span className="message-time">
                    {formatTime(conversation.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              
              <div className="conversation-preview">
                {conversation.lastMessage ? (
                  <>
                    <p className="last-message">
                      {conversation.lastMessage.senderId === currentUserId && 'You: '}
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-badge">{conversation.unreadCount}</span>
                    )}
                  </>
                ) : (
                  <p className="no-messages">No messages yet</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConversationList;
