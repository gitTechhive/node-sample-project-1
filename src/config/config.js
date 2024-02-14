const path = require('path')
const fs = require('fs')

// Set the directory path for the image folder
const imagePath = path.join(__dirname, "../../Upload/Document/");

// Check if the directory already exists
if (!fs.existsSync(imagePath)) {
    // Create the directory
    fs.mkdirSync(imagePath, { recursive: true });
}

module.exports = {
    imagePath
}