# Chat System Backend Implementation Guide

This guide explains how to implement the backend to support the real-time chat system for the Aswenna Portal.

## Overview

The chat system requires:
- **WebSocket Support**: Real-time bidirectional communication
- **REST API Endpoints**: User search, conversations, messages
- **Database Models**: Users, Conversations, Messages
- **Authentication**: JWT-based authentication

---

## 1. Technology Stack Options

### Option A: Node.js + Express + Socket.IO (Recommended)
- **Framework**: Express.js
- **WebSocket**: Socket.IO
- **Database**: MongoDB/PostgreSQL
- **ORM**: Mongoose/Prisma

### Option B: Spring Boot + WebSocket
- **Framework**: Spring Boot
- **WebSocket**: Spring WebSocket + STOMP
- **Database**: PostgreSQL/MySQL
- **ORM**: Spring Data JPA

---

## 2. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'SUPER_ADMIN', 'INVESTOR', 'FARMER', 'LANDOWNER'
  profile_image VARCHAR(500),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  participant_one_id UUID NOT NULL REFERENCES users(id),
  participant_two_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant_one_id, participant_two_id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_receiver (receiver_id)
);
```

---

## 3. REST API Endpoints

### Base URL: `/api/chat`

#### 3.1 Get All Conversations
```
GET /api/chat/conversations
Headers: Authorization: Bearer <token>

Response:
{
  "conversations": [
    {
      "id": "uuid",
      "participant": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "INVESTOR",
        "profileImage": "url",
        "isOnline": true
      },
      "lastMessage": {
        "id": "uuid",
        "content": "Hello!",
        "timestamp": "2026-01-22T10:30:00Z",
        "senderId": "uuid",
        "isRead": false
      },
      "unreadCount": 3,
      "updatedAt": "2026-01-22T10:30:00Z"
    }
  ],
  "total": 10
}
```

#### 3.2 Get Conversation by User ID
```
GET /api/chat/conversations/:userId
Headers: Authorization: Bearer <token>

Response: Same as 3.1 (single conversation object or null)
```

#### 3.3 Get Messages for Conversation
```
GET /api/chat/conversations/:conversationId/messages?page=1&limit=50
Headers: Authorization: Bearer <token>

Response:
{
  "messages": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "senderId": "uuid",
      "receiverId": "uuid",
      "content": "Hello!",
      "timestamp": "2026-01-22T10:30:00Z",
      "status": "delivered",
      "isRead": false
    }
  ],
  "total": 150
}
```

#### 3.4 Send Message (REST fallback)
```
POST /api/chat/messages
Headers: Authorization: Bearer <token>
Body:
{
  "receiverId": "uuid",
  "content": "Hello, how are you?"
}

Response:
{
  "id": "uuid",
  "conversationId": "uuid",
  "senderId": "uuid",
  "receiverId": "uuid",
  "content": "Hello, how are you?",
  "timestamp": "2026-01-22T10:30:00Z",
  "status": "sent",
  "isRead": false
}
```

#### 3.5 Mark Message as Read
```
POST /api/chat/messages/:messageId/read
Headers: Authorization: Bearer <token>

Response: { "success": true }
```

#### 3.6 Mark Conversation as Read
```
POST /api/chat/conversations/:conversationId/read
Headers: Authorization: Bearer <token>

Response: { "success": true }
```

#### 3.7 Search Users (Super Admin Only)
```
GET /api/chat/users/search?query=john&role=INVESTOR&page=1&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "INVESTOR",
      "profileImage": "url",
      "isOnline": true
    }
  ],
  "total": 5
}
```

#### 3.8 Get or Create Conversation
```
POST /api/chat/conversations
Headers: Authorization: Bearer <token>
Body:
{
  "participantId": "uuid"
}

Response: Conversation object (same as 3.1)
```

#### 3.9 Delete Conversation
```
DELETE /api/chat/conversations/:conversationId
Headers: Authorization: Bearer <token>

Response: { "success": true }
```

---

## 4. WebSocket Implementation

### 4.1 Connection
```javascript
// Client connects with:
socket.connect({
  auth: {
    token: "jwt_token",
    userId: "user_id"
  }
});

// Server validates and stores socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const userId = socket.handshake.auth.userId;
  
  // Verify JWT token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = userId;
    next();
  });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);
  
  // Mark user as online
  updateUserStatus(socket.userId, true);
  
  // Notify contacts about online status
  notifyContacts(socket.userId, { isOnline: true });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    updateUserStatus(socket.userId, false);
    notifyContacts(socket.userId, { isOnline: false });
  });
});
```

### 4.2 WebSocket Events

#### Client → Server

**message:send**
```javascript
socket.on('message:send', async (data) => {
  const { receiverId, content } = data;
  const senderId = socket.userId;
  
  // Save message to database
  const message = await saveMessage({
    senderId,
    receiverId,
    content
  });
  
  // Send to receiver if online
  const receiverSocket = getSocketByUserId(receiverId);
  if (receiverSocket) {
    receiverSocket.emit('message:receive', message);
    socket.emit('message:delivered', message.id);
  }
  
  // Send back to sender (for confirmation)
  socket.emit('message:receive', message);
});
```

**message:read**
```javascript
socket.on('message:read', async (messageId) => {
  await markMessageAsRead(messageId);
  
  // Notify sender
  const message = await getMessage(messageId);
  const senderSocket = getSocketByUserId(message.senderId);
  if (senderSocket) {
    senderSocket.emit('message:delivered', messageId);
  }
});
```

**typing:start**
```javascript
socket.on('typing:start', (receiverId) => {
  const receiverSocket = getSocketByUserId(receiverId);
  if (receiverSocket) {
    receiverSocket.emit('typing:status', {
      userId: socket.userId,
      isTyping: true
    });
  }
});
```

**typing:stop**
```javascript
socket.on('typing:stop', (receiverId) => {
  const receiverSocket = getSocketByUserId(receiverId);
  if (receiverSocket) {
    receiverSocket.emit('typing:status', {
      userId: socket.userId,
      isTyping: false
    });
  }
});
```

#### Server → Client

**message:receive**
```javascript
// Emitted when a new message arrives
socket.emit('message:receive', {
  id: "uuid",
  conversationId: "uuid",
  senderId: "uuid",
  receiverId: "uuid",
  content: "Hello!",
  timestamp: "2026-01-22T10:30:00Z",
  status: "sent",
  isRead: false
});
```

**message:delivered**
```javascript
// Emitted when message is delivered to recipient
socket.emit('message:delivered', "message_id");
```

**user:status**
```javascript
// Emitted when a contact goes online/offline
socket.emit('user:status', {
  userId: "uuid",
  isOnline: true
});
```

**typing:status**
```javascript
// Emitted when someone is typing
socket.emit('typing:status', {
  userId: "uuid",
  isTyping: true
});
```

---

## 5. Node.js + Socket.IO Example Implementation

### 5.1 Install Dependencies
```bash
npm install express socket.io jsonwebtoken bcrypt mongoose cors
```

### 5.2 Server Setup (server.js)
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key';
const connectedUsers = new Map(); // userId -> socketId

// WebSocket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const userId = socket.handshake.auth.userId;

  if (!token || !userId) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.userId = userId;
    next();
  });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Store socket connection
  connectedUsers.set(socket.userId, socket.id);
  
  // Mark user as online in database
  // updateUserOnlineStatus(socket.userId, true);
  
  // Notify contacts about online status
  // notifyUserContacts(socket.userId, { isOnline: true });

  // Handle message send
  socket.on('message:send', async (data) => {
    try {
      const { receiverId, content } = data;
      
      // Save message to database
      const message = {
        id: generateId(),
        conversationId: await getOrCreateConversation(socket.userId, receiverId),
        senderId: socket.userId,
        receiverId,
        content,
        timestamp: new Date(),
        status: 'sent',
        isRead: false
      };
      
      // await saveMessageToDb(message);
      
      // Send to receiver if online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message:receive', message);
        message.status = 'delivered';
        socket.emit('message:delivered', message.id);
      }
      
      // Confirm to sender
      socket.emit('message:receive', message);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle message read
  socket.on('message:read', async (messageId) => {
    // await markMessageAsReadInDb(messageId);
    
    // Notify sender
    // const message = await getMessageFromDb(messageId);
    // const senderSocketId = connectedUsers.get(message.senderId);
    // if (senderSocketId) {
    //   io.to(senderSocketId).emit('message:delivered', messageId);
    // }
  });

  // Handle typing indicators
  socket.on('typing:start', (receiverId) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing:status', {
        userId: socket.userId,
        isTyping: true
      });
    }
  });

  socket.on('typing:stop', (receiverId) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing:status', {
        userId: socket.userId,
        isTyping: false
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
    
    // Mark user as offline
    // updateUserOnlineStatus(socket.userId, false);
    // notifyUserContacts(socket.userId, { isOnline: false });
  });
});

// REST API Routes
app.get('/api/chat/conversations', authMiddleware, async (req, res) => {
  // Implementation
  res.json({ conversations: [], total: 0 });
});

app.get('/api/chat/conversations/:conversationId/messages', authMiddleware, async (req, res) => {
  // Implementation
  res.json({ messages: [], total: 0 });
});

app.post('/api/chat/messages', authMiddleware, async (req, res) => {
  // Implementation
  res.json({ success: true });
});

app.get('/api/chat/users/search', authMiddleware, async (req, res) => {
  // Implementation (Super Admin only)
  res.json({ users: [], total: 0 });
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
}

// Helper functions
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

async function getOrCreateConversation(user1Id, user2Id) {
  // Database logic to find or create conversation
  return 'conversation-id';
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 6. Security Considerations

### 6.1 Authentication
- Always validate JWT tokens on WebSocket connections
- Implement token refresh mechanism
- Use secure token storage on client

### 6.2 Authorization
- Verify user permissions before accessing conversations
- Ensure users can only access their own messages
- Super Admin search restricted by role check

### 6.3 Input Validation
- Sanitize message content to prevent XSS
- Validate message length (e.g., max 5000 characters)
- Rate limiting on message sending

### 6.4 Data Privacy
- Encrypt sensitive data at rest
- Use HTTPS/WSS in production
- Implement message deletion/expiry policies

---

## 7. Testing Checklist

- [ ] WebSocket connection establishes successfully
- [ ] Messages sent and received in real-time
- [ ] Typing indicators work correctly
- [ ] Online/offline status updates properly
- [ ] Unread count updates correctly
- [ ] Super Admin can search and initiate chats
- [ ] Non-admin users can only chat with Super Admin
- [ ] Messages persist after page reload
- [ ] Multiple tabs/devices stay synchronized
- [ ] Proper error handling for network issues

---

## 8. Deployment Notes

### Environment Variables
```env
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=your-database-url
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
```

### Production Checklist
- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Enable database backups
- [ ] Set up load balancing (if needed)
- [ ] Configure WebSocket sticky sessions

---

## 9. Future Enhancements

- File/image attachments
- Message reactions
- Voice/video calling
- Message search functionality
- Conversation archiving
- Notification system
- Read receipts
- Message editing/deletion
- Group chats (if needed)

---

## Support

For issues or questions regarding the backend implementation, refer to:
- Socket.IO documentation: https://socket.io/docs/v4/
- Express.js documentation: https://expressjs.com/
- JWT documentation: https://jwt.io/

---

**Note**: This guide provides the complete backend specification. Implement database models and business logic according to your specific requirements and infrastructure.
