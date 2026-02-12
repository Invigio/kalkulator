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
    const { operation, operands } = req.body;

    if (!operation || !operands || !Array.isArray(operands)) {
      context.res.status = 400;
      context.res.body = { error: 'Nieprawidłowe dane wejściowe' };
      return;
    }

    let result;

    switch (operation) {
      case 'add':
        if (operands.length !== 2) {
          throw new Error('Operacja dodawania wymaga 2 argumentów');
        }
        result = calculator.add(operands[0], operands[1]);
        break;

      case 'subtract':
        if (operands.length !== 2) {
          throw new Error('Operacja odejmowania wymaga 2 argumentów');
        }
        result = calculator.subtract(operands[0], operands[1]);
        break;

      case 'multiply':
        if (operands.length !== 2) {
          throw new Error('Operacja mnożenia wymaga 2 argumentów');
        }
        result = calculator.multiply(operands[0], operands[1]);
        break;

      case 'divide':
        if (operands.length !== 2) {
          throw new Error('Operacja dzielenia wymaga 2 argumentów');
        }
        result = calculator.divide(operands[0], operands[1]);
        break;

      case 'power':
        if (operands.length !== 2) {
          throw new Error('Operacja potęgowania wymaga 2 argumentów');
        }
        result = calculator.power(operands[0], operands[1]);
        break;

      case 'sqrt':
        if (operands.length !== 1) {
          throw new Error('Operacja pierwiastka wymaga 1 argumentu');
        }
        result = calculator.sqrt(operands[0]);
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
