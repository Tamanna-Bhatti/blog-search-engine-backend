const express = require('express');
const router = express.Router();
const { searchContent } = require('../services/database');
const { ValidationError } = require('../utils/errorHandler');

/**
 * Search endpoint
 * GET /search?q=query&limit=10
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      throw new ValidationError('Search query is required');
    }

    const results = await searchContent(q, parseInt(limit));
    
    res.json({
      success: true,
      query: q,
      count: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
