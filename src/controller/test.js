// Import required modules and helpers
const commonHelper = require('../helper/commonHelper'); // Helper functions
const config = require('../config/config'); // Configuration settings
const logger = require('../helper/logger'); // Logging utility
const sendMail = require('../helper/emailSender'); // Email sending utility
const Stomp = require('stompjs'); // STOMP client library for messaging

// Connect to STOMP server over WebSocket
const stompClient = Stomp.overWS(process.env.WS);
stompClient.connect({}, (data) => {
    console.log('STOMP is now connected!');

    // Subscribe to the '/topic/notification' channel for receiving notifications for test
    stompClient.subscribe('/topic/notification', (data) => { console.log(data) });
});

// Define function to handle image uploads
const uploadImage = (req, res) => {
    try {
        // Log entry into the uploadImage function
        logger.infoLogger.info("Entered Test");

        // Extract image data from request
        let bodyData = req.files;

        let newUrl;
        // Check if image files exist in the request
        if (req.files && req.files.images) {
            const images = req.files.images;
            let original_name = images.name;
            let extension = original_name.split('.')[1];
            let name = commonHelper.generateFormattedName();
            let formatted_name = name + '.' + extension;

            // Construct URL for the uploaded image
            newUrl = `${req.protocol}://${req.headers["host"]}/images/${formatted_name}`;
            let filePath = `${config.imagePath}${formatted_name}`;

            // Move the image file to the specified file path
            images.mv(filePath, function (err) {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("Image uploaded");

                    // Send a notification over STOMP after successful image upload
                    stompClient.send('/echo', { 'path': `/topic/notification` }, "hyy");
                }
            });
        }

        // Send a test email
        let subject = `test`;
        let defaultText = `hello`;
        sendMail.sendMail('krupa@techhive.co.in', null, null, null, defaultText, subject);

        // Send response with image URL
        res.send({ status: 200, message: "Images", data: newUrl, error: false });
    } catch (error) {
        // Handle errors
        console.log(error);
        res.send({ status: 500, message: "Internal Server Error", data: error, error: true });
    }
}

// Export the uploadImage function for use in other modules
module.exports = {
    uploadImage
}
