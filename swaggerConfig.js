const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentation for your API",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Point to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
