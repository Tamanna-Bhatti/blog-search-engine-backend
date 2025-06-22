
Built by https://www.blackbox.ai

---

# Blog Search Engine Backend

A search engine for tech blogs built with Node.js and Express. This project includes features for URL crawling, classification, and searching across a variety of tech blogs.

## Project Overview

This backend service serves as the foundation for a blog search engine, equipped with various capabilities such as URL crawling, classification, and search functionalities. It utilizes Express for routing, SQLite for database management, and Puppeteer for web crawling.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blog-search-engine-backend.git
   cd blog-search-engine-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   You may need to set up a `.env` file or configure your environment variables according to your setup, specifically for the `DB_PATH`.

## Usage

To start the server in development mode, use:
```bash
npm run dev
```

To run the server in production mode, use:
```bash
npm start
```

### Available Endpoints

- **GET /health**: Provides health status of the service.
- **POST /search**: Searches for blogs based on input queries.
- **POST /crawl**: Initiates crawling action for URLs.
- **POST /classify-url**: Classifies a specific URL.

## Features

- **CORS**: Cross-origin resource sharing is enabled for your frontend integration.
- **URL Seeding**: Automatically seeds the database with initial URLs from a JSON file.
- **Database Management**: Uses SQLite3 for local data storage.
- **Rate Limiting**: Protects against abuse by limiting the number of requests per IP address.
- **Health Check**: Built-in endpoint to verify if the service is running properly.

## Dependencies

The project uses the following dependencies, as per the `package.json`:

- `compression`: "^1.8.0" - Middleware for compression.
- `cors`: "^2.8.5" - Middleware for handling CORS.
- `express`: "^4.18.2" - Fast, unopinionated, minimalist web framework for Node.js.
- `express-rate-limit`: "^7.5.0" - Basic rate limiting middleware for Express.
- `morgan`: "^1.10.0" - HTTP request logger middleware.
- `puppeteer`: "^22.0.0" - Headless browser for web scraping.
- `sqlite3`: "^5.1.7" - SQLite3 client for Node.js.
- `serverless-http`: "^3.1.0" - Serve your Express app in a serverless environment.
- `helmet`: "^7.0.0" - Helps secure Express apps by setting various HTTP headers.

### Development Dependencies
- `nodemon`: "^3.0.3" - Utility that monitors for changes in files and automatically restarts the server.

## Project Structure

```
blog-search-engine-backend/
│
├── config/                  # Configuration files
│   ├── config.js           # Environment-specific configurations
│   └── production.js       # Production configurations
│
├── data/                   # Directory to store database and other data
│   └── seed-urls.json      # JSON file to seed initial URLs
│
├── routes/                 # Route definitions
│   ├── crawlRoutes.js      # Crawling-related routes
│   ├── classifyRoutes.js    # Classification-related routes
│   └── searchRoutes.js     # Searching-related routes
│
├── services/               # Contains service logic
│   ├── crawler.js          # Logic for crawling URLs
│   └── database.js         # Database initialization and interaction
│
├── utils/                  # Utility functions
│   ├── errorHandler.js      # Error handling logic
│   └── otherUtils.js       # Other utility functions
│
├── index.js                # Main entry point of the application
├── package.json            # NPM dependencies and scripts
└── vercel.json             # Configuration for deployment to Vercel
```

## License

MIT License. See [LICENSE](LICENSE) for more details.

---

For more information or to contribute, feel free to reach out through our GitHub repository.