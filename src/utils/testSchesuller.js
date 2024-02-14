const cron = require('node-cron');
const axios = require('axios');

const makeApiCall = async () => {
    try {
        // console.log(process.env.URL);
        const response = await axios.post(process.env.URL + '/test');
        console.log('API call successful:', response.data);
    } catch (error) {
        console.error('API call error:', error.message);
    }
};

// -->'*/10 * * * * *' scheduler will run every 10 seconds
// ==>'1 0 * * *' scheduler will run every 24 hours on 00:01 everyday
const task = cron.schedule('1 0 * * *', () => {
    console.log('Customer Expiry Running scheduled task...');
    makeApiCall();
}, {
    timezone: 'Asia/Kolkata'
});
