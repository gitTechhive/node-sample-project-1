const winston = require('winston');

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1; // Note: Month starts from 0
const day = date.getDate();

// Format the date as desired (e.g., YYYY-MM-DD)
const currentDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

const infoLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(), // Define the log format
    transports: [
        // new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: `${currentDate}.log` }) // Log to a file
    ]
});

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(), // Define the log format
    transports: [
        // new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: `${currentDate}.log` }) // Log to a file
    ]
});

const log = (req, res, next) => {
    let date = new Date()
    let formattedDate = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    infoLogger.info(`Date and Time: ${formattedDate}`)
    infoLogger.info(`Request URL : ${req.url}`)
    infoLogger.info(`IP: ${req.ip}`)
    infoLogger.info(`Request Body : ${JSON.stringify(req.body)}`)
    infoLogger.info(`Method Called: ${req.method}`)
    infoLogger.info(`Request Header: ${JSON.stringify(req.headers)}`);
    next()
}

module.exports = {
    infoLogger,
    errorLogger,
    log
}