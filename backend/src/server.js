const express = require('express');
const cors = require('cors');
const Calculator = require('./calculator');

const app = express();
const PORT = process.env.PORT || 3000;
const calculator = new Calculator();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// POST /api/calculate - Wykonanie obliczeń
app.post('/api/calculate', (req, res) => {
  try {
    const { operation, a, b } = req.body;

    if (!operation) {
      return res.status(400).json({ error: 'Operation is required' });
    }

    let result;

    switch (operation) {
      case 'add':
        result = calculator.add(a, b);
        break;
      case 'subtract':
        result = calculator.subtract(a, b);
        break;
      case 'multiply':
        result = calculator.multiply(a, b);
        break;
      case 'divide':
        result = calculator.divide(a, b);
        break;
      case 'power':
        result = calculator.power(a, b);
        break;
      case 'sqrt':
        result = calculator.sqrt(a);
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    res.json({ result, operation, a, b });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/history - Pobranie historii
app.get('/api/history', (req, res) => {
  res.json(calculator.getHistory());
});

// DELETE /api/history - Czyszczenie historii
app.delete('/api/history', (req, res) => {
  calculator.clearHistory();
  res.json({ message: 'History cleared' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (only if not in test mode)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Calculator API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
