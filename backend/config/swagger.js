const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API para Visualización Interactiva de Redes de Networking en 4Life',
      version: '1.0.0',
      description: 'API REST para la gestión y visualización de redes de afiliados en 4Life',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'sergio.perez@unad.edu.co'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Affiliates',
        description: 'Endpoints para gestión de afiliados'
      },
      {
        name: 'CSV',
        description: 'Endpoints para importación y exportación CSV'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

