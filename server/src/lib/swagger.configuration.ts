// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Stranger API',
      description: 'API for Stranger, an application for people who love languages!',
      contact: {
        name: 'frostzt',
      },
      servers: ['http://localhost:5000'],
      version: '3.0.3',
    },
  },
  apis: ['../api/*.js'],
};

export default swaggerOptions;
