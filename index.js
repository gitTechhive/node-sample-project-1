// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import required modules
const port = process.env.PORT || 4000; // Use provided PORT or default to 4000
const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/route/routes'); // Import API routes
const jwtAuthentication = require('./src/authConfig/jwtAuthentication'); // JWT authentication middleware
const expressFileUpload = require('express-fileupload'); // Middleware for file uploads
const path = require('path');
const fs = require('fs')
const logger = require('./src/helper/logger'); // Custom logger
const swaggerUi = require('swagger-ui-express'); // Swagger UI for API documentation
const swaggerConfig = require('./src/config/swaggerConfig'); // Swagger configuration
const StompServer = require('stomp-broker-js'); // Stomp server for messaging
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('./src/config/config')

// Set up CORS middleware to allow cross-origin requests
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define path to the folder containing uploaded images
const imageFolder = path.join(__dirname, '/Upload/Document');
// Serve static files from the image folder
app.use('/images', express.static(imageFolder));

// Serve Swagger documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerSpec));

// Log incoming requests
app.use(logger.log);

// Handle file uploads
app.use(expressFileUpload());

// Authenticate requests using JWT
app.use(jwtAuthentication.auth);

// Define API routes
routes(app);

// Set up Stomp server for messaging
const stompServer = new StompServer({
    server: server,
    path: '/stomp', // WebSocket endpoint path
    protocol: 'ws', // Use WebSocket protocol
    heartbeat: [2000, 2000] // Heartbeat interval for WebSocket connections
});

// Subscribe to '/echo' channel and forward messages
stompServer.subscribe('/echo', (msg, headers) => {
    let path = '/';
    let message = '';
    if (headers.path) {
        path = headers.path;
    }
    if (msg) {
        message = msg;
    }
    stompServer.send(path, {}, message);
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    require('./src/utils/testSchesuller'); // Start any additional server tasks
    require('./src/utils/captchaScheduller')
});
