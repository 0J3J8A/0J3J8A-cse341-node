// swagger.js
const swaggerAutogen = require('swagger-autogen')();

// Documentation configuration for Swagger
const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts. This documentation allows you to test all CRUD operations.',
    version: '1.0.0'
  },
  // IMPORTANT: Change this to your Render URL when deployed
  // For local development: localhost:3000
  // For production: your-app-name.onrender.com
  host: 'zeroj3j8a-cse341-node-project-1.onrender.com',
  // Change to ['https'] for production
  schemes: ['https'],
  basePath: '/',
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Contacts',
      description: 'Endpoints for creating, reading, updating and deleting contacts'
    }
  ],
  definitions: {
    // Schema for creating/updating a contact
    Contact: {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      favoriteColor: 'green',
      birthday: '1988-11-23'
    },
    // Response schema for a single contact
    ContactResponse: {
      success: true,
      data: {
        _id: '60d21b4667d0d8992e610c85',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
        favoriteColor: 'green',
        birthday: '1988-11-23',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    },
    // Response schema for list of contacts
    ContactsListResponse: {
      success: true,
      count: 1,
      data: [
        {
          _id: '60d21b4667d0d8992e610c85',
          firstName: 'Maria',
          lastName: 'Garcia',
          email: 'maria.garcia@email.com',
          favoriteColor: 'green',
          birthday: '1988-11-23',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    },
    // Error response schema
    ErrorResponse: {
      success: false,
      error: 'Error message'
    },
    // Response schema for POST request (returns only the id)
    CreateContactResponse: {
      success: true,
      data: {
        id: '60d21b4667d0d8992e610c85'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// Generate swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc);