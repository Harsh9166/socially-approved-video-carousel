# Socially Approved Video Carousel

A full-stack, responsive, high-performance video carousel application built with **React.js**, **Vite**, **Tailwind CSS**, **Node.js/Express**, and the native **IntersectionObserver API**.

Inspired by the "Socially Approved" community video lookbooks found on modern e-commerce storefronts (e.g. saadaa.in / driptrip.in).

---

## 🌟 Key Features

- **36 Video Dataset via Backend REST API**: All video metadata is served dynamically from the Express backend (`GET /videos`). Zero hardcoded video arrays on the frontend.
- **Lazy Loading via IntersectionObserver**: Video resources only load and attach their `src` when entering the viewport, keeping active video DOM resources strictly optimized ($\le 10$ active videos at a time).
- **Out-Of-View Auto Pause**: Videos scrolling out of view automatically pause to preserve memory, network bandwidth, and CPU/GPU resources.
- **Outer Responsive Carousel**: Smooth horizontal scrolling with desktop ($\approx 3$ cards visible) and mobile ($1-2$ cards visible) layouts, touch swipe/drag gestures, and previous/next navigation buttons.
- **Inner Fullscreen Video Modal**:
  - Direct video modal player triggered on card click.
  - Full playback controls (Play/Pause, Mute/Unmute, interactive scrubbing Progress Bar, Like, Share).
  - Modal carousel navigation (Previous / Next video buttons without closing modal).
  - Full keyboard control (`Escape` to close, `ArrowLeft` for previous, `ArrowRight` for next, `Space` for play/pause).
- **Like & Share Functionality**:
  - `POST /like`: Updates like count on backend with duplicate like prevention per user session.
  - `POST /share`: Tracks platform shares ("copy", "native", etc.) with fallback to Web Share API or clipboard copy.
- **Robust Error Handling**: Buffering loading spinners, network retry fallback banners, and gracefully handled video load errors.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Glassmorphism UI tokens, Lucide Icons
- **HTTP Client**: Axios
- **Performance**: IntersectionObserver API, `React.memo`, selective video `src` binding

### Backend
- **Runtime**: Node.js & Express.js
- **Middleware**: CORS, Express JSON parser
- **Data Persistence**: In-memory store initialized from `data/videos.json`
- **Environment**: `dotenv` support with customizable `PORT`

---

## 🚀 Quick Start & Local Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server (Port 5000)
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

```bash
# Navigate to frontend directory in a new terminal
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend application will run on `http://localhost:3000`.

---

## 🌐 API Documentation

### 1. `GET /api/videos`
Returns the dataset of 36 video records.

**Response Example:**
```json
{
  "success": true,
  "count": 36,
  "videos": [
    {
      "id": "1",
      "title": "Urban Summer Collection",
      "description": "Breezy linen shirts and relaxed fit trousers...",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "thumbnail": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "likes": 1420,
      "shares": 312
    }
  ]
}
```

### 2. `POST /api/like`
Increments like count and tracks unique user likes.

**Request Body:**
```json
{
  "videoId": "1",
  "userId": "usr_9x2b1a"
}
```

**Response Example:**
```json
{
  "success": true,
  "videoId": "1",
  "likes": 1421,
  "alreadyLiked": false
}
```

### 3. `POST /api/share`
Increments share count for specified platform.

**Request Body:**
```json
{
  "videoId": "1",
  "platform": "copy"
}
```

**Response Example:**
```json
{
  "success": true,
  "videoId": "1",
  "shares": 313,
  "platform": "copy"
}
```

---

## ⚡ Performance Optimization & DOM Management

Handling 30-40 video streams on a single web page can cause severe memory leaks and UI lag if all video tags are instantiated with active `src` attributes simultaneously.

To ensure high 60 FPS performance:

1. **Lazy Loading via `useIntersectionObserver`**:
   - The `<VideoPlayer />` receives an `isActive` flag driven by an IntersectionObserver with a `rootMargin` of `100px 0px 100px 0px`.
   - Cards out of view render lightweight `<img>` posters instead of active `<video>` tags.
2. **Strict Active Limit ($\le 10$ Active Videos)**:
   - Only cards inside or immediately adjacent to the viewport instantiate HTML5 `<video>` tags.
3. **Automatic Video Pausing**:
   - When a video card scrolls off-screen, its playback is immediately paused to release decoder threads.
4. **React Component Memoization**:
   - `VideoCard` and `VideoPlayer` are wrapped in `React.memo` with stable props to prevent re-renders during scrolling.

---

## 📂 Project Structure

```
d:\Harsh's projects\Task\
├── backend/
│   ├── data/
│   │   └── videos.json (36 video records)
│   ├── controllers/
│   │   └── videoController.js
│   ├── routes/
│   │   └── videoRoutes.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoCarousel.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── VideoModal.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── VideoControls.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── Spinner.jsx
│   │   ├── hooks/
│   │   │   └── useIntersectionObserver.js
│   │   ├── services/
│   │   │   └── videoApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

---

## 🚢 Production Deployment

- **Frontend Deployment (Vercel)**:
  Set `VITE_API_URL` environment variable to point to your live backend domain (e.g. `https://your-backend.onrender.com/api`).
- **Backend Deployment (Render/Railway)**:
  Configure `PORT` environment variable and host `server.js` using Node.js runtime.
