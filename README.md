# Sky Coding - Portfolio Platform

A production-ready Next.js 16 application for Sky Coding portfolio and project showcase with MongoDB and Cloudinary integration.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB and Cloudinary credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

## Features

✨ **Core Features**

- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Modern UI with Tailwind CSS
- 🖼️ Image and video uploads via Cloudinary
- 💾 MongoDB database for data persistence
- ⚡ Next.js 16 with App Router
- 🔐 TypeScript for type safety
- 📝 SEO optimized pages

🚀 **Functionality**

- Home page with featured projects
- Projects showcase page
- Individual project detail pages
- Contact form with social media links
- Admin panel for adding projects
- RESTful API routes for CRUD operations

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── projects/          # Projects pages
│   ├── contact/           # Contact page
│   ├── admin/             # Admin panel
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utilities (DB, Cloudinary)
├── models/                # Mongoose schemas
└── utils/                 # Validation & helpers
```

## Environment Variables

Required variables in `.env.local`:

```env
MONGO_URL=mongodb+srv://...
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
NODE_ENV=development
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Media

- `POST /api/upload` - Upload image/video

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## Pages

- **Home** (`/`) - Landing page with featured projects
- **Projects** (`/projects`) - Projects gallery
- **Project Details** (`/projects/[id]`) - Individual project page
- **Contact** (`/contact`) - Contact form and links
- **Admin** (`/admin`) - Project management panel

## Database Models

### User/Owner

```typescript
{
  name: string
  bio: string
  email: string
  avatar?: string
  socialLinks: {
    whatsapp?: string
    facebook?: string
    instagram?: string
    twitter?: string
  }
  projects: ObjectId[]
}
```

### Project

```typescript
{
  title: string
  description: string
  media: [{
    url: string
    type: 'image' | 'video'
    publicId: string
  }]
}
```

## Social Links

- 🟢 WhatsApp: https://wa.me/263786974895
- 🔵 Facebook: https://www.facebook.com/profile.php?id=61584322210511
- 📸 Instagram: https://www.instagram.com/skycodingjr/
- 𝕏 Twitter/X: https://x.com/skycodingjr

## Setup Instructions

### 1. MongoDB Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database named "skycoding"
4. Get your connection string
5. Add to `.env.local` as `MONGO_URL`

### 2. Cloudinary Setup

1. Go to https://cloudinary.com/
2. Sign up for free account
3. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret
4. Add to `.env.local`

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Visit Admin Panel

Go to `http://localhost:3000/admin` to add projects.

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Manual Deployment

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Cloudinary** - Image/video hosting

## Production Checklist

- [ ] Set environment variables in hosting platform
- [ ] Configure MongoDB connection string
- [ ] Set up Cloudinary credentials
- [ ] Test all API routes
- [ ] Verify image/video uploads
- [ ] Test contact form
- [ ] Optimize images with Next.js Image
- [ ] Set up monitoring/logging
- [ ] Configure error tracking
- [ ] Test on multiple devices

## Troubleshooting

**MongoDB connection fails**

- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure credentials are correct

**Cloudinary upload fails**

- Verify API credentials
- Check file type and size limits
- Ensure proper folder permissions

**Build errors**

- Delete `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Run build again: `npm run build`

## Support & Contact

For questions or support:

- Email: contact@skycoding.com
- WhatsApp: https://wa.me/263786974895

## License

Private project for Sky Coding™

---

Built with ❤️ using Next.js, React & TypeScript | 2024

# or

pnpm dev

# or

bun dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```
# Sky-Coding-
# Sky-Coding-
# Sky-Coding-
