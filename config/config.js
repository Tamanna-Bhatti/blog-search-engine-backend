const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_PATH: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'database.sqlite'),
  // Add any other configuration settings
  NODE_ENV: process.env.NODE_ENV || 'development',
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
