const puppeteer = require('puppeteer');
const { ValidationError } = require('../utils/errorHandler');

let browser;

/**
 * Initialize the browser instance
 */
const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
  }
  return browser;
};

/**
 * Crawl a URL and extract content
 */
const crawlUrl = async (url) => {
  if (!url) {
    throw new ValidationError('URL is required');
  }

  try {
    const browser = await initBrowser();
    const page = await browser.newPage();

    // Set timeout for navigation
    await page.setDefaultNavigationTimeout(30000);

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract metadata and content
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        content: document.body.innerText
      };
    });

    await page.close();

    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Close the browser instance
 */
const close = async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
};

module.exports = {
  crawlUrl,
  close
};
