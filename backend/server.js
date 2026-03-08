import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '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';

app.post('/api/generate', async (req, res) => {
    const { topic } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const sanitizedTopic = topic.trim().substring(0, 200);

    const prompt = `You are an expert tutor. Generate comprehensive study content for: "${sanitizedTopic}"

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, pure JSON):
{
    "topic": "${sanitizedTopic}",
    "overview": "A 2-3 sentence overview of the topic",
    "questions": [
        {
            "id": 1,
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "explanation": "Why this answer is correct and brief explanation of the concept"
        },
        {
            "id": 2,
            "question": "Another question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 1,
            "explanation": "Explanation here"
        },
        {
            "id": 3,
            "question": "Third question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 2,
            "explanation": "Explanation here"
        },
        {
            "id": 4,
            "question": "Fourth question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 3,
            "explanation": "Explanation here"
        },
        {
            "id": 5,
            "question": "Fifth and hardest question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "explanation": "Explanation here"
        }
    ],
    "explanation": "A 3-4 paragraph detailed explanation covering key concepts, how they relate, and why they matter",
    "challenge": {
        "prompt": "A specific mini-challenge prompt that tests understanding",
        "placeholder": "Input placeholder text",
        "acceptableAnswers": ["key word or phrase", "another valid answer", "alternative phrasing"],
        "explanation": "Brief explanation of what makes a good answer"
    }
}

Requirements:
- Make questions progressively harder
- Ensure ALL JSON is valid (no syntax errors, proper escaping)
- No markdown, no code blocks, no formatting - plain text only
- Challenge prompt should be actionable and specific
- Include 2-5 acceptable answer variations in the challenge

Return ONLY the JSON object, nothing else.`;

    try {
        const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_KEY}`
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-2-70b-chat',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenRouter API error:', errorData);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        let jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        let studyContent = JSON.parse(jsonMatch[0]);

        if (!studyContent.questions || studyContent.questions.length !== 5) {
            throw new Error('Invalid questions structure');
        }

        if (!studyContent.challenge) {
            studyContent.challenge = {
                prompt: 'Can you apply what you learned to a real-world scenario?',
                placeholder: 'Enter your answer...',
                acceptableAnswers: ['yes', 'applied', 'understood'],
                explanation: 'Great! Applying concepts to real situations deepens understanding.'
            };
        }

        res.json(studyContent);
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Study Buddy backend running on http://localhost:${PORT}`);
});