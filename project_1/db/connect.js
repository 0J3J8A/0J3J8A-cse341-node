// db/connect.js
// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Import mongoose
const mongoose = require('mongoose');

// Connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;