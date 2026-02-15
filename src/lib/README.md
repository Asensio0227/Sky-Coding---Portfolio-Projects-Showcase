# `/src/lib` - Library & Utilities Folder

This folder contains core utilities, configurations, and helper functions used throughout the application.

---

## 📁 File Structure

```
src/lib/
├── db.ts           # MongoDB database connection
├── cloudinary.ts   # Cloudinary media upload/delete
├── auth.ts         # JWT authentication helpers
├── api.ts          # API client utilities (frontend)
├── constants.ts    # App-wide constants & config
└── README.md       # This file
```

---

## 📄 File Descriptions

### **1. `db.ts` - MongoDB Connection**

**Purpose:** Establishes and caches MongoDB connection for optimal performance.

**Key Features:**

- Connection caching to prevent duplicate connections
- Environment variable validation
- Error handling
- Auto-reconnect logic

**Usage:**

```typescript
import { connectDB } from '@/lib/db';

// In API routes
export async function GET() {
  await connectDB();
  // Your database operations...
}
```

**Environment Variables Required:**

- `MONGO_URL` - MongoDB connection string

---

### **2. `cloudinary.ts` - Media Upload Service**

**Purpose:** Handles image and video uploads to Cloudinary CDN.

**Key Features:**

- Upload images and videos
- Delete media files
- Generate secure URLs
- Automatic folder organization

**Functions:**

```typescript
// Upload file to Cloudinary
uploadToCloudinary(file: Buffer, fileName: string, mediaType: 'image' | 'video')

// Delete file from Cloudinary
deleteFromCloudinary(publicId: string, resourceType: string)
```

**Usage:**

```typescript
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// Upload
const result = await uploadToCloudinary(buffer, 'project-1.jpg', 'image');
console.log(result.url); // Cloudinary URL

// Delete
await deleteFromCloudinary('skycoding/projects/project-1', 'image');
```

**Environment Variables Required:**

- `CLOUD_NAME` - Cloudinary cloud name
- `CLOUD_API_KEY` - Cloudinary API key
- `CLOUD_API_SECRET` - Cloudinary API secret

**Uploaded Media Location:**

- All uploads go to: `skycoding/projects/` folder
- Format: `https://res.cloudinary.com/{cloud_name}/image/upload/skycoding/projects/{filename}`

---

### **3. `auth.ts` - Authentication Utilities**

**Purpose:** JWT token generation, verification, and password hashing.

**Key Features:**

- Password hashing with bcrypt
- JWT token creation and verification
- Cookie management
- User session handling

**Functions:**

```typescript
// Password operations
hashPassword(password: string): Promise<string>
verifyPassword(password: string, hashedPassword: string): Promise<boolean>

// JWT operations
signJWT(payload: any): Promise<string>
verifyJWT(token: string): Promise<any>

// Cookie management
getAuthToken(): Promise<string | null>
setAuthToken(token: string): Promise<void>
clearAuthToken(): Promise<void>

// User operations
getCurrentUser(): Promise<any>
createAuthResponse(success: boolean, message: string, data?: any, statusCode?: number)
```

**Usage:**

```typescript
import { hashPassword, signJWT, setAuthToken } from '@/lib/auth';

// Signup
const hashedPassword = await hashPassword('userPassword123');
const token = await signJWT({ userId: user._id, role: 'client' });
await setAuthToken(token);

// Login verification
const isValid = await verifyPassword('userPassword123', user.password);
```

**Environment Variables Required:**

- `JWT_SECRET` - Secret key for JWT signing (minimum 32 characters)

**Token Expiration:**

- Default: 7 days
- Stored in HTTP-only cookies for security

---

### **4. `api.ts` - API Client (NEW)**

**Purpose:** Centralized API client for making HTTP requests from the frontend.

**Key Features:**

- Type-safe API calls
- Automatic error handling
- Cookie-based authentication
- Upload handling

**Main API Modules:**

#### **Auth API**

```typescript
import { authApi } from '@/lib/api';

await authApi.signup({ email, password, businessName, domain });
await authApi.login({ email, password });
await authApi.logout();
const user = await authApi.getCurrentUser();
```

#### **Projects API**

```typescript
import { projectsApi } from '@/lib/api';

const projects = await projectsApi.getAll();
const project = await projectsApi.getById('123');
await projectsApi.create(projectData);
await projectsApi.update('123', updates);
await projectsApi.delete('123');
```

#### **Chat API**

```typescript
import { chatApi } from '@/lib/api';

await chatApi.sendMessage({
  clientId: 'abc123',
  message: 'Hello!',
  visitorId: 'visitor-uuid',
});
```

#### **Admin API**

```typescript
import { adminApi } from '@/lib/api';

const conversations = await adminApi.getConversations();
const messages = await adminApi.getMessages('conversationId');
const stats = await adminApi.getDashboardStats();
```

#### **Upload API**

```typescript
import { uploadApi } from '@/lib/api';

const file = event.target.files[0];
const result = await uploadApi.uploadMedia(file, 'image');
```

**Helper Functions:**

```typescript
import { handleApiError, isApiSuccess, getApiData } from '@/lib/api';

const response = await projectsApi.getAll();
if (isApiSuccess(response)) {
  const projects = getApiData(response);
} else {
  const error = handleApiError(response);
  console.error(error);
}
```

---

### **5. `constants.ts` - App Constants (NEW)**

**Purpose:** Centralized configuration and constants used throughout the app.

**Main Exports:**

#### **App Info**

```typescript
import { APP_NAME, APP_TAGLINE, OWNER_INFO } from '@/lib/constants';

console.log(APP_NAME); // "Sky Coding"
console.log(OWNER_INFO.email); // "skycodingjr@gmail.com"
```

#### **Social Links**

```typescript
import { SOCIAL_LINKS } from '@/lib/constants';

<a href={SOCIAL_LINKS.whatsapp}>WhatsApp</a>
```

#### **Project Categories**

```typescript
import { PROJECT_CATEGORIES } from '@/lib/constants';

PROJECT_CATEGORIES.forEach((category) => {
  console.log(category); // "AI Solutions", "SaaS Platform", etc.
});
```

#### **Tech Stack**

```typescript
import { TECH_STACK } from '@/lib/constants';

TECH_STACK.frontend; // [{ name: 'Next.js', icon: '/logos/nextjs.svg' }, ...]
TECH_STACK.ai; // [{ name: 'OpenAI GPT', icon: '/logos/openai.svg' }, ...]
```

#### **Services**

```typescript
import { SERVICES } from '@/lib/constants';

SERVICES.map(service => (
  <div key={service.id}>
    <h3>{service.title}</h3>
    <p>{service.description}</p>
  </div>
));
```

#### **Routes**

```typescript
import { ROUTES } from '@/lib/constants';

router.push(ROUTES.projectDetail('123')); // /projects/123
```

#### **Validation**

```typescript
import { VALIDATION } from '@/lib/constants';

if (!VALIDATION.email.pattern.test(email)) {
  console.error(VALIDATION.email.message);
}
```

#### **Theme Colors**

```typescript
import { THEME_COLORS } from '@/lib/constants';

<button style={{ backgroundColor: THEME_COLORS.primary.DEFAULT }}>
  Click Me
</button>
```

#### **SEO**

```typescript
import { SEO } from '@/lib/constants';

export const metadata = {
  title: SEO.defaultTitle,
  description: SEO.defaultDescription,
};
```

---

## 🚀 Common Usage Patterns

### **API Route Example**

```typescript
// src/app/api/projects/route.ts
import { connectDB } from '@/lib/db';
import { Project } from '@/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const projects = await Project.find();
  return Response.json({ success: true, data: projects });
}
```

### **Frontend Component Example**

```typescript
'use client';
import { useEffect, useState } from 'react';
import { projectsApi, isApiSuccess, getApiData } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const response = await projectsApi.getAll();
      if (isApiSuccess(response)) {
        setProjects(getApiData(response) || []);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div>
      {projects.map(project => (
        <a key={project._id} href={ROUTES.projectDetail(project._id)}>
          {project.title}
        </a>
      ))}
    </div>
  );
}
```

---

## 🔒 Security Notes

1. **Environment Variables:**
   - Never commit `.env.local` to Git
   - Use strong, random JWT_SECRET (min 32 chars)
   - Rotate API keys regularly

2. **JWT Tokens:**
   - Stored in HTTP-only cookies
   - Auto-expire after 7 days
   - Verify on every protected route

3. **Password Hashing:**
   - Uses bcrypt with salt rounds = 10
   - Never store plain text passwords
   - Always hash before saving to DB

4. **API Security:**
   - All requests include credentials
   - CORS configured for production
   - Rate limiting should be added

---

## ⚙️ Environment Setup

Create `.env.local` in project root:

```env
# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/skycoding

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# App
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📝 Best Practices

1. **Always use the API client (`api.ts`) for frontend requests**
   - Don't make raw fetch calls
   - Ensures consistent error handling
   - Type-safe responses

2. **Use constants instead of hard-coded values**
   - Import from `constants.ts`
   - Easier to maintain
   - Single source of truth

3. **Connect to DB in API routes, not components**
   - Use `connectDB()` at the start of API handlers
   - Connection is cached automatically

4. **Handle errors properly**
   - Use `handleApiError()` helper
   - Show user-friendly messages
   - Log errors for debugging

5. **Validate user input**
   - Use `VALIDATION` constants
   - Check on both client and server
   - Sanitize before DB operations

---

## 🔄 Migration Guide

If you're updating from an older version:

1. Move existing `db.ts` and `cloudinary.ts` to this folder
2. Add new `api.ts` for frontend API calls
3. Add new `constants.ts` for centralized config
4. Update imports in components:

   ```typescript
   // Old
   import { connectDB } from '../../../lib/db';

   // New
   import { connectDB } from '@/lib/db';
   ```

---

## 📚 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [MongoDB with Mongoose](https://mongoosejs.com/docs/guide.html)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [JWT.io](https://jwt.io/)

---

**Last Updated:** January 31, 2026  
**Version:** 1.0.0
