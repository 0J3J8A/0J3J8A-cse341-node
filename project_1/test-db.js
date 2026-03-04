// test-db.js
// Load environment variables
require('dotenv').config();

// Import mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('Collection: contacts');
    
    // Get the collection stats
    const db = mongoose.connection.db;
    return db.collection('contacts').countDocuments();
  })
  .then((count) => {
    console.log(`Number of contacts: ${count}`);
    console.log('Test completed, closing connection...');
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });