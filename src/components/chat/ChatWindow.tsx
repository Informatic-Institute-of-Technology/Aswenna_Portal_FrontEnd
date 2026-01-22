import type { Conversation, Message } from '@/types/chat.types';
import { ArrowLeft, Paperclip, Printer, Send, Star, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  typingStatus?: { userId: string; isTyping: boolean };
}

const ChatWindow = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  typingStatus,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    
    onSendMessage(messageInput.trim());
    setMessageInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'investor': return 'investor';
      case 'farmer': return 'farmer';
      case 'landowner': return 'landowner';
      default: return 'admin';
    }
  };

  if (!conversation) {
    return (
      <div className="chat-window-empty">
        <div className="empty-state">
          <Send size={64} />
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="participant-avatar">
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
          <div className="participant-details">
            <h3>{conversation.participant.name}</h3>
            <span className={`role-badge ${getRoleBadgeColor(conversation.participant.role)}`}>
              {conversation.participant.role}
            </span>
          </div>
        </div>
        
        <div className="chat-header-actions">
          <button className="icon-button" title="Print">
            <Printer size={20} />
          </button>
          <button className="icon-button" title="Favorite">
            <Star size={20} />
          </button>
          <button className="icon-button" title="Delete">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                senderName={conversation.participant.name}
                senderImage={conversation.participant.profileImage}
              />
            );
          })}
          {typingStatus?.isTyping && typingStatus.userId === conversation.participant.id && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <button className="icon-button attachment-button">
          <Paperclip size={20} />
        </button>
        
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Write message"
          value={messageInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        
        <button 
          className="send-button"
          onClick={handleSend}
          disabled={!messageInput.trim()}
        >
          <Send size={20} />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
