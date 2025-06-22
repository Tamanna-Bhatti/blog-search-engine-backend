const express = require('express');
const router = express.Router();
const { crawlUrl } = require('../services/crawler');
const { insertUrl, updateUrlMetadata } = require('../services/database');
const { ValidationError } = require('../utils/errorHandler');

/**
 * Crawl endpoint
 * POST /crawl
 * Body: { url: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new ValidationError('URL is required');
    }

    // Insert URL first to get the ID
    const urlId = await insertUrl(url);

    // Crawl the URL
    const crawlResult = await crawlUrl(url);

    if (!crawlResult.success) {
      throw new Error(`Failed to crawl URL: ${crawlResult.error}`);
    }

    // Update URL metadata with crawl results
    await updateUrlMetadata(urlId, {
      title: crawlResult.title,
      description: crawlResult.description,
      last_crawled: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'URL crawled successfully',
      data: {
        urlId,
        ...crawlResult
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
