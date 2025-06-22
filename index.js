const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');

const { initializeDatabase, db } = require('./services/database');
const searchRoutes = require('./routes/searchRoutes');
const crawlRoutes = require('./routes/crawlRoutes');
const classifyRoutes = require('./routes/classifyRoutes');
const { errorHandler } = require('./utils/errorHandler');
const config = require('./config/config');
const crawler = require('./services/crawler');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// Ensure data directory exists
const dataDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database and seed URLs
initializeDatabase()
  .then(() => {
    const seedFilePath = path.join(__dirname, 'data', 'seed-urls.json');
    if (fs.existsSync(seedFilePath)) {
      const urls = JSON.parse(fs.readFileSync(seedFilePath, 'utf-8')).urls;

      db.get('SELECT COUNT(*) AS count FROM urls', (err, row) => {
        if (err) {
          console.error('Error checking seed:', err.message);
        } else if (row.count === 0) {
          const stmt = db.prepare('INSERT OR IGNORE INTO urls (url) VALUES (?)');
          urls.forEach(url => stmt.run(url));
          stmt.finalize(() => console.log(`Seeded ${urls.length} URLs.`));
        } else {
          console.log('URLs already seeded.');
        }
      });
    } else {
      console.warn(`Seed file not found at ${seedFilePath}`);
    }
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

// Routes
app.use('/search', searchRoutes);
app.use('/crawl', crawlRoutes);
app.use('/classify-url', classifyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: require('./package.json').version
  });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
async function gracefulShutdown() {
  console.log('Received shutdown signal');

  try {
    await new Promise((resolve, reject) => {
      db.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Database connections closed');

    await crawler.close();
    console.log('Crawler browser closed');

    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// === Export for Vercel ===
module.exports = app;
module.exports.handler = serverless(app);

// === Run locally ===
if (!process.env.VERCEL) {
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}
