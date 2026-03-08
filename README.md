# Study Buddy - AI-Powered Study Assistant

Study Buddy is an intelligent learning application that helps users master any topic through AI-generated quiz questions, detailed explanations, and interactive mini challenges.

## Features

- **Smart Topic Analysis**: Enter any topic and get AI-curated study content
- **5 Quiz Questions**: Progressively challenging questions with immediate feedback
- **Detailed Explanations**: In-depth coverage of key concepts and how they relate
- **Mini Challenges**: Practical exercises that test real-world understanding
- **Progress Tracking**: See your quiz completion status
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
/workspace/
├── index.html          # Frontend UI (static HTML)
├── script.js           # Frontend logic (vanilla JavaScript)
├── README.md           # This file
└── backend/
    ├── server.js       # Express.js backend server
    ├── package.json    # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Set API Key (Optional)**

   The app uses OpenRouter API for content generation. By default, it uses a demo key. To use your own API key:

   ```bash
   export OPENROUTER_API_KEY="your-api-key-here"
   ```

3. **Start the Backend Server**

   ```bash
   cd backend
   npm start
   ```

   The server will run on `http://localhost:3000`

4. **Serve the Frontend**

   In another terminal, serve the root directory:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node's http-server
   npx http-server
   ```

   Open your browser to `http://localhost:8000`

## How It Works

1. **Enter a Topic**: Type any subject you want to learn (e.g., "Photosynthesis", "Python Decorators")
2. **Generate Content**: Click "Generate Study Content" to create AI-powered study materials
3. **Answer Quiz Questions**: Work through 5 questions that progressively increase in difficulty
4. **Review Explanations**: Read detailed breakdowns of key concepts
5. **Complete the Challenge**: Apply your learning with a practical mini-challenge
6. **Track Progress**: See how many questions you've answered

## Technology Stack

**Frontend:**
- HTML5
- Vanilla JavaScript (ES6+)
- CSS3 with Flexbox

**Backend:**
- Node.js
- Express.js
- OpenRouter API (for AI content generation)

## API Endpoints

### POST /api/generate

Generates study content for a given topic.

**Request:**
```json
{
  "topic": "Photosynthesis"
}
```

**Response:**
```json
{
  "topic": "Photosynthesis",
  "overview": "Overview text...",
  "questions": [
    {
      "id": 1,
      "question": "What is photosynthesis?",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0,
      "explanation": "Explanation text..."
    }
  ],
  "explanation": "Detailed explanation...",
  "challenge": {
    "prompt": "Challenge prompt...",
    "placeholder": "Input placeholder...",
    "acceptableAnswers": ["answer1", "answer2"],
    "explanation": "Challenge explanation..."
  }
}
```

## Customization

### Styling

All styles are contained in the `<style>` tag in `index.html`. Modify colors, fonts, and layouts as needed.

### API Model

To change the AI model used, edit `backend/server.js` and modify the `model` field in the fetch request. Current: `meta-llama/llama-2-70b-chat`

### Content Format

Adjust the prompt in `backend/server.js` to change the structure or difficulty of generated questions.

## Troubleshooting

- **Backend connection error**: Ensure backend is running on port 3000
- **API errors**: Check your OpenRouter API key and rate limits
- **Invalid JSON response**: The AI model may need adjustment; try regenerating

## Future Enhancements

- User accounts and progress history
- Multiple difficulty levels
- Spaced repetition algorithm
- Export study notes
- Collaboration features
- Offline mode with cached content

## License

MIT - Feel free to use and modify for personal or commercial projects.