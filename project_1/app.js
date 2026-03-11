// app.js
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

// Swagger imports
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Initialize express app
const app = express();

// Middleware
app.use(cors());           // Enable CORS for all routes
app.use(express.json());   // Parse JSON request bodies

// Routes
app.use('/contacts', contactRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>Contacts API</h1>
    <p>The API is running successfully!</p>
    <ul>
      <li><a href="/contacts">View all contacts (JSON)</a></li>
      <li><a href="/api-docs">View API Documentation (Swagger UI)</a></li>
    </ul>
    <p>Available endpoints:</p>
    <ul>
      <li>GET /contacts - Get all contacts</li>
      <li>GET /contacts/:id - Get a contact by ID</li>
      <li>POST /contacts - Create a new contact</li>
      <li>PUT /contacts/:id - Update a contact</li>
      <li>DELETE /contacts/:id - Delete a contact</li>
    </ul>
  `);
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
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
      console.log('\n' + '='.repeat(50));
      console.log(`Server is running!`);
      console.log('='.repeat(50));
      console.log(`Local: http://localhost:${port}`);
      console.log(`Contacts: http://localhost:${port}/contacts`);
      console.log(`Swagger Docs: http://localhost:${port}/api-docs`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server function
startServer();