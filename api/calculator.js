/**
 * Calculator Logic (shared utility)
 */

class Calculator {
  constructor() {
    this.history = [];
  }

  validateNumbers(...numbers) {
    for (const num of numbers) {
      if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
        throw new Error('Nieprawidłowa liczba');
      }
    }
  }

  add(a, b) {
    this.validateNumbers(a, b);
    const result = a + b;
    this.addToHistory('add', [a, b], result);
    return result;
  }

  subtract(a, b) {
    this.validateNumbers(a, b);
    const result = a - b;
    this.addToHistory('subtract', [a, b], result);
    return result;
  }

  multiply(a, b) {
    this.validateNumbers(a, b);
    const result = a * b;
    this.addToHistory('multiply', [a, b], result);
    return result;
  }

  divide(a, b) {
    this.validateNumbers(a, b);
    if (b === 0) {
      throw new Error('Dzielenie przez zero');
    }
    const result = a / b;
    this.addToHistory('divide', [a, b], result);
    return result;
  }

  power(a, b) {
    this.validateNumbers(a, b);
    const result = Math.pow(a, b);
    this.addToHistory('power', [a, b], result);
    return result;
  }

  sqrt(a) {
    this.validateNumbers(a);
    if (a < 0) {
      throw new Error('Nie można obliczyć pierwiastka z liczby ujemnej');
    }
    const result = Math.sqrt(a);
    this.addToHistory('sqrt', [a], result);
    return result;
  }

  addToHistory(operation, operands, result) {
    this.history.push({
      operation,
      a: operands[0],
      b: operands[1] !== undefined ? operands[1] : null,
      result,
      timestamp: new Date().toISOString()
    });
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

// Global calculator instance for stateful history
const calculator = new Calculator();

module.exports = calculator;
