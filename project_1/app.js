// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./db/connect');

// Import routes
const contactRoutes = require('./routes/contacts');

// Initialize express app
const app = express();

// Middleware
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse JSON request bodies

// Routes
app.use('/contacts', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Contacts API is running. Use /contacts endpoint');
});

// Define port
const port = process.env.PORT || 3000;

// Start server and connect to database
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Then start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Try: http://localhost:${port}/contacts`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server function
startServer();