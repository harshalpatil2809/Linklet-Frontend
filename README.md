# 💬 Linklet - Real-Time Chat Application

> A modern, real-time chat application built with **Next.js 16**, **React 19**, and **WebSocket** technology. Connect, chat, and share with real-time messaging powered by **Supabase**.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=nextjs)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Key Features

- 🔐 **Authentication** - Secure login/register with Supabase
- 💬 **Real-Time Messaging** - WebSocket-powered instant chat
- 👥 **User Profiles** - View and manage user profiles
- 🎨 **Theme Support** - Light/dark mode with next-themes
- 🔔 **Notifications** - Bell notifications for new messages
- 🔍 **User Search** - Find and connect with other users
- 😊 **Emoji Picker** - Rich emoji support in messages
- 📱 **Responsive UI** - Mobile-friendly chat interface
- ⚡ **React Compiler** - Optimized performance with React 19 compiler

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages (login, register)
│   │   ├── auth-callback/       # Auth callback handler
│   │   ├── dashboard/           # Main dashboard/chat page
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/
│   │   ├── Chat/                # Chat components
│   │   │   ├── Chat.tsx         # Main chat component
│   │   │   ├── ChatHeader.tsx   # Chat header with user info
│   │   │   ├── ChatInput.tsx    # Message input area
│   │   │   ├── MessageArea.tsx  # Messages container
│   │   │   ├── MessageBubble.tsx # Individual message bubble
│   │   │   ├── MyProfileView.tsx # Current user profile
│   │   │   └── UserProfileView.tsx # Other user profile
│   │   │
│   │   ├── Sidebar/             # Sidebar components
│   │   │   ├── Sidebar.tsx      # Main sidebar
│   │   │   ├── ChatList.tsx     # List of chats
│   │   │   ├── Logo.tsx         # App logo
│   │   │   ├── NotificationBell.tsx # Notifications
│   │   │   ├── SearchUser.tsx   # User search
│   │   │   └── UserProfile.tsx  # User profile dropdown
│   │   │
│   │   └── ui/                  # UI utilities
│   │       ├── Auth_display.tsx # Auth display component
│   │       └── sonner.tsx       # Toast notifications
│   │
│   ├── lib/
│   │   ├── auth.ts              # Authentication utilities & token management
│   │   ├── axios.ts             # Axios instance configuration
│   │   └── utils.ts             # General utility functions
│   │
│   └── proxy.ts                 # Proxy configuration
│
├── public/                      # Static assets
├── next.config.ts              # Next.js configuration (React Compiler enabled)
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.mjs          # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
└── components.json             # shadcn/ui components config
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun**
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation & Setup

1. **Clone and Navigate**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your configuration:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see your app 🎉

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.4 | React framework with SSR |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Supabase** | 2.103.3 | Backend & authentication |
| **Axios** | 1.15.0 | HTTP client |
| **Radix UI** | 1.4.3 | Headless UI components |
| **Lucide React** | 1.8.0 | Icon library |
| **Sonner** | 2.0.7 | Toast notifications |
| **Emoji Picker** | 4.18.0 | Emoji selection |
| **next-themes** | 0.4.6 | Theme management |

---

## 🎯 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint for code quality
npm run lint
```

---

## 🔌 Core Features Explained

### 🔐 Authentication System
- Secure token-based authentication via Supabase
- Automatic token refresh mechanism
- Secure cookie storage (httpOnly, secure, sameSite)
- Login & Register pages with form validation

### 💬 Real-Time Chat
- WebSocket connection for instant messaging
- Message history and persistence
- User presence indicators
- Typing status (if implemented)

### 👤 User Management
- User profile creation and editing
- Search functionality to find users
- User directory for connections
- Profile viewing with chat history

### 🎨 UI/UX Enhancements
- Dark/Light theme toggle
- Responsive design for mobile & desktop
- Toast notifications with Sonner
- Smooth animations with Tailwind CSS

---

## 🔧 Configuration Files

### `next.config.ts`
- **React Compiler** enabled for optimized rendering
- **Remote image optimization** for Cloudinary URLs
- Configured for high performance

### `tsconfig.json`
- Strict type checking enabled
- Path alias: `@/*` → `./src/*` for clean imports
- React 19 JSX runtime support

### `tailwind.config.mjs`
- Custom theme configuration with shadcn/ui
- Responsive breakpoints
- Animation utilities

---

## 📚 Learning Resources

### Documentation
- 📖 [Next.js Documentation](https://nextjs.org/docs) - Features and API reference
- 🎓 [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling guide
- 🔐 [Supabase Docs](https://supabase.com/docs) - Backend & auth setup

### Related Repositories
- [Next.js GitHub](https://github.com/vercel/next.js) - Main framework repo
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) - CSS framework
- [Supabase](https://github.com/supabase/supabase) - Backend platform

---

## 🚢 Deployment

### Deploy on Vercel (Recommended)
The easiest way to deploy:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and select your repository
4. Add environment variables in project settings
5. Click "Deploy"

```bash
# Environment variables needed on Vercel:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL
```

**Resources:**
- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Platform](https://vercel.com)

### Other Deployment Options
- **Docker** - Containerize your app
- **Netlify** - JAMstack deployment
- **Self-hosted** - Deploy to your own server

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Use `npm run dev -- -p 3001` |
| TypeScript errors | Run `npm run lint` and fix issues |
| Style not applying | Clear `.next` folder and rebuild |
| Authentication failing | Check `.env.local` Supabase credentials |

---

## 📝 Development Tips

- 💡 Use `@/` paths for clean imports instead of relative paths
- 🔍 Enable TypeScript strict mode for better type safety
- 🎨 Check `components.json` before adding new UI components
- 📱 Test responsive design using Chrome DevTools
- ⚡ Use React 19's concurrent rendering for better performance

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙋 Support & Questions

For issues and questions:
- Check existing documentation
- Review component code comments
- Check the troubleshooting section above

**Last Updated:** May 8, 2026  
**Version:** 0.1.0
