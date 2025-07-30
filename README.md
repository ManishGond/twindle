# <img width="300" height="200" alt="twindle-logo-out" src="https://github.com/user-attachments/assets/d1b38c9e-b9a4-458b-bb5b-5ffc31f25886" />

> A modern short-form video platform like YouTube Shorts — but with a twist: curated content, real-time group chats, and a powerful creator-curator ecosystem.

## 🚀 Features

### 🎥 Short-Form Video Feed
- Vertical swipe-based video navigation (like YouTube Shorts / Instagram Reels)
- Auto-play current video, pause others
- Like, comment, share, and **curate** buttons
- Dynamic loading of video feed
- Secure video playback with signed URLs from Cloudinary

### 👥 Authentication System
- JWT-based login/signup with Redux state management
- Role-based users: `creator`, `curator`, `admin`
- Protected routes and conditional rendering
- Profile dropdown with session-aware UI

### 💬 Real-Time Group Chat
- Socket.IO powered live chat rooms
- Auto-scroll, join/leave messages, and online user tracking
- Session cookies for reconnection support
- Messages persist as long as any user stays in the room
- Auto-deletion of room/messages when all users leave

### 🧠 Curator System (Coming Soon)
- "Curate" button to promote content you believe in
- AI-backed For-You page based on curation + engagement
- Creator and Curator badges based on activity

---

## 🛠️ Tech Stack

| Frontend | Backend | Dev Tools |
|----------|---------|-----------|
| React + Redux Toolkit | Node.js + Express | Vite |
| Framer Motion | Prisma ORM + MongoDB | ESLint + Prettier |
| TypeScript | Socket.IO | Postman |
| Cloudinary | JWT Auth | GitHub Actions (planned) |
| CSS Modules | REST APIs | Docker (planned) |

---

## 📁 Folder Structure (Simplified)
```bash
/client
/components # Reusable UI components
/pages # Feed, Login, Signup, etc.
/features # Redux slices
/styles # CSS Modules

/server
/controllers
/routes
/prisma
/sockets
```

---

## 🧪 Getting Started

### 📦 Prerequisites
- Node.js v18+
- MongoDB or Postgres instance
- Cloudinary account for video hosting

---

## 🔐 Roles
- Creator: Upload videos

- Curator: Curate trending videos

- Admin: Manage users/videos via protected API routes (Postman only)

## 📅 Roadmap
 - Swipe-based Shorts Feed
 - Auth & Protected Routes
 - Real-time Group Chat
 - Curator Algorithm + For-You Page (Needs implementation)
 - Video Upload UI (Creator Dashboard)
 - Admin Panel (Needs implementaion)

## 📄 License
MIT License © 2025 Manish Gond

## 💡 Inspiration
Twindle draws inspiration from YouTube Shorts, Instagram Reels, and TikTok — but adds a layer of curated community wisdom and real-time engagement that’s missing in traditional short-form platforms.
