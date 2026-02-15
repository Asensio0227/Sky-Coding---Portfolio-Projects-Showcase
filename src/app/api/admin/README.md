# API Routes Documentation

Complete API endpoints for your Sky Coding chatbot platform.

---

## 📁 Directory Structure

```
src/app/api/
├── auth/                      # ✅ EXISTING - Authentication
│   ├── signup/route.ts        # POST - User registration
│   ├── login/route.ts         # POST - User login
│   ├── logout/route.ts        # POST - User logout
│   ├── me/route.ts            # GET - Get current user
│   └── verify/route.ts        # GET - Verify token
│
├── chat/                      # 🆕 NEW - Chat endpoints
│   └── message/
│       └── route.ts           # POST, GET - Send/receive messages
│
├── admin/                     # 🆕 NEW - Admin endpoints
│   ├── conversations/
│   │   └── route.ts           # GET, PATCH - List/update conversations
│   ├── messages/
│   │   └── [id]/
│   │       └── route.ts       # GET, POST, PATCH - Conversation messages
│   └── stats/
│       └── route.ts           # GET - Dashboard statistics
│
├── projects/                  # ✅ EXISTING - Portfolio projects
│   ├── route.ts               # GET, POST - List/create projects
│   └── [id]/
│       └── route.ts           # GET, DELETE - View/delete project
│
├── upload/
│   └── route.ts               # ✅ EXISTING - Cloudinary uploads
│
└── profile/
    └── route.ts               # ✅ EXISTING - User profile
```

---

## 🆕 NEW API Endpoints

### **1. Chat Message API**

**File:** `src/app/api/chat/message/route.ts`

#### **POST /api/chat/message**

Send a message from the chatbot widget.

**Request Body:**

```json
{
  "clientId": "507f1f77bcf86cd799439011", // Restaurant ID (required)
  "message": "What are your opening hours?", // User message (required)
  "conversationId": "507f...", // Optional (for continuing)
  "visitorId": "visitor_123" // Optional (for tracking)
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "conversationId": "507f1f77bcf86cd799439012",
    "userMessage": {
      "id": "507f...",
      "content": "What are your opening hours?",
      "createdAt": "2026-01-31T10:30:00.000Z"
    },
    "assistantMessage": {
      "id": "507f...",
      "content": "We're open Monday-Friday 9am-5pm...",
      "createdAt": "2026-01-31T10:30:02.000Z"
    }
  }
}
```

**Features:**

- Creates new conversation if needed
- Generates AI response (placeholder for now)
- Saves both user and assistant messages
- Updates conversation stats
- Updates restaurant metrics

**AI Integration:** Currently uses keyword matching. Replace `generateAIResponse()` function with:

- OpenAI GPT-4
- Anthropic Claude
- Google Gemini
- Or your preferred AI service

---

#### **GET /api/chat/message**

Get messages for a conversation.

**Query Params:**

- `conversationId` (required)

**Response (200):**

```json
{
  "success": true,
  "data": [...messages],
  "count": 25
}
```

---

### **2. Admin Conversations API**

**File:** `src/app/api/admin/conversations/route.ts`

#### **GET /api/admin/conversations**

Get all conversations with filtering and pagination.

**Query Params:**

- `restaurantId` - Filter by restaurant (optional)
- `status` - Filter by status: `active`, `resolved`, `abandoned`
- `limit` - Results per page (default: 50)
- `page` - Page number (default: 1)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f...",
      "restaurantId": "507f...",
      "visitorId": "visitor_123",
      "source": "website",
      "status": "active",
      "messageCount": 12,
      "lastMessageAt": "2026-01-31T10:30:00.000Z",
      "createdAt": "2026-01-31T09:00:00.000Z",
      "lastMessage": {
        "content": "Thank you!",
        "role": "user",
        "createdAt": "2026-01-31T10:30:00.000Z"
      },
      "restaurant": {
        "name": "Beach Resort Hotel",
        "domain": "beachresort.com"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

**Authorization:**

- Admins: See all conversations
- Clients: See only their restaurant's conversations

---

#### **PATCH /api/admin/conversations**

Update conversation status.

**Request Body:**

```json
{
  "conversationId": "507f1f77bcf86cd799439012",
  "status": "resolved" // or "active", "abandoned"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Conversation updated successfully",
  "data": {...conversation}
}
```

---

### **3. Admin Messages API**

**File:** `src/app/api/admin/messages/[id]/route.ts`

#### **GET /api/admin/messages/[id]**

Get all messages for a conversation.

**URL Params:**

- `id` - Conversation ID

**Query Params:**

- `limit` - Messages to return (default: 100)
- `before` - Message ID for pagination

**Response (200):**

```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "507f...",
      "visitorId": "visitor_123",
      "status": "active",
      "messageCount": 12,
      "createdAt": "2026-01-31T09:00:00.000Z"
    },
    "messages": [
      {
        "_id": "507f...",
        "role": "user",
        "content": "Hello!",
        "createdAt": "2026-01-31T09:00:00.000Z",
        "isRead": true,
        "isFlagged": false
      },
      {
        "_id": "507f...",
        "role": "assistant",
        "content": "Hi! How can I help?",
        "createdAt": "2026-01-31T09:00:02.000Z",
        "aiMetadata": {
          "model": "gpt-3.5-turbo",
          "responseTime": 1200,
          "confidence": 0.95
        }
      }
    ],
    "pagination": {
      "total": 12,
      "returned": 12,
      "hasMore": false
    }
  }
}
```

**Auto-marks messages as read**

---

#### **POST /api/admin/messages/[id]**

Send a manual reply to a conversation.

**URL Params:**

- `id` - Conversation ID

**Request Body:**

```json
{
  "content": "Thanks for contacting us! We'll get back to you soon.",
  "role": "assistant" // or "system"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {...message}
}
```

**Use Cases:**

- Manual customer support
- Override AI response
- Send system notifications

---

#### **PATCH /api/admin/messages/[id]**

Flag/unflag a message for review.

**Request Body:**

```json
{
  "messageId": "507f1f77bcf86cd799439012",
  "isFlagged": true
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Message flagged successfully",
  "data": {...message}
}
```

**Use Cases:**

- Mark inappropriate messages
- Flag for human review
- Quality control

---

### **4. Admin Stats API**

**File:** `src/app/api/admin/stats/route.ts`

#### **GET /api/admin/stats**

Get dashboard statistics.

**Query Params:**

- `restaurantId` - Filter by restaurant (optional)
- `period` - Time period: `7d`, `30d`, `all` (default: `30d`)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalConversations": 150,
      "activeConversations": 25,
      "resolvedConversations": 100,
      "abandonedConversations": 25,
      "totalMessages": 1250,
      "userMessages": 625,
      "assistantMessages": 625,
      "flaggedMessages": 3
    },
    "metrics": {
      "averageMessagesPerConversation": "8.3",
      "averageResponseTime": "2.5s",
      "responseRate": "100%",
      "activeRate": "16.7%",
      "resolutionRate": "66.7%"
    },
    "trends": {
      "period": "30d",
      "periodLabel": "Last 30d",
      "recentConversations": [...]
    },
    "insights": {
      "topQuestions": [
        { "question": "what are your hours?", "count": 45 },
        { "question": "do you have parking?", "count": 32 }
      ],
      "peakHours": [],
      "commonIssues": []
    },
    "restaurant": {
      "name": "Beach Resort Hotel",
      "domain": "beachresort.com",
      "chatbotConfig": {...},
      "totalConversations": 500,
      "totalMessages": 4200
    }
  }
}
```

**Metrics Explained:**

- **Response Rate:** % of user messages that got AI response
- **Active Rate:** % of conversations currently active
- **Resolution Rate:** % of conversations marked as resolved
- **Average Messages:** Messages per conversation
- **Average Response Time:** AI response time (placeholder)

---

## 📊 Data Flow Examples

### **Example 1: First-time Visitor Chat**

```javascript
// 1. User visits website, chatbot widget loads
const clientId = '507f1f77bcf86cd799439011'; // From data-client-id

// 2. User sends first message
const response1 = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId,
    message: 'What are your hours?',
  }),
});

const data1 = await response1.json();
// Response includes: conversationId, userMessage, assistantMessage

// 3. User sends follow-up
const response2 = await fetch('/api/chat/message', {
  method: 'POST',
  body: JSON.stringify({
    clientId,
    conversationId: data1.data.conversationId, // Reuse conversation
    message: 'Do you have parking?',
  }),
});
```

---

### **Example 2: Client Views Dashboard**

```javascript
// 1. Client logs in (gets auth_token cookie)

// 2. Dashboard fetches stats
const stats = await fetch('/api/admin/stats?period=7d', {
  credentials: 'include', // Sends auth cookie
});

// 3. Dashboard fetches recent conversations
const conversations = await fetch(
  '/api/admin/conversations?limit=10&status=active',
  {
    credentials: 'include',
  },
);

// 4. Client clicks on a conversation
const messages = await fetch(`/api/admin/messages/${conversationId}`, {
  credentials: 'include',
});

// 5. Client sends manual reply
await fetch(`/api/admin/messages/${conversationId}`, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({
    content: "Thanks! We'll see you at 2pm.",
  }),
});

// 6. Client marks conversation as resolved
await fetch('/api/admin/conversations', {
  method: 'PATCH',
  credentials: 'include',
  body: JSON.stringify({
    conversationId,
    status: 'resolved',
  }),
});
```

---

## 🔒 Authentication & Authorization

All admin and chat endpoints use JWT authentication via HTTP-only cookies.

### **Middleware Flow:**

```
Request → Get auth_token cookie → verifyJWT() → Check role → Process/Reject
```

### **Authorization Levels:**

1. **Public (No Auth):**
   - `POST /api/chat/message` - Widget messages

2. **Client Role:**
   - `GET /api/admin/conversations` - Only their restaurant's data
   - `GET /api/admin/messages/[id]` - Only their conversations
   - `GET /api/admin/stats` - Only their restaurant's stats

3. **Admin Role:**
   - Full access to all endpoints
   - Can view all restaurants
   - Can manage all conversations

---

## 🚀 Integration Guide

### **Step 1: Set Up Models**

Ensure you have these Mongoose models:

- `User.ts`
- `Restaurant.ts`
- `Conversation.ts`
- `Message.ts`

### **Step 2: Create API Routes**

Copy the route files to your project:

```bash
src/app/api/
├── chat/message/route.ts
├── admin/
│   ├── conversations/route.ts
│   ├── messages/[id]/route.ts
│   └── stats/route.ts
```

### **Step 3: Test Endpoints**

Use the frontend API client:

```typescript
import { chatApi, adminApi } from '@/lib/api';

// Send chat message
const response = await chatApi.sendMessage({
  clientId: 'restaurant-id',
  message: 'Hello!',
});

// Get conversations
const convos = await adminApi.getConversations();

// Get stats
const stats = await adminApi.getDashboardStats();
```

---

## 🔧 Environment Variables

Add to `.env.local`:

```env
# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# MongoDB
MONGO_URL=mongodb+srv://...

# AI Service (when you integrate)
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🎯 AI Integration TODO

Replace the placeholder `generateAIResponse()` function in `chat/message/route.ts`:

### **Option 1: OpenAI GPT**

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAIResponse(userMessage: string, restaurant: any) {
  const startTime = Date.now();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant for ${restaurant.name}. Be friendly and professional.`,
      },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 150,
  });

  return {
    content: completion.choices[0].message.content,
    responseTime: Date.now() - startTime,
    confidence: 0.95,
  };
}
```

### **Option 2: Anthropic Claude**

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateAIResponse(userMessage: string, restaurant: any) {
  const startTime = Date.now();

  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
    system: `You are a helpful assistant for ${restaurant.name}.`,
  });

  return {
    content: message.content[0].text,
    responseTime: Date.now() - startTime,
    confidence: 0.95,
  };
}
```

---

## 📝 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing

### **Test Chat Endpoint:**

```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "your-restaurant-id",
    "message": "Hello!"
  }'
```

### **Test Admin Endpoints (requires auth):**

```bash
# Login first to get cookie
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt

# Get conversations
curl http://localhost:3000/api/admin/conversations \
  -b cookies.txt

# Get stats
curl http://localhost:3000/api/admin/stats?period=7d \
  -b cookies.txt
```

---

## 📚 Next Steps

1. ✅ Copy all route files to your project
2. ✅ Test endpoints with Postman/curl
3. 🔄 Integrate real AI service (OpenAI/Claude)
4. 🔄 Build dashboard UI components
5. 🔄 Create chatbot widget
6. 🔄 Add real-time updates (WebSockets)
7. 🔄 Implement analytics tracking

---

**Questions or issues?** Check the individual route files for detailed comments and implementation notes.

**Version:** 1.0.0  
**Last Updated:** January 31, 2026
