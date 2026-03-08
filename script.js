class StudyBuddy {
    constructor() {
        this.topicInput = document.getElementById('topicInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.contentArea = document.getElementById('contentArea');
        this.currentTopic = '';
        this.studyContent = null;
        this.selectedAnswers = {};
        this.challengeAnswered = false;

        this.generateBtn.addEventListener('click', () => this.handleGenerate());
        this.topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleGenerate();
        });
    }

    async handleGenerate() {
        const topic = this.topicInput.value.trim();
        
        if (!topic) {
            this.showError('Please enter a topic to study');
            return;
        }

        this.currentTopic = topic;
        this.selectedAnswers = {};
        this.challengeAnswered = false;
        this.showLoading();

        try {
            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            this.studyContent = await response.json();
            this.renderContent();
        } catch (error) {
            console.log('Backend unavailable, generating demo content for:', topic);
            this.studyContent = this.generateDemoContent(topic);
            this.renderContent();
        }
    }

    generateDemoContent(topic) {
        const questions = [
            {
                id: 1,
                question: `What is the primary purpose of ${topic}?`,
                options: [
                    `To understand the fundamentals of ${topic}`,
                    `To memorize unrelated facts`,
                    `To skip learning entirely`,
                    `To confuse students`
                ],
                correctIndex: 0,
                explanation: `${topic} serves many purposes. Understanding its primary purpose is the first step in mastery.`
            },
            {
                id: 2,
                question: `How is ${topic} typically applied in practice?`,
                options: [
                    `Never applied`,
                    `Only in theoretical contexts`,
                    `In real-world scenarios and applications`,
                    `Randomly without planning`
                ],
                correctIndex: 2,
                explanation: `${topic} is most effectively applied in real-world situations where it can create meaningful impact.`
            },
            {
                id: 3,
                question: `What is a key benefit of mastering ${topic}?`,
                options: [
                    `It has no benefits`,
                    `Enhanced problem-solving and critical thinking skills`,
                    `Guaranteed fame and fortune`,
                    `Avoiding all challenges`
                ],
                correctIndex: 1,
                explanation: `Mastering ${topic} develops your ability to think critically and solve complex problems effectively.`
            },
            {
                id: 4,
                question: `In which field is ${topic} most commonly studied?`,
                options: [
                    `Only in entertainment`,
                    `Exclusively in sports`,
                    `Across education, professional development, and research`,
                    `Never in any organized field`
                ],
                correctIndex: 2,
                explanation: `${topic} is studied across multiple disciplines including education, business, science, and technology.`
            },
            {
                id: 5,
                question: `What should be your approach after learning about ${topic}?`,
                options: [
                    `Forget everything immediately`,
                    `Practice, apply concepts, and continue learning`,
                    `Ignore all new information`,
                    `Teach others without understanding`
                ],
                correctIndex: 1,
                explanation: `The best way to solidify your knowledge is through consistent practice, real-world application, and continuous learning.`
            }
        ];

        return {
            topic: topic,
            overview: `${topic} is an important subject that encompasses fundamental concepts and practical applications. Learning this topic will enhance your knowledge and problem-solving abilities in meaningful ways.`,
            questions: questions,
            explanation: `Understanding ${topic} is essential for developing a comprehensive knowledge base in your field of study. This subject builds foundational concepts that connect to many other areas of learning. Key concepts include practical application, theoretical understanding, and real-world relevance. By mastering these elements, you develop critical thinking skills and the ability to apply knowledge creatively to new situations. The interconnected nature of these concepts means that understanding one aspect often illuminates others. This holistic approach to learning ensures that you don't just memorize facts, but truly understand the underlying principles.`,
            challenge: {
                prompt: `Can you provide a real-world example of how ${topic} is used in practice? Think about your own experiences or observations.`,
                placeholder: `Share an example of ${topic} in action...`,
                acceptableAnswers: ['example', 'case', 'instance', 'application', 'scenario', 'situation', 'use', 'practice', 'real', 'world'],
                explanation: `Excellent! Connecting theory to real-world examples is one of the most effective ways to deepen your understanding and retain knowledge.`
            }
        };
    }

    renderContent() {
        if (!this.studyContent) return;

        let html = '<div class="content-section">';

        html += this.renderQuestions();
        html += this.renderExplanation();
        html += this.renderChallenge();

        const answered = Object.keys(this.selectedAnswers).length;
        const total = (this.studyContent.questions || []).length;
        if (answered > 0 || total > 0) {
            html += `<div class="score-display">Quiz Progress: ${answered}/${total} answered</div>`;
        }

        html += `<button class="btn btn-secondary" onclick="studyBuddyInstance.resetApp()">New Topic</button>`;

        html += '</div>';
        this.contentArea.innerHTML = html;

        this.attachEventListeners();
        this.generateBtn.classList.remove('loading');
        this.generateBtn.innerHTML = '<span>Generate Study Content</span>';
        this.generateBtn.disabled = false;
    }

    renderQuestions() {
        const questions = this.studyContent.questions || [];
        
        let html = `
            <div class="card">
                <h2>Quiz Questions</h2>
                <div class="questions-container">
        `;

        questions.forEach((q, idx) => {
            const qId = `q${q.id}`;
            const isAnswered = this.selectedAnswers[qId] !== undefined;
            const selectedIndex = this.selectedAnswers[qId];
            const isCorrect = selectedIndex === q.correctIndex;

            html += `
                <div class="question ${isAnswered ? 'active' : ''}">
                    <div class="question-number">Question ${idx + 1} of ${questions.length}</div>
                    <div class="question-text">${this.escapeHtml(q.question)}</div>
                    <div class="options">
            `;

            q.options.forEach((option, optIdx) => {
                let optionClass = '';
                
                if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                        optionClass = 'correct';
                    } else if (optIdx === selectedIndex && !isCorrect) {
                        optionClass = 'incorrect';
                    }
                } else if (optIdx === selectedIndex) {
                    optionClass = 'selected';
                }

                html += `
                    <div class="option ${optionClass}" data-question="${qId}" data-option="${optIdx}">
                        ${this.escapeHtml(option)}
                    </div>
                `;
            });

            if (isAnswered) {
                const feedbackClass = isCorrect ? 'correct' : 'incorrect';
                const feedbackText = isCorrect ? '✓ Correct!' : '✗ Incorrect';
                html += `
                    <div class="answer-feedback ${feedbackClass}">
                        <strong>${feedbackText}</strong> ${this.escapeHtml(q.explanation)}
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderExplanation() {
        const explanation = this.studyContent.explanation || '';
        
        return `
            <div class="card explanation">
                <h2>Key Concepts Explained</h2>
                <div class="explanation-text">
                    ${this.escapeHtml(explanation).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    renderChallenge() {
        const challenge = this.studyContent.challenge || {};
        
        return `
            <div class="card challenge">
                <h2>Mini Challenge</h2>
                <div class="challenge-text">
                    ${this.escapeHtml(challenge.prompt || 'Complete this challenge').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
                </div>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <input 
                        type="text" 
                        id="challengeInput" 
                        placeholder="${this.escapeHtml(challenge.placeholder || 'Enter your answer...')}"
                        style="flex: 1; padding: 0.875rem 1rem; border: 2px solid #ff6b35; border-radius: 8px; font-size: 1rem; outline: none;"
                    >
                    <button id="submitChallengeBtn" class="btn btn-primary" style="margin: 0; background: linear-gradient(135deg, #ff6b35 0%, #ff5300 100%); box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);">
                        Submit
                    </button>
                </div>
                <div id="challengeFeedback"></div>
            </div>
        `;
    }

    attachEventListeners() {
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                const questionId = e.target.dataset.question;
                const optionIndex = parseInt(e.target.dataset.option);
                
                this.selectedAnswers[questionId] = optionIndex;
                this.renderContent();
            });
        });

        const submitBtn = document.getElementById('submitChallengeBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitChallenge());
        }

        const challengeInput = document.getElementById('challengeInput');
        if (challengeInput) {
            challengeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.submitChallenge();
            });
        }
    }

    submitChallenge() {
        if (this.challengeAnswered) return;

        const input = document.getElementById('challengeInput');
        const feedback = document.getElementById('challengeFeedback');
        const userAnswer = input.value.trim().toLowerCase();

        if (!userAnswer) {
            feedback.innerHTML = '<div class="error-message">Please enter an answer</div>';
            return;
        }

        const challenge = this.studyContent.challenge || {};
        const acceptableAnswers = challenge.acceptableAnswers || [];
        
        const isCorrect = acceptableAnswers.some(ans => 
            userAnswer.includes(ans.toLowerCase()) || 
            ans.toLowerCase().includes(userAnswer)
        );

        this.challengeAnswered = true;
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const feedbackText = isCorrect ? '✓ Great work!' : '✗ Not quite right';
        const explanation = challenge.explanation || '';

        feedback.innerHTML = `
            <div class="answer-feedback ${feedbackClass}">
                <strong>${feedbackText}</strong> ${this.escapeHtml(explanation)}
            </div>
        `;

        input.disabled = true;
        document.getElementById('submitChallengeBtn').disabled = true;
    }

    showLoading() {
        this.contentArea.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                    <div class="loading-spinner"></div>
                    <p>Generating your personalized study content...</p>
                </div>
            </div>
        `;

        this.generateBtn.classList.add('loading');
        this.generateBtn.innerHTML = '<div class="loading-spinner"></div><span>Generating...</span>';
        this.generateBtn.disabled = true;
    }

    showError(message) {
        this.contentArea.innerHTML = `<div class="error-message">${this.escapeHtml(message)}</div>`;
        this.generateBtn.classList.remove('loading');
        this.generateBtn.innerHTML = '<span>Generate Study Content</span>';
        this.generateBtn.disabled = false;
    }

    resetApp() {
        this.topicInput.value = '';
        this.contentArea.innerHTML = '';
        this.currentTopic = '';
        this.studyContent = null;
        this.selectedAnswers = {};
        this.challengeAnswered = false;
        this.topicInput.focus();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

let studyBuddyInstance;

document.addEventListener('DOMContentLoaded', () => {
    studyBuddyInstance = new StudyBuddy();
});