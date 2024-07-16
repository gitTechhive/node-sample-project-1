const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: 'Z',
})
// console.log("hello");
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

module.exports = connection;
