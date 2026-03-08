# Study Buddy - Quick Start Guide

Get Study Buddy running in 2 minutes!

## One-Line Setup

```bash
cd backend && npm install && npm start
```

Then in another terminal:

```bash
# Python 3
python -m http.server 8000

# OR Node
npx http-server
```

Visit: **http://localhost:8000**

## What You Get

✅ **5 Quiz Questions** - Progressive difficulty with instant feedback
✅ **Detailed Explanations** - Deep dive into key concepts  
✅ **Mini Challenge** - Practical exercise to apply learning
✅ **Progress Tracking** - See your quiz completion status
✅ **Clean UI** - Modern, responsive design

## Usage

1. Enter any topic: "Climate Change", "JavaScript Promises", "Ancient Rome"
2. Click "Generate Study Content"
3. Answer quiz questions (click options for instant feedback)
4. Read the detailed explanation
5. Complete the mini challenge
6. Click "New Topic" to start over

## Features

- **Instant Generation**: AI-powered content created on demand
- **Progressive Learning**: Questions increase in difficulty
- **Real-time Feedback**: See correct answers immediately
- **Mobile Ready**: Works on phones, tablets, and desktops

## API Key

The app includes a demo API key. For production use:

1. Get an API key from https://openrouter.ai/keys
2. Set environment variable: `export OPENROUTER_API_KEY=your-key`
3. Restart backend

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection error | Make sure backend is running on port 3000 |
| Questions won't generate | Check OpenRouter API key and rate limits |
| Blank page | Open browser console (F12) for errors |

## Backend Endpoints

- `POST /api/generate` - Generate study content for a topic
- `GET /health` - Check server status

## Files

- `index.html` - Frontend UI
- `script.js` - Frontend logic
- `backend/server.js` - API server
- `backend/package.json` - Dependencies

That's it! You're ready to study smarter! 🚀