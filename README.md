# ✨ Kuppiya – Collaborative Learning Platform

<p align="center">
  <img src="./sc/1.png" alt="Kuppiya Homepage" width="100%">
</p>

<p align="center">
  <strong>Share Knowledge. Solve Problems. Learn Together.</strong>
</p>

Kuppiya is a collaborative learning platform where students can share coding questions, solve programming challenges, run code directly in the platform, join live mentoring sessions, and contribute educational resources to help others learn.

---

## 📸 Screenshot

<p align="center">
  <img src="./sc/1.png" alt="Kuppiya Screenshot" width="90%">
</p>

---

# 🧪 Environment Variables

## Backend (`/backend`)

```env
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_url

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLIENT_URL=http://localhost:5173
```

## Frontend (`/frontend`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_API_URL=http://localhost:3000/api

VITE_STREAM_API_KEY=your_stream_api_key
```

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Thisurika/SLIIT-IQ.git
cd SLIIT-IQ
```

---

# 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run at:

```
http://localhost:3000
```

---

# 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

# 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Clerk Authentication

### Backend
- Node.js
- Express.js
- MongoDB

### Services
- Stream
- Inngest

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## ⭐ Support

If you like this project, don't forget to **⭐ Star** the repository on GitHub!
