# 🧠 AlgoVisualizer

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-ISC-blue" />
</p>

<p align="center">
  <strong>Visualize • Learn • Practice • Master Data Structures & Algorithms</strong>
</p>

---

## 📖 Overview

**AlgoVisualizer** is an interactive learning platform that transforms traditional DSA learning into a hands-on visual experience.

Instead of memorizing algorithms from textbooks, users can **watch every step**, understand **why it works**, track their learning progress, and ask an integrated **AI tutor** whenever they get stuck.

Whether you're preparing for coding interviews, learning computer science fundamentals, or improving problem-solving skills, AlgoVisualizer provides an engaging environment to accelerate your learning.

---

# ✨ Features

## 🎥 Interactive Algorithm Visualizations

Watch algorithms execute in real time with animated visualizations.

### Supported Algorithms

### Sorting
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort

### Searching
- Linear Search
- Binary Search

### Pattern-Based Problems
- Two Pointers
- Sliding Window
- Recursion
- Backtracking

---

## ⚡ Playback Controls

Every visualization includes:

- ▶️ Play
- ⏸ Pause
- ⏩ Speed Control
- ⏮ Previous Step
- ⏭ Next Step
- 🔄 Restart Simulation

---

## 📝 Pseudo Code Execution

Follow the algorithm line-by-line while the visualization runs.

Features include:

- Current line highlighting
- Execution flow
- Variable updates
- State transitions

Perfect for beginners trying to connect code with animation.

---

## 📊 Complexity Analysis

Each algorithm displays:

- Time Complexity
- Space Complexity
- Best Case
- Average Case
- Worst Case



## 🤖 AI Study Assistant

Powered by **Google Gemini 2.0 Flash**

The integrated chatbot can:

- Explain algorithms
- Solve doubts
- Debug logic
- Explain Time Complexity
- Compare algorithms
- Generate examples
- Provide interview tips

Example questions:

> Why is Merge Sort faster than Bubble Sort?

> Explain Binary Search using an example.

> What is the difference between DFS and BFS?

---

## 📈 Learning Progress

Registered users can:

- Save completed topics
- Continue where they left off
- Track learning history
- Monitor completion percentage

---

## 🔐 Authentication

Secure authentication using

- JWT
- Password hashing with bcrypt
- Protected API routes

---

# 🏗️ Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- React Router
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite
- JWT Authentication
- bcrypt
- Zod Validation
- Axios

---

## AI

- Google Gemini 2.0 Flash API

---

# 📂 Project Structure

```
AlgoVisualizer

├── frontend
│   ├── public
│   ├── src
│   │
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── store
│   ├── types
│   ├── data
│   ├── App.tsx
│   └── main.tsx
│
├── backend
│   ├── prisma
│   ├── src
│   │
│   ├── controllers
│   ├── middlewares
│   ├── routes
│   ├── utils
│   ├── app.ts
│   └── server.ts
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- npm

---

## Clone Repository

```bash
git clone https://github.com/yourusername/AlgoVisualizer.git

cd AlgoVisualizer
```

---

# Backend Setup

Navigate to backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
PORT=5000

DATABASE_URL="file:./dev.db"

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Run migrations

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Start backend

```bash
npm run dev
```

Runs on

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd ../frontend
```

Install packages

```bash
npm install
```

Start Vite

```bash
npm run dev
```

Runs on

```
http://localhost:5173
```

---

# 🔗 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

---

## Progress

| Method | Endpoint |
|---------|----------|
| GET | `/api/progress` |
| POST | `/api/progress/:algorithmId` |

---

## AI Chatbot

| Method | Endpoint |
|---------|----------|
| POST | `/api/chatbot` |

---

## Health Check

| Method | Endpoint |
|---------|----------|
| GET | `/health` |

---

# 🔒 Authentication

Protected endpoints require

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 🛠 Environment Variables

| Variable | Description |
|-----------|-------------|
| PORT | Backend Port |
| DATABASE_URL | SQLite Database |
| JWT_SECRET | Secret key used for JWT |
| GEMINI_API_KEY | Google Gemini API Key |

---

# 🌟 Upcoming Features

- ✅ Graph Algorithms
- ✅ Dynamic Programming Visualizer
- ✅ Tree Visualizer
- ✅ Graph Visualizer
- ✅ AI Code Review
- ✅ Interactive Coding Playground
- ✅ Leaderboards
- ✅ Achievement Badges
- ✅ Daily Challenges
- ✅ Dark / Light Theme
- ✅ Docker Support
- ✅ PostgreSQL Support
- ✅ Unit Testing

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

# 💡 Future Vision

The long-term goal of **AlgoVisualizer** is to become a complete interview preparation platform featuring:

- Interactive DSA Roadmaps
- AI Interview Coach
- Live Coding Battles
- Company-wise Question Sets
- Personalized Learning Recommendations
- Collaborative Study Rooms
- Competitive Programming Tracker

---

# 🙌 Acknowledgements

This project is built using amazing open-source technologies.

- React
- Express.js
- Prisma
- Tailwind CSS
- Framer Motion
- Google Gemini API
- TypeScript
- Vite

---

# 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
Made with ❤️ for developers who learn by building.
</p>
