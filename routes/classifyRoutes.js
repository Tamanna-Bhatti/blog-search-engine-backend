const express = require('express');
const router = express.Router();
const { getUrlById } = require('../services/database');
const { ValidationError } = require('../utils/errorHandler');

/**
 * URL Classification endpoint
 * POST /classify-url
 * Body: { url: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new ValidationError('URL is required');
    }

    // Simple classification logic (can be enhanced with ML/AI in the future)
    const classification = {
      category: detectCategory(url),
      confidence: 0.85
    };

    res.json({
      success: true,
      url,
      classification
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Simple URL category detection based on keywords
 * This is a basic implementation that can be replaced with more sophisticated ML/AI
 */
function detectCategory(url) {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('blog') || urlLower.includes('article')) {
    return 'blog';
  } else if (urlLower.includes('docs') || urlLower.includes('documentation')) {
    return 'documentation';
  } else if (urlLower.includes('tutorial') || urlLower.includes('guide')) {
    return 'tutorial';
  } else if (urlLower.includes('github') || urlLower.includes('gitlab')) {
    return 'repository';
  } else {
    return 'other';
  }
}

module.exports = router;
