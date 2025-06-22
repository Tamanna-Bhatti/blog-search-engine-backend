// Force production settings
process.env.NODE_ENV = 'production';

const app = require('../index');

// If running outside of Vercel serverless context
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});
