const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    url: process.env.GEOSERVER_URL || 'http://localhost:8080/geoserver',
    auth: {
        username: process.env.GEOSERVER_USERNAME || 'admin',
        password: process.env.GEOSERVER_PASSWORD || 'admin'
    },
    ssh: {
        host: process.env.GEOSERVER_VM_SSH_HOST,
        username: process.env.GEOSERVER_VM_SSH_USERNAME,
        password: process.env.GEOSERVER_VM_SSH_PASSWORD
    }
};