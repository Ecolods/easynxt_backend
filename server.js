const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');

const userRoutes = require('./routes/user.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express(); // Initialize Express app here
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check route
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: 'UP',
//         timestamp: new Date().toISOString(),
//         service: 'SQL Server API'
//     });
// });

// Database connection test route
// app.get('/db-test', async (req, res) => {
//     try {
//         // Test connection directly instead of using dbUtils
//         await db.connect();
//         res.status(200).json({
//             connected: true,
//             message: 'Database connection successful',
//             database: process.env.DB_NAME,
//             server: process.env.DB_SERVER
//         });
//     } catch (error) {
//         res.status(500).json({
//             connected: false,
//             message: 'Database test failed',
//             error: error.message,
//             database: process.env.DB_NAME,
//             server: process.env.DB_SERVER
//         });
//     }
// });

// API Routes
app.use('/api/auth', authRoutes);

app.use('/api', userRoutes);

// Error handler middleware - should be placed after all routes
app.use(errorHandler);

// 404 handler - should be the last route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const startServer = async () => {
    try {
        console.log('🚀 Starting server...');
        console.log(`📊 Database: ${process.env.DB_NAME}@${process.env.DB_SERVER}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
        
        // Try to connect to database, but don't fail if it doesn't work
        console.log('Testing database connection...');
        try {
            await db.connect();
            console.log('✅ Database connected successfully');
        } catch (dbError) {
            console.warn('⚠️ Warning: Database connection failed, but starting server anyway...');
            console.warn('Database Error:', dbError.message);
            console.log('⚠️ Note: Some database features will not work');
        }
        
        // Start Express server even if database connection fails
        const server = app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
            console.log(`🔧 Health check: http://localhost:${PORT}/health`);
            console.log(`🔗 Database test: http://localhost:${PORT}/db-test`);
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n👋 Shutting down gracefully...');
            try {
                await db.close();
            } catch (err) {
                console.log('No database connection to close');
            }
            server.close(() => {
                console.log('💤 Server shut down');
                process.exit(0);
            });
        });

        process.on('SIGTERM', async () => {
            console.log('\n👋 SIGTERM received, shutting down...');
            try {
                await db.close();
            } catch (err) {
                console.log('No database connection to close');
            }
            server.close(() => {
                console.log('💤 Server shut down');
                process.exit(0);
            });
        });

        return server;

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app;