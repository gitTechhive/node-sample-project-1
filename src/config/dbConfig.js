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
connection.connect((err) => {
    if (err) {
        // logger.error('Error connecting to the database:', err.message);
        console.error('Error connecting to the database:', err.message);
        return;
    }
    // logger.info('Connected to the database successfully');
    console.log('Connected to the database successfully');
});

connection.on('error', (err) => {
    // logger.error('Database error:', err.message);
    console.error('Database error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Handle connection lost error (for example, by attempting to reconnect)
    } else {
        throw err;
    }
});

// Export the connection pool to be used in other modules
module.exports = connection;
