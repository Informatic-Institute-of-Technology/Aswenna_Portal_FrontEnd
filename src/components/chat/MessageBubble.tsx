import type { Message } from '@/types/chat.types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderImage?: string;
}

const MessageBubble = ({ 
  message, 
  isOwn, 
  showAvatar = false,
  senderName,
  senderImage 
}: MessageBubbleProps) => {
  const formatTime = (date: Date) => {
    try {
      return format(new Date(date), 'p'); // e.g., "6:34 PM"
    } catch {
      return '';
    }
  };

  return (
    <div className={`message-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && showAvatar && (
        <div className="message-avatar">
          {senderImage ? (
            <img src={senderImage} alt={senderName} />
          ) : (
            <div className="avatar-placeholder-small">
              {senderName?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}
      
      <div className={`message-bubble ${isOwn ? 'own-message' : 'other-message'}`}>
        <div className="message-content">{message.content}</div>
        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <span className={`message-status ${message.status}`}>
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.isRead && '✓✓'}
            </span>
          )}
        </div>
      </div>
      
      {isOwn && showAvatar && <div className="message-spacer" />}
    </div>
  );
};

export default MessageBubble;
