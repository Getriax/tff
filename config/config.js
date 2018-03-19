const path = require('path');

const config = {
    port: 3000,
    databaseUrl: 'mongodb://admin:root@ds255958.mlab.com:55958/tff',
    databaseLocal: 'mongodb://localhost/tff',
    tokenPass: 'glory123',
    imagePath: path.resolve('./uploads/user'),
    imageLimit: 1024 * 1024 // in bytes
};

module.exports = config;