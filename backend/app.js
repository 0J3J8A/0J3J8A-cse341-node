// backend/app.js
const express = require('express');
const mongodb = require('./db/connect');
const professionalRoutes = require('./routes/professional');

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());

// CORS middleware - allows requests from any origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Routes
app.use('/professional', professionalRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running. Use /professional endpoint to get data');
});

// Initialize database and start server
mongodb.initDb((err) => {
  if (err) {
    console.log('Failed to connect to database:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`=================================`);
      console.log(`Server is running!`);
      console.log(`URL: http://localhost:${port}`);
      console.log(`Database: Connected to MongoDB`);
      console.log(`Endpoint: http://localhost:${port}/professional`);
      console.log(`=================================`);
    });
  }
});