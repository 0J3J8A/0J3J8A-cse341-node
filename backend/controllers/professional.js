// backend/controllers/professional.js
const mongodb = require('../db/connect');

const getData = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const result = await db.db().collection('user').find();
    
    result.toArray().then((lists) => {
      if (lists.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]); // we just need the first one (the only one)
      } else {
        res.status(404).json({ message: 'No data found' });
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getData };