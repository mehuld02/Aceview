# AceView – AI-Powered Learning & Skill Development Platform

**AceView** is an AI-powered learning and skill-development platform designed to make learning more interactive, engaging, and accessible. It combines the power of the MERN stack and Google's Gemini API to provide students with intelligent learning assistance, coding practice, interactive games, peer mentorship, and mock interview experiences.

AceView aims to create an all-in-one learning ecosystem where students can develop technical skills, practice problem-solving, connect with other learners, and prepare for job interviews.

## 🚀 Key Features

### 1. Home – Learning Dashboard
- Centralized platform for accessing learning features.
- Easy navigation between different learning modules.
- Provides a unified learning experience.

### 2. Practice – Improve Your Skills
- Dedicated section for skill development and practice.
- Helps learners strengthen their technical knowledge.
- Encourages consistent learning and problem-solving.

### 3. Games – Learn Through Gaming
- Interactive gaming experience for learners.
- Makes learning more engaging through gamification.
- Encourages logical thinking and active participation.

### 4. SkillSwap – Peer Learning & Mentorship
- Platform for connecting learners and sharing knowledge.
- Encourages peer-to-peer learning and mentorship.
- Helps users exchange skills and learn collaboratively.

**Live Platform:** https://aceview-mentorshiplive.netlify.app/

### 5. Mock Interview – Interview Preparation
- Provides an environment for interview practice.
- Helps students prepare for technical interviews.
- Supports interview readiness and confidence building.

### 6. AI-Powered Learning with Gemini
- Integrates Google's Gemini API.
- Uses a Large Language Model (LLM) to understand user prompts.
- Generates intelligent, context-aware responses.
- Supports AI-driven educational assistance and content generation.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI Integration | Google Gemini API |
| AI Concepts | Generative AI, LLM, NLP, Prompt Engineering |
| Development Tools | VS Code, Git, GitHub, Postman |

## 🏗️ System Architecture

AceView follows the MERN stack architecture with an external AI integration.

**Application Workflow:**

1. Users access the platform through the React frontend.
2. They navigate between learning modules such as Practice, Games, SkillSwap, and Mock Interview.
3. Frontend requests are handled by the Node.js and Express.js backend.
4. MongoDB manages application data.
5. The Gemini API processes AI-related requests and generates responses.
6. Results are displayed through the frontend interface.

## 🤖 AI Integration – Google Gemini API

AceView integrates Google's Gemini API to introduce Generative AI capabilities into the learning experience.

**AI Technologies Used:**
- **Generative AI:** Generates responses and educational content.
- **Large Language Model (LLM):** Understands prompts and generates natural-language responses.
- **Natural Language Processing (NLP):** Enables interaction through human language.
- **Prompt Engineering:** Helps guide the AI model to generate relevant responses.

**Important:** AceView integrates a pre-trained Gemini model through its API. It does not involve training a custom AI model from scratch.

## ⚙️ Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB
- Git
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/mehuld02/Aceview.git
cd AceView
```

### 2. Install Dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

*Update the folder names according to your actual project structure.*

### 3. Configure Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Never expose your API keys or commit your `.env` file to GitHub.

### 4. Run the Application

Start the backend:

```bash
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local development URL displayed in your terminal.

## 📂 Main Modules

| Module | Purpose |
|---|---|
| Home | Main learning dashboard |
| Practice | Skill development |
| Games | Interactive learning |
| SkillSwap | Peer learning and mentorship |
| Mock Interview | Interview preparation |
| Gemini AI | Intelligent learning assistance |

## 🎯 Project Objectives

- Build an integrated learning and skill-development platform.
- Make education more interactive through gamification.
- Integrate Generative AI into the learning experience.
- Encourage collaborative learning through mentorship.
- Help students improve their technical and interview skills.
- Provide a centralized environment for continuous learning.

## 🔮 Future Scope

- AI-based personalized learning recommendations.
- AI-generated quizzes and coding challenges.
- Real-time voice-based mock interviews.
- Advanced student performance analytics.
- Gamified learning achievements and leaderboards.
- Multilingual AI learning assistance.
- Expanded peer mentorship and collaboration features.


## 🏁 Conclusion

AceView brings together learning, practice, gaming, mentorship, and interview preparation in one platform. By combining MERN stack technologies with Google's Gemini API, it aims to create an engaging and intelligent environment that helps students continuously develop their knowledge and professional skills.

---

**AceView – Learn Smarter. Practice Better. Grow Together.**