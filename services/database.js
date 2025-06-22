const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config/config');
const { NotFoundError } = require('../utils/errorHandler');

let db;

/**
 * Initialize the SQLite database
 * Creates tables if they don't exist
 */
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Ensure the data directory exists
    const dataDir = path.dirname(config.DB_PATH);
    require('fs').mkdirSync(dataDir, { recursive: true });

    // Create database connection
    db = new sqlite3.Database(config.DB_PATH, (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');

      // Create tables
      db.serialize(() => {
        // URLs table
        db.run(`CREATE TABLE IF NOT EXISTS urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT UNIQUE NOT NULL,
          title TEXT,
          description TEXT,
          last_crawled DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Content table for search
        db.run(`CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url_id INTEGER,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (url_id) REFERENCES urls(id)
        )`);

        // Classifications table
        db.run(`CREATE TABLE IF NOT EXISTS classifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url_id INTEGER,
          category TEXT,
          confidence REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (url_id) REFERENCES urls(id)
        )`);

        resolve();
      });
    });
  });
};

/**
 * Get a URL by its ID
 */
const getUrlById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM urls WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      if (!row) reject(new NotFoundError('URL not found'));
      resolve(row);
    });
  });
};

/**
 * Insert a new URL
 */
const insertUrl = (url, title = null, description = null) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT OR IGNORE INTO urls (url, title, description) VALUES (?, ?, ?)');
    stmt.run([url, title, description], function(err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  });
};

/**
 * Update URL metadata
 */
const updateUrlMetadata = (id, { title, description, last_crawled }) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      UPDATE urls 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          last_crawled = COALESCE(?, last_crawled)
      WHERE id = ?
    `);
    stmt.run([title, description, last_crawled, id], function(err) {
      if (err) reject(err);
      resolve(this.changes);
    });
  });
};

/**
 * Search URLs and content
 */
const searchContent = (query, limit = 10) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT DISTINCT u.*, c.content
      FROM urls u
      LEFT JOIN content c ON u.id = c.url_id
      WHERE u.title LIKE ? 
         OR u.description LIKE ?
         OR c.content LIKE ?
      LIMIT ?
    `;
    const searchPattern = `%${query}%`;
    db.all(sql, [searchPattern, searchPattern, searchPattern, limit], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

// Export the database connection and functions
module.exports = {
  db,
  initializeDatabase,
  getUrlById,
  insertUrl,
  updateUrlMetadata,
  searchContent
};
