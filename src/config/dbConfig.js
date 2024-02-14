// Import the mysql2 library
const mysql = require('mysql2');

// Create a connection pool for handling database connections
const connection = mysql.createConnection({
    // Use environment variables to securely store sensitive data
    host: process.env.DB_HOST, // Database host
    user: process.env.DB_USER, // Database user
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name
    timezone: 'Z', // Set timezone to UTC
});

// Export the connection pool to be used in other modules
module.exports = connection;
