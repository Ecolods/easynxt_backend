require('dotenv').config();

console.log('DEBUG - .env values:');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
        connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
        requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT) || 30000
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};