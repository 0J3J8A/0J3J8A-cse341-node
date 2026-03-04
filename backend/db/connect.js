// backend/db/connect.js
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client;
      console.log('Connected to MongoDB successfully');
      callback(null, _db);
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB:', err);
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized. Call initDb first.');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};