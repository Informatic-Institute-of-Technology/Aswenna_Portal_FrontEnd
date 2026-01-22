# API Request & Response Examples

Complete collection of request/response examples for all Chat System APIs with different scenarios.

---

## Authentication Examples

### Valid Authentication
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Invalid Token Response
```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided authentication token is invalid",
    "statusCode": 401,
    "timestamp": "2026-01-22T11:20:00.000Z"
  }
}
```

---

## 1. Get All Conversations

### Request (Success)
```http
GET /api/chat/conversations HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK - With Conversations)
```json
{
  "conversations": [
    {
      "id": "conv_abc123",
      "participant": {
        "id": "user_farmer_001",
        "name": "Michael Johnson",
        "email": "michael.j@farmmail.com",
        "role": "FARMER",
        "profileImage": "https://storage.aswenna.com/avatars/michael.jpg",
        "isOnline": true
      },
      "lastMessage": {
        "id": "msg_xyz789",
        "conversationId": "conv_abc123",
        "senderId": "user_farmer_001",
        "receiverId": "admin_superadmin_001",
        "content": "Thank you for the advice on crop rotation!",
        "timestamp": "2026-01-22T14:32:15.000Z",
        "status": "delivered",
        "isRead": false
      },
      "unreadCount": 2,
      "updatedAt": "2026-01-22T14:32:15.000Z"
    },
    {
      "id": "conv_def456",
      "participant": {
        "id": "user_investor_002",
        "name": "Sarah Williams",
        "email": "sarah.w@investcorp.com",
        "role": "INVESTOR",
        "profileImage": null,
        "isOnline": false
      },
      "lastMessage": {
        "id": "msg_pqr456",
        "conversationId": "conv_def456",
        "senderId": "admin_superadmin_001",
        "receiverId": "user_investor_002",
        "content": "I've reviewed your investment proposal. Let's schedule a call.",
        "timestamp": "2026-01-22T09:15:42.000Z",
        "status": "read",
        "isRead": true
      },
      "unreadCount": 0,
      "updatedAt": "2026-01-22T09:15:42.000Z"
    },
    {
      "id": "conv_ghi789",
      "participant": {
        "id": "user_landowner_003",
        "name": "Robert Chen",
        "email": "robert.chen@landmail.com",
        "role": "LANDOWNER",
        "profileImage": "https://storage.aswenna.com/avatars/robert.jpg",
        "isOnline": true
      },
      "lastMessage": null,
      "unreadCount": 0,
      "updatedAt": "2026-01-21T16:20:00.000Z"
    }
  ],
  "total": 3
}
```

### Response (200 OK - Empty)
```json
{
  "conversations": [],
  "total": 0
}
```

### Response (401 Unauthorized)
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required to access conversations",
    "statusCode": 401,
    "timestamp": "2026-01-22T14:35:00.000Z"
  }
}
```

---

## 2. Get Specific Conversation

### Request (Success)
```http
GET /api/chat/conversations/user_farmer_001 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "id": "conv_abc123",
  "participant": {
    "id": "user_farmer_001",
    "name": "Michael Johnson",
    "email": "michael.j@farmmail.com",
    "role": "FARMER",
    "profileImage": "https://storage.aswenna.com/avatars/michael.jpg",
    "isOnline": true
  },
  "lastMessage": {
    "id": "msg_xyz789",
    "conversationId": "conv_abc123",
    "senderId": "user_farmer_001",
    "receiverId": "admin_superadmin_001",
    "content": "Thank you for the advice on crop rotation!",
    "timestamp": "2026-01-22T14:32:15.000Z",
    "status": "delivered",
    "isRead": false
  },
  "unreadCount": 2,
  "updatedAt": "2026-01-22T14:32:15.000Z"
}
```

### Response (404 Not Found)
```json
{
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "No conversation exists with user ID: user_nonexistent_999",
    "statusCode": 404,
    "timestamp": "2026-01-22T14:40:00.000Z"
  }
}
```

---

## 3. Get Messages in Conversation

### Request (First Page)
```http
GET /api/chat/conversations/conv_abc123/messages?page=1&limit=50 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "messages": [
    {
      "id": "msg_001",
      "conversationId": "conv_abc123",
      "senderId": "admin_superadmin_001",
      "receiverId": "user_farmer_001",
      "content": "Hello Michael! How can I help you today?",
      "timestamp": "2026-01-22T10:00:00.000Z",
      "status": "read",
      "isRead": true
    },
    {
      "id": "msg_002",
      "conversationId": "conv_abc123",
      "senderId": "user_farmer_001",
      "receiverId": "admin_superadmin_001",
      "content": "Hi! I need advice on crop rotation for my farm.",
      "timestamp": "2026-01-22T10:02:30.000Z",
      "status": "read",
      "isRead": true
    },
    {
      "id": "msg_003",
      "conversationId": "conv_abc123",
      "senderId": "admin_superadmin_001",
      "receiverId": "user_farmer_001",
      "content": "Sure! What crops are you currently growing?",
      "timestamp": "2026-01-22T10:03:15.000Z",
      "status": "read",
      "isRead": true
    },
    {
      "id": "msg_004",
      "conversationId": "conv_abc123",
      "senderId": "user_farmer_001",
      "receiverId": "admin_superadmin_001",
      "content": "I'm growing rice and corn. I want to know the best rotation pattern.",
      "timestamp": "2026-01-22T10:05:00.000Z",
      "status": "read",
      "isRead": true
    },
    {
      "id": "msg_005",
      "conversationId": "conv_abc123",
      "senderId": "admin_superadmin_001",
      "receiverId": "user_farmer_001",
      "content": "Great! For rice and corn rotation, I recommend...",
      "timestamp": "2026-01-22T10:07:45.000Z",
      "status": "delivered",
      "isRead": false
    }
  ],
  "total": 5
}
```

### Request (Invalid Page)
```http
GET /api/chat/conversations/conv_abc123/messages?page=-1&limit=50 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid pagination parameters: page must be positive integer",
    "statusCode": 400,
    "timestamp": "2026-01-22T14:45:00.000Z"
  }
}
```

---

## 4. Send Message (REST)

### Request (Success)
```http
POST /api/chat/messages HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "receiverId": "user_farmer_001",
  "content": "Hello Michael! I've reviewed your farm data. Everything looks great!"
}
```

### Response (201 Created)
```json
{
  "id": "msg_new_123",
  "conversationId": "conv_abc123",
  "senderId": "admin_superadmin_001",
  "receiverId": "user_farmer_001",
  "content": "Hello Michael! I've reviewed your farm data. Everything looks great!",
  "timestamp": "2026-01-22T15:00:00.000Z",
  "status": "sent",
  "isRead": false
}
```

### Request (Empty Content)
```http
POST /api/chat/messages HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "receiverId": "user_farmer_001",
  "content": ""
}
```

### Response (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Message content cannot be empty",
    "statusCode": 400,
    "timestamp": "2026-01-22T15:05:00.000Z"
  }
}
```

### Request (Content Too Long)
```http
POST /api/chat/messages HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "receiverId": "user_farmer_001",
  "content": "Lorem ipsum dolor sit amet... [5001+ characters]"
}
```

### Response (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Message content exceeds maximum length of 5000 characters",
    "statusCode": 400,
    "timestamp": "2026-01-22T15:10:00.000Z"
  }
}
```

### Request (Receiver Not Found)
```http
POST /api/chat/messages HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "receiverId": "user_nonexistent_999",
  "content": "Hello!"
}
```

### Response (404 Not Found)
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Receiver with ID user_nonexistent_999 not found",
    "statusCode": 404,
    "timestamp": "2026-01-22T15:15:00.000Z"
  }
}
```

---

## 5. Mark Message as Read

### Request (Success)
```http
POST /api/chat/messages/msg_xyz789/read HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Message marked as read",
  "messageId": "msg_xyz789",
  "timestamp": "2026-01-22T15:20:00.000Z"
}
```

### Request (Message Not Found)
```http
POST /api/chat/messages/msg_nonexistent/read HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (404 Not Found)
```json
{
  "error": {
    "code": "MESSAGE_NOT_FOUND",
    "message": "Message with ID msg_nonexistent not found",
    "statusCode": 404,
    "timestamp": "2026-01-22T15:25:00.000Z"
  }
}
```

---

## 6. Mark Conversation as Read

### Request (Success)
```http
POST /api/chat/conversations/conv_abc123/read HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Conversation marked as read",
  "conversationId": "conv_abc123",
  "messagesUpdated": 5,
  "timestamp": "2026-01-22T15:30:00.000Z"
}
```

### Response (200 OK - No Unread Messages)
```json
{
  "success": true,
  "message": "Conversation already marked as read",
  "conversationId": "conv_def456",
  "messagesUpdated": 0,
  "timestamp": "2026-01-22T15:32:00.000Z"
}
```

---

## 7. Search Users (Super Admin)

### Request (Search by Name)
```http
GET /api/chat/users/search?query=michael&page=1&limit=20 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "users": [
    {
      "id": "user_farmer_001",
      "name": "Michael Johnson",
      "email": "michael.j@farmmail.com",
      "role": "FARMER",
      "profileImage": "https://storage.aswenna.com/avatars/michael.jpg",
      "isOnline": true
    },
    {
      "id": "user_investor_007",
      "name": "Michelle Rodriguez",
      "email": "michelle.r@investfunds.com",
      "role": "INVESTOR",
      "profileImage": null,
      "isOnline": false
    }
  ],
  "total": 2
}
```

### Request (Filter by Role)
```http
GET /api/chat/users/search?role=FARMER&page=1&limit=20 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "users": [
    {
      "id": "user_farmer_001",
      "name": "Michael Johnson",
      "email": "michael.j@farmmail.com",
      "role": "FARMER",
      "profileImage": "https://storage.aswenna.com/avatars/michael.jpg",
      "isOnline": true
    },
    {
      "id": "user_farmer_008",
      "name": "David Lee",
      "email": "david.lee@farmco.com",
      "role": "FARMER",
      "profileImage": "https://storage.aswenna.com/avatars/david.jpg",
      "isOnline": false
    },
    {
      "id": "user_farmer_015",
      "name": "Emily Thompson",
      "email": "emily.t@agrifarm.com",
      "role": "FARMER",
      "profileImage": null,
      "isOnline": true
    }
  ],
  "total": 47
}
```

### Request (Non-Admin User)
```http
GET /api/chat/users/search?query=john HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.investor_token...
```

### Response (403 Forbidden)
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "This feature is only available to Super Admin users",
    "statusCode": 403,
    "timestamp": "2026-01-22T15:40:00.000Z"
  }
}
```

### Request (Invalid Role)
```http
GET /api/chat/users/search?role=INVALID_ROLE HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid role filter. Must be one of: FARMER, INVESTOR, LANDOWNER",
    "statusCode": 400,
    "timestamp": "2026-01-22T15:45:00.000Z"
  }
}
```

---

## 8. Create or Get Conversation

### Request (New Conversation)
```http
POST /api/chat/conversations HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "participantId": "user_landowner_003"
}
```

### Response (201 Created)
```json
{
  "id": "conv_new_456",
  "participant": {
    "id": "user_landowner_003",
    "name": "Robert Chen",
    "email": "robert.chen@landmail.com",
    "role": "LANDOWNER",
    "profileImage": "https://storage.aswenna.com/avatars/robert.jpg",
    "isOnline": true
  },
  "lastMessage": null,
  "unreadCount": 0,
  "updatedAt": "2026-01-22T16:00:00.000Z"
}
```

### Request (Existing Conversation)
```http
POST /api/chat/conversations HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "participantId": "user_farmer_001"
}
```

### Response (200 OK - Existing)
```json
{
  "id": "conv_abc123",
  "participant": {
    "id": "user_farmer_001",
    "name": "Michael Johnson",
    "email": "michael.j@farmmail.com",
    "role": "FARMER",
    "profileImage": "https://storage.aswenna.com/avatars/michael.jpg",
    "isOnline": true
  },
  "lastMessage": {
    "id": "msg_xyz789",
    "conversationId": "conv_abc123",
    "senderId": "user_farmer_001",
    "receiverId": "admin_superadmin_001",
    "content": "Thank you for the advice on crop rotation!",
    "timestamp": "2026-01-22T14:32:15.000Z",
    "status": "delivered",
    "isRead": false
  },
  "unreadCount": 2,
  "updatedAt": "2026-01-22T14:32:15.000Z"
}
```

---

## 9. Delete Conversation

### Request (Success)
```http
DELETE /api/chat/conversations/conv_ghi789 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Conversation deleted successfully",
  "conversationId": "conv_ghi789",
  "deletedMessages": 15,
  "timestamp": "2026-01-22T16:10:00.000Z"
}
```

### Request (Not Authorized)
```http
DELETE /api/chat/conversations/conv_abc123 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.other_user_token...
```

### Response (403 Forbidden)
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not authorized to delete this conversation",
    "statusCode": 403,
    "timestamp": "2026-01-22T16:15:00.000Z"
  }
}
```

---

## WebSocket Event Examples

### Connection Example (JavaScript)
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    userId: 'admin_superadmin_001'
  },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

---

### Send Message Event

**Client Emit**:
```javascript
socket.emit('message:send', {
  receiverId: 'user_farmer_001',
  content: 'How is your harvest going?'
});
```

**Server Response (message:delivered)**:
```javascript
socket.on('message:delivered', (messageId) => {
  console.log('Message delivered:', messageId);
  // Update UI: msg_sent_123 status = "delivered"
});
```

---

### Receive Message Event

**Server Emit**:
```javascript
socket.on('message:receive', (message) => {
  console.log('New message received:', message);
  // {
  //   id: 'msg_incoming_456',
  //   conversationId: 'conv_abc123',
  //   senderId: 'user_farmer_001',
  //   receiverId: 'admin_superadmin_001',
  //   content: 'The harvest is going well, thanks for asking!',
  //   timestamp: '2026-01-22T16:30:00.000Z',
  //   status: 'delivered',
  //   isRead: false
  // }
  
  // Add to conversation UI
  // Show notification
  // Play sound
});
```

---

### Typing Indicators

**Start Typing**:
```javascript
// User starts typing
const inputField = document.querySelector('#message-input');
inputField.addEventListener('input', () => {
  socket.emit('typing:start', 'user_farmer_001');
});
```

**Receive Typing Status**:
```javascript
socket.on('typing:status', (data) => {
  console.log('Typing status:', data);
  // {
  //   userId: 'user_farmer_001',
  //   isTyping: true
  // }
  
  if (data.isTyping) {
    // Show "Michael Johnson is typing..."
  } else {
    // Hide typing indicator
  }
});
```

**Stop Typing**:
```javascript
// User stopped typing (3 seconds timeout)
let typingTimeout;
inputField.addEventListener('input', () => {
  clearTimeout(typingTimeout);
  socket.emit('typing:start', 'user_farmer_001');
  
  typingTimeout = setTimeout(() => {
    socket.emit('typing:stop', 'user_farmer_001');
  }, 3000);
});

// Or when message is sent
sendButton.addEventListener('click', () => {
  socket.emit('typing:stop', 'user_farmer_001');
  socket.emit('message:send', { ... });
});
```

---

### User Status Events

**Receive Status Update**:
```javascript
socket.on('user:status', (data) => {
  console.log('User status changed:', data);
  // {
  //   userId: 'user_farmer_001',
  //   isOnline: true
  // }
  
  // Update conversation list
  // Show green dot for online users
  // Show "last seen" for offline users
});
```

---

### Mark Message as Read

**Client Emit**:
```javascript
// When user views a message
socket.emit('message:read', 'msg_incoming_456');
```

---

## Rate Limiting Examples

### Rate Limit Headers (Normal)
```http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1674385200

{
  "conversations": [...]
}
```

### Rate Limit Exceeded
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1674385260
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds.",
    "statusCode": 429,
    "retryAfter": 60,
    "timestamp": "2026-01-22T16:45:00.000Z"
  }
}
```

---

## Error Scenarios

### Server Error (500)
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "statusCode": 500,
    "timestamp": "2026-01-22T16:50:00.000Z",
    "requestId": "req_abc123def456"
  }
}
```

### Service Unavailable (503)
```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Chat service is temporarily unavailable. Please try again in a few minutes.",
    "statusCode": 503,
    "timestamp": "2026-01-22T16:55:00.000Z",
    "retryAfter": 300
  }
}
```

---

**Last Updated**: January 22, 2026
