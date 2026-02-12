const calculator = require('../calculator');

module.exports = async function (context, req) {
  context.log('Calculate function triggered');

  // CORS headers
  context.res = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  };

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    return;
  }

  try {
    const { operation, operands, a, b } = req.body || {};
    const inputOperands = Array.isArray(operands) ? operands : null;
    const legacyOperands = typeof a === 'number' && (typeof b === 'number' || b === null || typeof b === 'undefined')
      ? [a, b].filter(value => typeof value === 'number')
      : null;
    const resolvedOperands = inputOperands || legacyOperands;

    if (!operation || !resolvedOperands || !Array.isArray(resolvedOperands)) {
      context.res.status = 400;
      context.res.body = { error: 'Nieprawidłowe dane wejściowe' };
      return;
    }

    let result;

    switch (operation) {
      case 'add':
        if (resolvedOperands.length !== 2) {
          throw new Error('Operacja dodawania wymaga 2 argumentów');
        }
        result = calculator.add(resolvedOperands[0], resolvedOperands[1]);
        break;

      case 'subtract':
        if (resolvedOperands.length !== 2) {
          throw new Error('Operacja odejmowania wymaga 2 argumentów');
        }
        result = calculator.subtract(resolvedOperands[0], resolvedOperands[1]);
        break;

      case 'multiply':
        if (resolvedOperands.length !== 2) {
          throw new Error('Operacja mnożenia wymaga 2 argumentów');
        }
        result = calculator.multiply(resolvedOperands[0], resolvedOperands[1]);
        break;

      case 'divide':
        if (resolvedOperands.length !== 2) {
          throw new Error('Operacja dzielenia wymaga 2 argumentów');
        }
        result = calculator.divide(resolvedOperands[0], resolvedOperands[1]);
        break;

      case 'power':
        if (resolvedOperands.length !== 2) {
          throw new Error('Operacja potęgowania wymaga 2 argumentów');
        }
        result = calculator.power(resolvedOperands[0], resolvedOperands[1]);
        break;

      case 'sqrt':
        if (resolvedOperands.length !== 1) {
          throw new Error('Operacja pierwiastka wymaga 1 argumentu');
        }
        result = calculator.sqrt(resolvedOperands[0]);
        break;

      default:
        context.res.status = 400;
        context.res.body = { error: 'Nieznana operacja' };
        return;
    }

    context.res.status = 200;
    context.res.body = { result };

  } catch (error) {
    context.log.error('Calculate error:', error);
    context.res.status = 400;
    context.res.body = { error: error.message };
  }
};
