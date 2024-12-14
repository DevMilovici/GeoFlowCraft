const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    url: process.env.GEOSERVER_URL || 'http://localhost:8080/geoserver',
    auth: {
        username: process.env.GEOSERVER_USERNAME || 'admin',
        password: process.env.GEOSERVER_PASSWORD || 'admin'
    }
};