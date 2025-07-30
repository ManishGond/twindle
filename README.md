# <img width="300" height="200" alt="twindle-logo-out" src="https://github.com/user-attachments/assets/d1b38c9e-b9a4-458b-bb5b-5ffc31f25886" />

> A modern short-form video platform like YouTube Shorts — but with a twist: curated content, real-time group chats, and a powerful creator-curator ecosystem.

## Screenshots 🖼️
<img width="800" height="450" alt="Screenshot 2025-07-30 195259" src="https://github.com/user-attachments/assets/1096fde4-197a-4600-9877-e5171df701d9" />
<img width="800" height="450" alt="Screenshot 2025-07-30 195328" src="https://github.com/user-attachments/assets/4be4c016-7b82-41d8-8fd8-237e2086b9d3" />
<img width="800" height="450" alt="Screenshot 2025-07-30 195338" src="https://github.com/user-attachments/assets/4e2105e7-4f04-4eb1-8649-324d9b230553" />
<img width="800" height="450" alt="Screenshot 2025-07-30 195829" src="https://github.com/user-attachments/assets/341d2343-6af5-4a58-a313-879021e00612" />
<img width="800" height="450" alt="Screenshot 2025-07-30 195354" src="https://github.com/user-attachments/assets/021e29f2-7b13-4492-8e12-e6bf023a3e82" />
<img width="800" height="450" alt="Screenshot 2025-07-30 195253" src="https://github.com/user-attachments/assets/cbd450fb-1ddf-451c-b672-321d57e7981a" />
<img width="800" height="450" alt="Screenshot 2025-07-30 200729" src="https://github.com/user-attachments/assets/834f501d-0558-4abe-b3f7-9a8e665fdbd6" />



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
- Session stored temp untill all the users leave the room
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
