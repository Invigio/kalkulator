const calculator = require('../calculator');

module.exports = async function (context, req) {
  context.log('History function triggered');

  // CORS headers
  context.res = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  };

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    return;
  }

  try {
    if (req.method === 'GET') {
      const history = calculator.getHistory();
      context.res.status = 200;
      context.res.body = history;
    } else if (req.method === 'DELETE') {
      calculator.clearHistory();
      context.res.status = 200;
      context.res.body = { message: 'Historia wyczyszczona' };
    }
  } catch (error) {
    context.log.error('History error:', error);
    context.res.status = 500;
    context.res.body = { error: error.message };
  }
};
