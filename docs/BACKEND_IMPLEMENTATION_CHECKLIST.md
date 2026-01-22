# Backend Implementation Checklist

Complete implementation checklist for backend developers to build the Chat System API.

---

## Prerequisites

- [ ] Node.js v18+ installed
- [ ] MongoDB or PostgreSQL database setup
- [ ] Redis (optional, for caching and session management)
- [ ] Socket.IO library installed
- [ ] JWT authentication middleware configured
- [ ] Environment variables configured (.env file)

---

## Database Schema Design

### 1. Users Table/Collection
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('SUPER_ADMIN', 'INVESTOR', 'FARMER', 'LANDOWNER') NOT NULL,
  profile_image VARCHAR(500),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_online ON users(is_online);
```

**Why This Schema**:
- `id`: Unique identifier for each user
- `email`: Must be unique for authentication
- `role`: Determines access permissions (Super Admin can search all users)
- `is_online`: Real-time status for chat
- `last_seen`: Show when offline users were last active
- Indexes: Speed up searches by email, role, and online status

---

### 2. Conversations Table/Collection
```sql
CREATE TABLE conversations (
  id VARCHAR(50) PRIMARY KEY,
  participant1_id VARCHAR(50) NOT NULL,
  participant2_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_conversation (participant1_id, participant2_id)
);

-- Indexes for performance
CREATE INDEX idx_conv_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conv_participant2 ON conversations(participant2_id);
CREATE INDEX idx_conv_updated ON conversations(updated_at DESC);
```

**Why This Schema**:
- Two participants per conversation (Super Admin + User)
- `updated_at`: Sort conversations by recent activity
- Unique constraint: Prevent duplicate conversations between same users
- Foreign keys with CASCADE: Auto-delete conversations when user deleted
- Indexes: Fast lookup of user's conversations

---

### 3. Messages Table/Collection
```sql
CREATE TABLE messages (
  id VARCHAR(50) PRIMARY KEY,
  conversation_id VARCHAR(50) NOT NULL,
  sender_id VARCHAR(50) NOT NULL,
  receiver_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_msg_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_msg_sender ON messages(sender_id);
CREATE INDEX idx_msg_receiver ON messages(receiver_id);
CREATE INDEX idx_msg_is_read ON messages(is_read);
```

**Why This Schema**:
- `content`: TEXT type to support long messages (up to 5000 chars)
- `status`: Track delivery states (sent → delivered → read)
- `is_read`: Quick boolean check for unread messages
- Indexes: Optimize message fetching, pagination, and unread counts

---

## REST API Implementation

### Setup Express Server

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const chatRoutes = require('./routes/chat.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Routes
app.use('/api/chat', authMiddleware, chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Why These Middlewares**:
- `helmet`: Security headers to prevent common attacks
- `cors`: Allow frontend (different origin) to make requests
- `rate-limit`: Prevent API abuse and spam
- `authMiddleware`: Verify JWT token on all chat routes

---

### 1. Get All Conversations

**File**: `controllers/chat.controller.js`

```javascript
async getConversations(req, res) {
  try {
    const userId = req.user.id; // From JWT token
    
    // Query conversations where user is participant
    const conversations = await db.query(`
      SELECT 
        c.id,
        c.updated_at,
        u.id as participant_id,
        u.name as participant_name,
        u.email as participant_email,
        u.role as participant_role,
        u.profile_image as participant_image,
        u.is_online as participant_online,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.receiver_id = ? 
         AND m.is_read = FALSE) as unread_count
      FROM conversations c
      INNER JOIN users u ON (
        CASE 
          WHEN c.participant1_id = ? THEN c.participant2_id
          ELSE c.participant1_id
        END = u.id
      )
      WHERE c.participant1_id = ? OR c.participant2_id = ?
      ORDER BY c.updated_at DESC
    `, [userId, userId, userId, userId]);

    // Get last message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await db.query(`
          SELECT * FROM messages 
          WHERE conversation_id = ? 
          ORDER BY created_at DESC 
          LIMIT 1
        `, [conv.id]);

        return {
          id: conv.id,
          participant: {
            id: conv.participant_id,
            name: conv.participant_name,
            email: conv.participant_email,
            role: conv.participant_role,
            profileImage: conv.participant_image,
            isOnline: conv.participant_online
          },
          lastMessage: lastMessage[0] || null,
          unreadCount: conv.unread_count,
          updatedAt: conv.updated_at
        };
      })
    );

    res.json({
      conversations: conversationsWithMessages,
      total: conversationsWithMessages.length
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch conversations',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

**Why This Implementation**:
- Join users table to get participant details
- Subquery for efficient unread count calculation
- Sort by `updated_at` DESC to show recent conversations first
- Fetch last message separately for cleaner code
- Error handling with standardized error response

---

### 2. Get Specific Conversation

```javascript
async getConversation(req, res) {
  try {
    const userId = req.user.id;
    const { userId: participantId } = req.params;

    // Find conversation between two users
    const conversation = await db.query(`
      SELECT c.*, u.* FROM conversations c
      INNER JOIN users u ON (
        CASE 
          WHEN c.participant1_id = ? THEN c.participant2_id
          ELSE c.participant1_id
        END = u.id
      )
      WHERE (c.participant1_id = ? AND c.participant2_id = ?)
         OR (c.participant1_id = ? AND c.participant2_id = ?)
    `, [userId, userId, participantId, participantId, userId]);

    if (!conversation[0]) {
      return res.status(404).json({
        error: {
          code: 'CONVERSATION_NOT_FOUND',
          message: `No conversation exists with user ID: ${participantId}`,
          statusCode: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json(conversation[0]);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch conversation',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

**Why This Implementation**:
- Check both participant combinations (A→B and B→A)
- Return 404 if conversation doesn't exist
- Used before sending first message to check if conversation exists

---

### 3. Get Messages with Pagination

```javascript
async getMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid pagination parameters',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check if user is participant in conversation
    const userId = req.user.id;
    const conversation = await db.query(`
      SELECT * FROM conversations 
      WHERE id = ? AND (participant1_id = ? OR participant2_id = ?)
    `, [conversationId, userId, userId]);

    if (!conversation[0]) {
      return res.status(404).json({
        error: {
          code: 'CONVERSATION_NOT_FOUND',
          message: 'Conversation not found',
          statusCode: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Fetch messages with pagination
    const messages = await db.query(`
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [conversationId, limit, offset]);

    // Get total count
    const totalResult = await db.query(`
      SELECT COUNT(*) as total FROM messages 
      WHERE conversation_id = ?
    `, [conversationId]);

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      total: totalResult[0].total
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch messages',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

**Why This Implementation**:
- Pagination prevents loading thousands of messages at once
- Verify user is participant (security check)
- Limit max 100 per page to prevent abuse
- ORDER BY DESC for pagination, then reverse for chronological display
- Separate total count query for pagination UI

---

### 4. Send Message (REST)

```javascript
async sendMessage(req, res) {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Validate input
    if (!receiverId || !content) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'receiverId and content are required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      });
    }

    if (content.length === 0 || content.length > 5000) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Message content must be between 1 and 5000 characters',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check if receiver exists
    const receiver = await db.query('SELECT * FROM users WHERE id = ?', [receiverId]);
    if (!receiver[0]) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: `Receiver with ID ${receiverId} not found`,
          statusCode: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Get or create conversation
    let conversation = await db.query(`
      SELECT * FROM conversations 
      WHERE (participant1_id = ? AND participant2_id = ?)
         OR (participant1_id = ? AND participant2_id = ?)
    `, [senderId, receiverId, receiverId, senderId]);

    if (!conversation[0]) {
      const convId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.query(`
        INSERT INTO conversations (id, participant1_id, participant2_id)
        VALUES (?, ?, ?)
      `, [convId, senderId, receiverId]);
      conversation = [{ id: convId }];
    }

    // Insert message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.query(`
      INSERT INTO messages (id, conversation_id, sender_id, receiver_id, content, status)
      VALUES (?, ?, ?, ?, ?, 'sent')
    `, [messageId, conversation[0].id, senderId, receiverId, content]);

    // Update conversation timestamp
    await db.query(`
      UPDATE conversations SET updated_at = NOW() WHERE id = ?
    `, [conversation[0].id]);

    // Fetch the created message
    const message = await db.query('SELECT * FROM messages WHERE id = ?', [messageId]);

    res.status(201).json(message[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to send message',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

**Why This Implementation**:
- Validate all inputs before database operations
- Check receiver exists (prevent sending to deleted users)
- Auto-create conversation if first message
- Update conversation timestamp for sorting
- Return created message with all fields

---

### 5. Mark Message/Conversation as Read

```javascript
async markMessageAsRead(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user is receiver
    const message = await db.query(`
      SELECT * FROM messages WHERE id = ? AND receiver_id = ?
    `, [messageId, userId]);

    if (!message[0]) {
      return res.status(404).json({
        error: {
          code: 'MESSAGE_NOT_FOUND',
          message: `Message with ID ${messageId} not found`,
          statusCode: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Update message status
    await db.query(`
      UPDATE messages 
      SET is_read = TRUE, status = 'read' 
      WHERE id = ?
    `, [messageId]);

    res.json({
      success: true,
      message: 'Message marked as read',
      messageId: messageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to mark message as read',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}

async markConversationAsRead(req, res) {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is participant
    const conversation = await db.query(`
      SELECT * FROM conversations 
      WHERE id = ? AND (participant1_id = ? OR participant2_id = ?)
    `, [conversationId, userId, userId]);

    if (!conversation[0]) {
      return res.status(404).json({
        error: {
          code: 'CONVERSATION_NOT_FOUND',
          message: 'Conversation not found',
          statusCode: 404,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Mark all unread messages as read
    const result = await db.query(`
      UPDATE messages 
      SET is_read = TRUE, status = 'read' 
      WHERE conversation_id = ? 
      AND receiver_id = ? 
      AND is_read = FALSE
    `, [conversationId, userId]);

    res.json({
      success: true,
      message: 'Conversation marked as read',
      conversationId: conversationId,
      messagesUpdated: result.affectedRows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to mark conversation as read',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

**Why This Implementation**:
- Security: Verify user is the receiver before marking read
- Bulk update for conversation (efficient)
- Return affected rows count for confirmation
- Update both `is_read` and `status` fields

---

### 6. Search Users (Super Admin Only)

```javascript
async searchUsers(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is Super Admin
    if (userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'This feature is only available to Super Admin users',
          statusCode: 403,
          timestamp: new Date().toISOString()
        }
      });
    }

    const { query, role, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ['id != ?']; // Exclude self
    let params = [userId];

    if (query) {
      whereConditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${query}%`, `%${query}%`);
    }

    if (role) {
      if (!['FARMER', 'INVESTOR', 'LANDOWNER'].includes(role)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid role filter. Must be one of: FARMER, INVESTOR, LANDOWNER',
            statusCode: 400,
            timestamp: new Date().toISOString()
          }
        });
      }
      whereConditions.push('role = ?');
      params.push(role);
    }

    const whereClause = whereConditions.join(' AND ');

    // Fetch users
    const users = await db.query(`
      SELECT id, name, email, role, profile_image, is_online
      FROM users 
      WHERE ${whereClause}
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Get total count
    const totalResult = await db.query(`
      SELECT COUNT(*) as total FROM users WHERE ${whereClause}
    `, params);

    res.json({
      users: users,
      total: totalResult[0].total
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to search users',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

**Why This Implementation**:
- Role check: Only Super Admin can search users
- Flexible search: By name OR email
- Role filter: Find specific user types
- Pagination: Handle large user bases
- Exclude self from results
- SQL injection prevention with parameterized queries

---

## WebSocket Implementation

### Socket.IO Server Setup

```javascript
// socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Update user online status
    updateUserStatus(socket.userId, true);

    // Broadcast online status to all clients
    socket.broadcast.emit('user:status', {
      userId: socket.userId,
      isOnline: true
    });

    // Handle message send
    socket.on('message:send', async (data) => {
      try {
        const { receiverId, content } = data;
        
        // Save message to database (similar to REST implementation)
        const message = await saveMessage({
          senderId: socket.userId,
          receiverId,
          content
        });

        // Emit to receiver
        const receiverSocketId = getSocketIdByUserId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:receive', message);
        }

        // Confirm delivery to sender
        socket.emit('message:delivered', message.id);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (receiverId) => {
      const receiverSocketId = getSocketIdByUserId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:status', {
          userId: socket.userId,
          isTyping: true
        });
      }
    });

    socket.on('typing:stop', (receiverId) => {
      const receiverSocketId = getSocketIdByUserId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:status', {
          userId: socket.userId,
          isTyping: false
        });
      }
    });

    // Handle message read
    socket.on('message:read', async (messageId) => {
      try {
        await markMessageAsRead(messageId);
        // Optionally notify sender
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      updateUserStatus(socket.userId, false);
      socket.broadcast.emit('user:status', {
        userId: socket.userId,
        isOnline: false
      });
    });
  });

  return io;
}

module.exports = initializeSocket;
```

**Why This Implementation**:
- Authentication: Verify JWT before allowing connection
- Online status: Track and broadcast user presence
- Real-time messaging: Instant delivery via Socket.IO
- Typing indicators: Enhance UX with live feedback
- Error handling: Emit errors back to client
- Clean disconnect: Update status when user leaves

---

## Testing Checklist

- [ ] **Unit Tests**: Test each controller function
- [ ] **Integration Tests**: Test API endpoints with Postman/Jest
- [ ] **WebSocket Tests**: Test Socket.IO events with socket.io-client
- [ ] **Load Tests**: Test with 100+ concurrent users (Artillery/k6)
- [ ] **Security Tests**: Test SQL injection, XSS, CSRF
- [ ] **Rate Limit Tests**: Verify rate limiting works
- [ ] **Authentication Tests**: Test with invalid/expired tokens
- [ ] **Error Handling**: Test all error scenarios
- [ ] **Database Performance**: Test query performance with large datasets

---

## Deployment Checklist

- [ ] Environment variables configured (.env)
- [ ] Database migrations run
- [ ] HTTPS/SSL certificates installed
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Logging configured (Winston/Morgan)
- [ ] Error monitoring (Sentry/Rollbar)
- [ ] Database backups automated
- [ ] Load balancer configured (if needed)
- [ ] WebSocket sticky sessions configured (if using multiple servers)

---

**Last Updated**: January 22, 2026
