# QuickAI - Virtual Assistant

A full-stack AI-powered virtual assistant built with React and Node.js, featuring voice recognition, speech synthesis, and intelligent responses powered by Google's Gemini AI.

## 🚀 Features

- **Voice Recognition**: Hands-free interaction using speech recognition
- **AI-Powered Responses**: Intelligent responses using Google Gemini AI
- **User Authentication**: Secure signup/login with JWT tokens
- **Customizable Assistant**: Personalize your AI assistant's name and appearance
- **Real-time Communication**: Voice-to-voice interaction with your assistant
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

### AI Integration
- Google Gemini AI API
- Speech Recognition API
- Speech Synthesis API

## 📁 Project Structure

```
quickAi/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   └── assets/        # Static assets
├── server/                 # Node.js backend
│   ├── config/            # Database and token configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
└── package.json          # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PragyaTripathi990/Quick_AI.git
   cd Quick_AI
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the `server/` directory:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GEMINI_API_KEY
   PORT=8000
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   npm run dev
   
   # In another terminal, start frontend
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5177
   - Backend API: http://localhost:8000

## 📱 Usage

1. **Sign Up**: Create a new account with your name, email, and password
2. **Customize Assistant**: Choose your assistant's name and appearance
3. **Start Talking**: Say your assistant's name to activate voice recognition
4. **Interact**: Ask questions, request actions, or have conversations with your AI assistant

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/logout` - User logout

### User Management
- `GET /api/user/current` - Get current user data
- `POST /api/user/update` - Update user profile
- `POST /api/user/asktoassistant` - Send command to AI assistant

## 🎯 Features in Detail

### Voice Recognition
- Continuous listening for assistant activation
- Automatic speech-to-text conversion
- Error handling for microphone permissions

### AI Assistant
- Context-aware responses using Gemini AI
- Support for various command types (search, calculator, social media, etc.)
- Personalized responses based on user data

### User Experience
- Responsive design for all devices
- Real-time status indicators
- Smooth animations and transitions
- History tracking for conversations

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent responses
- React and Node.js communities
- Tailwind CSS for styling
- All open-source contributors

---

**QuickAI** - Your intelligent virtual assistant powered by AI! 🤖✨
