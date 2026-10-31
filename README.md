# Code Nova (Algoverse) 🚀

> **An interactive 3D Computer Science learning platform, algorithm visualizer, and real-time coding arena.**

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Platform-FF4500?style=for-the-badge)](https://github.com/Samani-zubaida/CodeNova)
[![GitHub Repo](https://img.shields.io/badge/📂_Source_Code-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Samani-zubaida/CodeNova)
[![Author](https://img.shields.io/badge/👩‍💻_Author-Yusra_Samani-4F46E5?style=for-the-badge)](https://github.com/samaniyusra)

<br/>

![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

</div>

---

## ⚡ What is Code Nova?

**Code Nova** makes learning Data Structures, Object-Oriented Programming, and Cryptography intuitive by replacing static code with **interactive 2D/3D simulations**, a **live polyglot sandbox**, and **multiplayer coding battles**.

- 🎯 **Visual Intuition**: Step through 40+ algorithms and 13 ciphers with live pointers, color-coded state matrices, and custom data inputs.
- 💻 **Browser Code Runner**: Write and run **Python, JavaScript, C++, or Java** code in real-time with automated AI Big-O complexity detection.
- ⚔️ **Gamified PvP Duels**: Challenge peers to live 1v1 coding battles with real-time WebSocket synchronization.

---

## 🎮 Core Features

| Feature | Description | Highlight |
| :--- | :--- | :--- |
| 📊 **DSA Visualizer** | 8 suites & 40+ algorithms (Arrays, Trees, Graphs, Stacks, Queues, Heaps, Linked Lists, Strings). | Step-by-step playback, custom input generation, and $O(N)$ metric tracking. |
| 🏛️ **OOP Pillars Universe** | Interactive visual models for the 4 core pillars: **Encapsulation, Abstraction, Inheritance, and Polymorphism**. | Data-hiding vaults, live class trees, and dynamic method dispatch (vtables). |
| 🔒 **Cryptography Studio** | 13 ciphers spanning modern standards (**AES-256, RSA, Diffie-Hellman, SHA-256**) and historical ciphers (**Enigma, Caesar, Playfair**). | Step-by-step round matrices, key agreements, and bitwise schedules. |
| ⚡ **Polyglot Code Sandbox** | Full in-browser Monaco IDE supporting **Python 3, JavaScript, C++17, and Java 17**. | Isolated cloud execution + **Google Gemini AI** Big-O time & space complexity analysis. |
| ⚔️ **1v1 Real-Time Duels** | Live multiplayer competitive coding over **Socket.IO**. | Matchmaking queue, synchronized countdown timers, and XP leaderboard. |
| 🪐 **3D Virtual Library** | Interactive 3D room built with **Three.js & React Three Fiber**. | Spatial bookshelf navigation, realistic lighting, and camera lerping. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Three.js, React Three Fiber (R3F), Tailwind CSS v4, Framer Motion, Monaco Editor, Zustand.
- **Backend**: Node.js, Express 5, Socket.IO (WebSockets), Mongoose, JWT, Bcrypt.
- **Database**: MongoDB Atlas (Cloud) + Zero-config local persistent storage fallback.
- **AI & Sandboxing**: Google Gemini 2.0 Flash API, OpenRouter, JDoodle Cloud Execution API.

---

## 🚀 Quick Start (Run Locally in 3 Minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/Samani-zubaida/CodeNova.git
cd CodeNova
```

### 2. Start Backend
```bash
cd backend
npm install
npm start
# 🟢 Backend running at: http://localhost:5000
```
*(Runs out-of-the-box with built-in resilient local storage even without MongoDB credentials)*

### 3. Start Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# 🟢 Frontend running at: http://localhost:5173
```
Open **`http://localhost:5173`** in your browser!

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create account & send verification |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/sandbox/execute` | Execute Python, JS, C++, or Java code |
| `POST` | `/api/sandbox/visualize` | Analyze code complexity via Gemini AI |
| `POST` | `/api/ai/hint` | Generate non-spoiling coding hint (Gemini AI) |
| `WS` | `joinQueue`, `submitAnswer` | Real-time 1v1 PvP coding duels (Socket.IO) |

---

## 👩‍💻 Author & Connect

- **Developer**: **Yusra Samani**
- **GitHub**: [@samaniyusra](https://github.com/samaniyusra)
- **Repository**: [Samani-zubaida/CodeNova](https://github.com/Samani-zubaida/CodeNova)
- **Email**: [samaniyusra44@gmail.com](mailto:samaniyusra44@gmail.com)

⭐ **Star the repo** if you found this project helpful!
