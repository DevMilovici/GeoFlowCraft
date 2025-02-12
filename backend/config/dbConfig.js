const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    url: process.env.MONGODB_URL || 'mongodb://admin:admin@localhost:27017',
    options: {
        serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
    }
};