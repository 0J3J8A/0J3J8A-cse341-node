const db = require('../models');
const Temple = db.temples;

const apiKey =
  'Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N';

// Create a new Temple
exports.create = (req, res) => {
  /*
    #swagger.description = 'Create a new temple'
    #swagger.parameters['apiKey'] = {
      in: 'header',
      description: 'API Key for authentication',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Temple information',
      required: true,
      schema: {
        temple_id: 267,
        name: "Example Temple",
        description: "A beautiful temple",
        location: "City, Country",
        dedicated: "2024",
        additionalInfo: false
      }
    }
  */
  
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  // Create a Temple
  const temple = new Temple({
    temple_id: req.body.temple_id,
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    dedicated: req.body.dedicated,
    additionalInfo: req.body.additionalInfo || false
  });
  
  // Save Temple in the database
  temple
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Temple.',
      });
    });
};

// Retrieve all Temples
exports.findAll = (req, res) => {
  /*
    #swagger.description = 'Get all temples (requires API key)'
    #swagger.parameters['apiKey'] = {
      in: 'header',
      description: 'API Key for authentication',
      required: true,
      type: 'string'
    }
  */
  
  console.log('Headers:', req.headers);
  console.log('API Key:', req.header('apiKey'));
  console.log('API Key:', apiKey);
  console.log('¿Are they the same?', req.header('apiKey') === apiKey);
  
  if (req.header('apiKey') && req.header('apiKey') === apiKey) {
    Temple.find(
      {},
      {
        temple_id: 1,
        name: 1,
        location: 1,
        dedicated: 1,
        additionalInfo: 1,
        _id: 0,
      }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving temples.',
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

// Find a single Temple with temple_id
exports.findOne = (req, res) => {
  /*
    #swagger.description = 'Get a single temple by temple_id (requires API key)'
    #swagger.parameters['temple_id'] = {
      in: 'path',
      description: 'Temple ID',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['apiKey'] = {
      in: 'header',
      description: 'API Key for authentication',
      required: true,
      type: 'string'
    }
  */
  
  const temple_id = req.params.temple_id;
  
  if (req.header('apiKey') && req.header('apiKey') === apiKey) {
    Temple.find({ temple_id: parseInt(temple_id) })
      .then((data) => {
        if (!data || data.length === 0) {
          res.status(404).send({ message: 'Not found Temple with id ' + temple_id });
        } else {
          res.send(data[0]);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving Temple with temple_id=' + temple_id,
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

// Update a Temple by the id (MongoDB _id)
exports.update = (req, res) => {
  /*
    #swagger.description = 'Update a temple by MongoDB _id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB _id',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Fields to update',
      required: true,
      schema: {
        name: "Updated Temple Name",
        location: "Updated Location"
      }
    }
  */
  
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;

  Temple.findByIdAndUpdate(id, req.body, { 
    useFindAndModify: false,
    new: true
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Temple with id=${id}. Maybe Temple was not found!`,
        });
      } else {
        res.send({ message: 'Temple was updated successfully.', temple: data });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Temple with id=' + id,
      });
    });
};

// Delete a Temple with the specified id (MongoDB _id)
exports.delete = (req, res) => {
  /*
    #swagger.description = 'Delete a temple by MongoDB _id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB _id',
      required: true,
      type: 'string'
    }
  */
  
  const id = req.params.id;

  Temple.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Temple with id=${id}. Maybe Temple was not found!`,
        });
      } else {
        res.send({
          message: 'Temple was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Temple with id=' + id,
      });
    });
};

// Delete all Temples from the database
exports.deleteAll = (req, res) => {
  /*
    #swagger.description = 'Delete all temples'
  */
  
  Temple.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Temples were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all temple.',
      });
    });
};

// Find all published Temples
exports.findAllPublished = (req, res) => {
  /*
    #swagger.description = 'Get all published temples'
  */
  
  Temple.find({ additionalInfo: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving temple.',
      });
    });
};