require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Security Middleware ────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());   // Gzip compression for responses

// Rate limiting — only in production to prevent brute-force / abuse
if (process.env.NODE_ENV === 'production') {
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200,                  // limit each IP to 200 requests per window
        standardHeaders: true,
        legacyHeaders: false,
        message: { message: 'Too many requests, please try again later.' },
    });
    app.use('/api', apiLimiter);

    // Stricter limiter for auth endpoints
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        message: { message: 'Too many login attempts, please try again after 15 minutes.' },
    });
    app.use('/api/auth', authLimiter);
}

// ─── CORS ───────────────────────────────────────────────────────
const rawOrigins = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(url => url.trim().replace(/\/$/, ''));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const originClean = origin.replace(/\/$/, '');

        // Allow if in allowedOrigins OR if we're not in strict production mode currently
        if (allowedOrigins.includes(originClean) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// ─── Body Parsers ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'College Placement Management System API is running ✅',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});

// ─── Serve frontend in production ───────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(frontendDist));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

// ─── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Internal server error',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});
