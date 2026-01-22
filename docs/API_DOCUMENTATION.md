# Chat System API Documentation

## Overview
This document provides comprehensive API documentation for the Super Admin Chat System. The system supports real-time messaging between Super Admin and users (Investors, Farmers, Land Owners) using both REST APIs and WebSocket connections.

**Base URL**: `http://localhost:3000/api`  
**WebSocket URL**: `http://localhost:3000`

---

## Table of Contents
1. [Authentication](#authentication)
2. [REST API Endpoints](#rest-api-endpoints)
3. [WebSocket Events](#websocket-events)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication

All API requests require authentication via JWT token.

### Headers Required
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Why Authentication is Required
- **Security**: Ensures only authenticated users can access chat functionality
- **User Identification**: Associates messages with specific users
- **Role-Based Access**: Controls access to Super Admin features
- **Data Privacy**: Prevents unauthorized access to conversations

---

## REST API Endpoints

### 1. Get All Conversations

**Endpoint**: `GET /chat/conversations`

**Purpose**: Retrieve all conversations for the authenticated user

**Why This API is Needed**:
- Load conversation list when user opens the inbox
- Display unread message counts
- Show last message preview for each conversation
- Enable conversation navigation

**Authentication**: Required

**Request Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Parameters**: None

**Response Status Codes**:
- `200 OK`: Conversations retrieved successfully
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "conversations": [
    {
      "id": "conv_12345",
      "participant": {
        "id": "user_67890",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "FARMER",
        "profileImage": "https://example.com/avatar.jpg",
        "isOnline": true
      },
      "lastMessage": {
        "id": "msg_11111",
        "conversationId": "conv_12345",
        "senderId": "user_67890",
        "receiverId": "admin_123",
        "content": "Hello, I need help with my farm",
        "timestamp": "2026-01-22T10:30:00.000Z",
        "status": "delivered",
        "isRead": false
      },
      "unreadCount": 3,
      "updatedAt": "2026-01-22T10:30:00.000Z"
    }
  ],
  "total": 15
}
```

---

### 2. Get Specific Conversation

**Endpoint**: `GET /chat/conversations/:userId`

**Purpose**: Retrieve or check if a conversation exists with a specific user

**Why This API is Needed**:
- Verify conversation exists before sending first message
- Load conversation metadata
- Check participant status

**Authentication**: Required

**Path Parameters**:
| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| userId    | string | Yes      | ID of the user to check        |

**Request Example**:
```
GET /chat/conversations/user_67890
Authorization: Bearer <JWT_TOKEN>
```

**Response Status Codes**:
- `200 OK`: Conversation found
- `404 Not Found`: No conversation exists with this user
- `401 Unauthorized`: Invalid token
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "id": "conv_12345",
  "participant": {
    "id": "user_67890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "FARMER",
    "profileImage": "https://example.com/avatar.jpg",
    "isOnline": true
  },
  "lastMessage": null,
  "unreadCount": 0,
  "updatedAt": "2026-01-22T09:00:00.000Z"
}
```

---

### 3. Get Messages in Conversation

**Endpoint**: `GET /chat/conversations/:conversationId/messages`

**Purpose**: Retrieve paginated messages for a specific conversation

**Why This API is Needed**:
- Load message history when opening a conversation
- Implement pagination for large conversations
- Restore chat history after page reload
- Support message search and filtering

**Authentication**: Required

**Path Parameters**:
| Parameter      | Type   | Required | Description                    |
|----------------|--------|----------|--------------------------------|
| conversationId | string | Yes      | ID of the conversation         |

**Query Parameters**:
| Parameter | Type   | Required | Default | Description                          |
|-----------|--------|----------|---------|--------------------------------------|
| page      | number | No       | 1       | Page number for pagination           |
| limit     | number | No       | 50      | Number of messages per page          |

**Request Example**:
```
GET /chat/conversations/conv_12345/messages?page=1&limit=50
Authorization: Bearer <JWT_TOKEN>
```

**Response Status Codes**:
- `200 OK`: Messages retrieved successfully
- `400 Bad Request`: Invalid pagination parameters
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Conversation not found
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "messages": [
    {
      "id": "msg_11111",
      "conversationId": "conv_12345",
      "senderId": "user_67890",
      "receiverId": "admin_123",
      "content": "Hello, I need help with my farm",
      "timestamp": "2026-01-22T10:30:00.000Z",
      "status": "read",
      "isRead": true
    },
    {
      "id": "msg_22222",
      "conversationId": "conv_12345",
      "senderId": "admin_123",
      "receiverId": "user_67890",
      "content": "Sure, how can I help you?",
      "timestamp": "2026-01-22T10:32:00.000Z",
      "status": "delivered",
      "isRead": false
    }
  ],
  "total": 127
}
```

---

### 4. Send Message (REST)

**Endpoint**: `POST /chat/messages`

**Purpose**: Send a message via REST API (backup method when WebSocket is unavailable)

**Why This API is Needed**:
- Fallback when WebSocket connection fails
- Initial message sending before WebSocket connects
- Ensure message delivery reliability
- Support offline message queuing

**Authentication**: Required

**Request Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "receiverId": "user_67890",
  "content": "Hello! How can I help you today?"
}
```

**Request Body Fields**:
| Field      | Type   | Required | Description                              |
|------------|--------|----------|------------------------------------------|
| receiverId | string | Yes      | ID of the message recipient              |
| content    | string | Yes      | Message text content (max 5000 chars)    |

**Response Status Codes**:
- `201 Created`: Message sent successfully
- `400 Bad Request`: Invalid request body or missing fields
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Receiver not found
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "id": "msg_33333",
  "conversationId": "conv_12345",
  "senderId": "admin_123",
  "receiverId": "user_67890",
  "content": "Hello! How can I help you today?",
  "timestamp": "2026-01-22T10:35:00.000Z",
  "status": "sent",
  "isRead": false
}
```

---

### 5. Mark Message as Read

**Endpoint**: `POST /chat/messages/:messageId/read`

**Purpose**: Mark a specific message as read

**Why This API is Needed**:
- Update read status when user views a message
- Synchronize read status across devices
- Clear unread indicators in UI
- Track message engagement

**Authentication**: Required

**Path Parameters**:
| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| messageId | string | Yes      | ID of the message to mark read |

**Request Example**:
```
POST /chat/messages/msg_33333/read
Authorization: Bearer <JWT_TOKEN>
```

**Response Status Codes**:
- `200 OK`: Message marked as read
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Message not found
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

### 6. Mark Conversation as Read

**Endpoint**: `POST /chat/conversations/:conversationId/read`

**Purpose**: Mark all messages in a conversation as read

**Why This API is Needed**:
- Bulk mark messages when opening conversation
- Reduce API calls (single request vs multiple)
- Clear all unread indicators at once
- Improve performance for conversations with many unread messages

**Authentication**: Required

**Path Parameters**:
| Parameter      | Type   | Required | Description                          |
|----------------|--------|----------|--------------------------------------|
| conversationId | string | Yes      | ID of the conversation               |

**Request Example**:
```
POST /chat/conversations/conv_12345/read
Authorization: Bearer <JWT_TOKEN>
```

**Response Status Codes**:
- `200 OK`: All messages marked as read
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Conversation not found
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "success": true,
  "messagesUpdated": 5,
  "message": "Conversation marked as read"
}
```

---

### 7. Search Users (Super Admin Only)

**Endpoint**: `GET /chat/users/search`

**Purpose**: Search for users to start new conversations (Super Admin exclusive)

**Why This API is Needed**:
- Enable Super Admin to find users by name, email, or role
- Initiate conversations with any user in the system
- Filter users by role for targeted communication
- Support user directory functionality

**Authentication**: Required (Super Admin role only)

**Query Parameters**:
| Parameter | Type   | Required | Default | Description                                    |
|-----------|--------|----------|---------|------------------------------------------------|
| query     | string | No       | -       | Search term (name or email)                    |
| role      | string | No       | -       | Filter by role (FARMER, INVESTOR, LANDOWNER)   |
| page      | number | No       | 1       | Page number for pagination                     |
| limit     | number | No       | 20      | Number of results per page                     |

**Request Example**:
```
GET /chat/users/search?query=john&role=FARMER&page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

**Response Status Codes**:
- `200 OK`: Users retrieved successfully
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: User is not Super Admin
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "users": [
    {
      "id": "user_67890",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "FARMER",
      "profileImage": "https://example.com/avatar.jpg",
      "isOnline": true
    },
    {
      "id": "user_78901",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "FARMER",
      "profileImage": null,
      "isOnline": false
    }
  ],
  "total": 47
}
```

---

### 8. Create or Get Conversation

**Endpoint**: `POST /chat/conversations`

**Purpose**: Create a new conversation or retrieve existing one with a user

**Why This API is Needed**:
- Initialize conversation before sending first message
- Prevent duplicate conversations
- Return existing conversation if already exists
- Generate conversation ID for messaging

**Authentication**: Required

**Request Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "participantId": "user_67890"
}
```

**Request Body Fields**:
| Field         | Type   | Required | Description                           |
|---------------|--------|----------|---------------------------------------|
| participantId | string | Yes      | ID of user to start conversation with |

**Response Status Codes**:
- `200 OK`: Existing conversation returned
- `201 Created`: New conversation created
- `400 Bad Request`: Invalid participant ID
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Participant user not found
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "id": "conv_12345",
  "participant": {
    "id": "user_67890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "FARMER",
    "profileImage": "https://example.com/avatar.jpg",
    "isOnline": true
  },
  "lastMessage": null,
  "unreadCount": 0,
  "updatedAt": "2026-01-22T11:00:00.000Z"
}
```

---

### 9. Delete Conversation

**Endpoint**: `DELETE /chat/conversations/:conversationId`

**Purpose**: Delete a conversation and all its messages

**Why This API is Needed**:
- Allow users to clean up old conversations
- Remove sensitive information
- Comply with data privacy requirements
- Manage storage usage

**Authentication**: Required

**Path Parameters**:
| Parameter      | Type   | Required | Description                          |
|----------------|--------|----------|--------------------------------------|
| conversationId | string | Yes      | ID of conversation to delete         |

**Request Example**:
```
DELETE /chat/conversations/conv_12345
Authorization: Bearer <JWT_TOKEN>
```

**Response Status Codes**:
- `200 OK`: Conversation deleted successfully
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: User not authorized to delete this conversation
- `404 Not Found`: Conversation not found
- `500 Internal Server Error`: Server error

**Response Body**:
```json
{
  "success": true,
  "message": "Conversation deleted successfully",
  "deletedMessages": 127
}
```

---

## WebSocket Events

### Connection

**URL**: `ws://localhost:3000`

**Purpose**: Establish real-time bidirectional communication

**Why WebSocket is Needed**:
- Enable instant message delivery without polling
- Reduce server load compared to REST polling
- Support real-time typing indicators
- Provide online/offline status updates
- Ensure low-latency communication

**Connection Authentication**:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: '<JWT_TOKEN>',
    userId: '<USER_ID>'
  },
  transports: ['websocket', 'polling']
});
```

**Connection Events**:
- `connect`: Connection established
- `disconnect`: Connection closed
- `connect_error`: Connection failed

---

### Client to Server Events

#### 1. Send Message

**Event**: `message:send`

**Purpose**: Send a message through WebSocket for real-time delivery

**Why This Event is Needed**:
- Instant message delivery to recipient
- Lower latency than REST API
- Real-time conversation experience
- Better for active chat sessions

**Payload**:
```json
{
  "receiverId": "user_67890",
  "content": "Hello! Are you available?"
}
```

**Payload Fields**:
| Field      | Type   | Required | Description                           |
|------------|--------|----------|---------------------------------------|
| receiverId | string | Yes      | ID of message recipient               |
| content    | string | Yes      | Message text (max 5000 chars)         |

**Expected Response Events**:
- `message:delivered`: Confirmation message was delivered
- `message:receive`: If you're also the receiver (self-messaging)

---

#### 2. Mark Message as Read

**Event**: `message:read`

**Purpose**: Notify server that a message has been read

**Why This Event is Needed**:
- Real-time read receipt for sender
- Update message status instantly
- Sync read status across devices
- Enable "seen by" indicators

**Payload**:
```json
"msg_33333"
```

**Payload Type**: String (messageId)

---

#### 3. Start Typing

**Event**: `typing:start`

**Purpose**: Notify recipient that user is typing

**Why This Event is Needed**:
- Show "User is typing..." indicator
- Improve chat UX with real-time feedback
- Set user expectations for incoming message
- Create more natural conversation flow

**Payload**:
```json
"user_67890"
```

**Payload Type**: String (receiverId)

**Note**: Should be throttled on client side (max 1 per second)

---

#### 4. Stop Typing

**Event**: `typing:stop`

**Purpose**: Notify recipient that user stopped typing

**Why This Event is Needed**:
- Remove "User is typing..." indicator
- Indicate user abandoned message
- Clean up UI state
- Prevent stale typing indicators

**Payload**:
```json
"user_67890"
```

**Payload Type**: String (receiverId)

**Note**: Should be sent when:
- User sends the message
- User clears input field
- User is inactive for 3+ seconds

---

### Server to Client Events

#### 1. Message Receive

**Event**: `message:receive`

**Purpose**: Receive a new message from another user

**Why This Event is Needed**:
- Display incoming messages instantly
- Update conversation list
- Increment unread count
- Play notification sounds
- Show desktop notifications

**Payload**:
```json
{
  "id": "msg_44444",
  "conversationId": "conv_12345",
  "senderId": "user_67890",
  "receiverId": "admin_123",
  "content": "Thanks for your help!",
  "timestamp": "2026-01-22T11:15:00.000Z",
  "status": "delivered",
  "isRead": false
}
```

**Client Handling**:
1. Add message to conversation view
2. Update conversation list (last message)
3. Increment unread count
4. Show notification if conversation not active
5. Scroll to latest message

---

#### 2. Message Delivered

**Event**: `message:delivered`

**Purpose**: Confirm message was successfully delivered to server

**Why This Event is Needed**:
- Update message status from "sending" to "sent"
- Confirm message persistence
- Enable retry mechanism on failure
- Provide delivery feedback to sender

**Payload**:
```json
"msg_44444"
```

**Payload Type**: String (messageId)

**Client Handling**:
1. Find message by ID in conversation
2. Update status to "delivered"
3. Show checkmark icon
4. Remove "sending" spinner

---

#### 3. User Status

**Event**: `user:status`

**Purpose**: Notify about user online/offline status changes

**Why This Event is Needed**:
- Show online indicators (green dot)
- Display "last seen" timestamps
- Improve user awareness
- Enable presence-based features

**Payload**:
```json
{
  "userId": "user_67890",
  "isOnline": true
}
```

**Payload Fields**:
| Field    | Type    | Description                      |
|----------|---------|----------------------------------|
| userId   | string  | ID of user whose status changed  |
| isOnline | boolean | true if online, false if offline |

**Client Handling**:
1. Update user status in conversation list
2. Show/hide online indicator
3. Update active conversation header
4. Store status in local state

---

#### 4. Typing Status

**Event**: `typing:status`

**Purpose**: Receive typing indicator from another user

**Why This Event is Needed**:
- Display "User is typing..." message
- Provide real-time feedback
- Enhance conversation naturalness
- Set expectations for incoming messages

**Payload**:
```json
{
  "userId": "user_67890",
  "isTyping": true
}
```

**Payload Fields**:
| Field    | Type    | Description                       |
|----------|---------|-----------------------------------|
| userId   | string  | ID of user who is typing          |
| isTyping | boolean | true if typing, false if stopped  |

**Client Handling**:
1. Show typing indicator in conversation
2. Auto-hide after 3 seconds if no stop event
3. Display animated dots
4. Position at bottom of messages

---

## Data Models

### ChatUser
```typescript
{
  id: string;              // Unique user identifier
  name: string;            // User's full name
  email: string;           // User's email address
  role: UserRole;          // SUPER_ADMIN | INVESTOR | FARMER | LANDOWNER
  profileImage?: string;   // Avatar URL (optional)
  isOnline?: boolean;      // Current online status (optional)
}
```

### Message
```typescript
{
  id: string;              // Unique message identifier
  conversationId: string;  // Parent conversation ID
  senderId: string;        // Message sender user ID
  receiverId: string;      // Message recipient user ID
  content: string;         // Message text content
  timestamp: Date;         // Message sent time (ISO 8601)
  status: MessageStatus;   // sent | delivered | read
  isRead: boolean;         // Read status flag
}
```

### Conversation
```typescript
{
  id: string;              // Unique conversation identifier
  participant: ChatUser;   // Other user in conversation
  lastMessage?: Message;   // Most recent message (optional)
  unreadCount: number;     // Number of unread messages
  updatedAt: Date;         // Last activity timestamp (ISO 8601)
}
```

---

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided authentication token is invalid or expired",
    "statusCode": 401,
    "timestamp": "2026-01-22T11:20:00.000Z"
  }
}
```

### Common Error Codes

| Code                  | HTTP Status | Description                           |
|-----------------------|-------------|---------------------------------------|
| INVALID_TOKEN         | 401         | Authentication token is invalid       |
| TOKEN_EXPIRED         | 401         | Authentication token has expired      |
| UNAUTHORIZED          | 401         | Missing authentication                |
| FORBIDDEN             | 403         | Insufficient permissions              |
| USER_NOT_FOUND        | 404         | Requested user does not exist         |
| CONVERSATION_NOT_FOUND| 404         | Conversation does not exist           |
| MESSAGE_NOT_FOUND     | 404         | Message does not exist                |
| INVALID_REQUEST       | 400         | Malformed request body                |
| VALIDATION_ERROR      | 400         | Request validation failed             |
| RATE_LIMIT_EXCEEDED   | 429         | Too many requests                     |
| SERVER_ERROR          | 500         | Internal server error                 |
| SERVICE_UNAVAILABLE   | 503         | Service temporarily unavailable       |

### Why Error Handling is Important
- **User Experience**: Provide clear error messages to users
- **Debugging**: Help developers identify and fix issues
- **Security**: Avoid exposing sensitive system information
- **Reliability**: Handle failures gracefully
- **Monitoring**: Track error patterns for system health

---

## Rate Limiting

### Limits

| Endpoint                  | Limit          | Window  | Why Needed                          |
|---------------------------|----------------|---------|-------------------------------------|
| All REST APIs             | 100 req/min    | 1 min   | Prevent API abuse                   |
| POST /chat/messages       | 30 req/min     | 1 min   | Prevent spam messaging              |
| GET /chat/conversations   | 60 req/min     | 1 min   | Reduce server load                  |
| WebSocket message:send    | 60 msg/min     | 1 min   | Prevent message flooding            |
| WebSocket typing:*        | 10 events/min  | 1 min   | Reduce unnecessary traffic          |

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1674385200
```

### Rate Limit Exceeded Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "statusCode": 429,
    "retryAfter": 60
  }
}
```

### Why Rate Limiting is Needed
- **Security**: Prevent DOS attacks and API abuse
- **Performance**: Ensure fair resource distribution
- **Cost**: Manage infrastructure costs
- **Quality**: Maintain service quality for all users
- **Spam Prevention**: Reduce message spam and bot activity

---

## Best Practices

### 1. Connection Management
- Disconnect WebSocket when user leaves inbox
- Implement reconnection logic with exponential backoff
- Handle connection errors gracefully
- Show connection status to user

### 2. Message Delivery
- Use WebSocket for primary message sending
- Fall back to REST API if WebSocket unavailable
- Implement local message queue for offline support
- Show pending/sent/delivered/read status

### 3. Performance Optimization
- Paginate message history (50 messages per page)
- Cache conversation list locally
- Debounce typing indicators (1 second)
- Lazy load older messages on scroll

### 4. Security
- Validate all user inputs
- Sanitize message content (prevent XSS)
- Never expose JWT tokens in logs
- Implement HTTPS in production
- Validate file uploads (if supporting attachments)

### 5. User Experience
- Show typing indicators
- Display read receipts
- Play notification sounds for new messages
- Show desktop notifications
- Auto-scroll to latest message
- Highlight unread conversations

---

## Testing Endpoints

### Using cURL

**Get Conversations**:
```bash
curl -X GET http://localhost:3000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Send Message**:
```bash
curl -X POST http://localhost:3000/api/chat/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverId": "user_123", "content": "Hello!"}'
```

**Search Users (Super Admin)**:
```bash
curl -X GET "http://localhost:3000/api/chat/users/search?query=john&role=FARMER" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Create new collection "Chat System API"
2. Set collection-level authorization header
3. Add environment variables for base URL and token
4. Import endpoints from this documentation
5. Test each endpoint with valid/invalid data

---

## Version History

| Version | Date       | Changes                                  |
|---------|------------|------------------------------------------|
| 1.0.0   | 2026-01-22 | Initial API documentation                |

---

## Support

For API support or questions:
- Email: dev@aswenna.com
- Documentation: /docs/API_DOCUMENTATION.md
- Issue Tracker: GitHub Issues

---

**Last Updated**: January 22, 2026
