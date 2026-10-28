import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables safely
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// 1. SECURITY & OPTIMISATION MIDDLEWARES
app.use(helmet()); // Protects against well-known web vulnerabilities by setting HTTP headers correctly
app.use(compression()); // Compresses response bodies for high-performance payload delivery
app.use(express.json({ limit: '10mb' })); // Handles JSON requests safely with body-size ceilings
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurable CORS for production security
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. STRUCTURED LOGGING FOR DOCKER (JSON format for container log aggregators)
if (NODE_ENV === 'production') {
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));
} else {
  app.use(morgan('dev'));
}

// 3. GLOBAL RATE LIMITING (Mitigates DDoS and brute-force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { status: 429, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);
app.use('/api/test',(req,res)=>{
    res.send({
        msg:"millgaya response"
    })
})

// 4. CORE API ROUTES & HEALTH CHECKS
// Crucial for Docker / VPS orchestration health monitoring
app.get('/health', limiter, (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: NODE_ENV,
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

app.get('/api/v1/resource', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the production API gateway.' });
});

// 5. ROBUST 404 AND GLOBAL ERROR HANDLING
// Prevents exposing stack traces to clients while logging errors cleanly
app.use((req, res, next) => {
  res.status(404).json({ status: 404, error: 'Resource Not Found' });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  
  res.status(err.status || 500).json({
    status: err.status || 500,
    error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// 6. GRACEFUL SHUTDOWN ARCHITECTURE (Ensures zero-downtime container replacement)
const server = app.listen(PORT, () => {
  console.log(`[INFO] Server aggressively running in ${NODE_ENV} mode on port ${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`[INFO] Received ${signal}. Starting graceful shutdown sequence...`);
  
  // Stop accepting new connections instantly
  server.close(() => {
    console.log('[INFO] HTTP server closed cleanly. Cleaning up open dependencies...');
    
    // Disconnect databases or active streams here (e.g., await prisma.$disconnect() or mysql.close())
    
    console.log('[INFO] Graceful shutdown complete. Exiting process safely.');
    process.exit(0);
  });

  // Force close after 10 seconds if connections are stubbornly hanging open
  setTimeout(() => {
    console.error('[WARNING] Forced shutdown triggered: open connections did not close in time.');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals from Docker daemon
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled execution traps to prevent the container from dying silently
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[CRITICAL] Uncaught Exception thrown:', error);
  // Optional: Trigger graceful shutdown here depending on your crash strategy
});
