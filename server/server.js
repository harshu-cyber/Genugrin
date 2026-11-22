require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('========================================================');
  console.log(`  GENUGRIN HEALTHCARE - OFFICIAL SERVER STARTED         `);
  console.log(`  Developed by: Brajwasi's Coders                       `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`  Port: ${PORT}                                          `);
  console.log(`  API Base URL: http://localhost:${PORT}/api            `);
  console.log(`  Health Check: http://localhost:${PORT}/health         `);
  console.log('========================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // In production, keep running unless critical
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception]: ${err.message}`);
});
