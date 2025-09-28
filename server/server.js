import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import connectDB from './config/db.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import geminiResponse from './gemini.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS: reflect request origin and allow credentials
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure CORS headers are always set for credentialed requests
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// Note: The CORS middleware above handles preflight automatically; no explicit app.options('*') route needed in Express 5
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('server is LIVE');
})

const PORT = process.env.PORT || 8000;
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.get('/', async (req, res) => {
    let prompt = req.query.prompt;
    await geminiResponse(prompt)
})
connectDB();

// Export app for Vercel serverless; only listen locally
export default app;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}
