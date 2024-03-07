// Importing the 'swagger-jsdoc' library
const swaggerJSDoc = require('swagger-jsdoc');
require('../route/routes.js')
// Swagger definition object defining metadata about the API
const swaggerDefinition = {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
        title: 'Sample-Dashboard-1', // Title of the API
        version: '1.0.0', // Version of the API
        description: 'Portfolia Projects' // Description of the API
    },
    servers: [
        {
            url: 'http://localhost:4001' // Base URL of the API
        }
    ],
    components: {
        securitySchemes: {
            jwt: {
                type: 'http', // Type of security scheme
                scheme: 'bearer', // Authentication scheme
                bearerFormat: 'JWT' // Format of the JWT token
            }
        }
    },
    security: [{
        jwt: [] // Security definition, in this case, JWT is used
    }]
};

// Options for generating Swagger documentation
const options = {
    swaggerDefinition: swaggerDefinition, // Specify the Swagger definition
    apis: ['./src/route/routes.js'] // Path to the files containing API route definitions
};

// Generate Swagger specification using swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Exporting the Swagger definition and specification for use in other modules
module.exports = {
    swaggerDefinition,
    swaggerSpec,
};
