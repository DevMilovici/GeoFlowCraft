const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    host: process.env.POSTGRES_HOST || '10.13.0.91',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DATABASE || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres'
};