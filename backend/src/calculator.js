/**
 * Calculator - Logika obliczeń
 */

class Calculator {
  constructor() {
    this.history = [];
  }

  /**
   * Dodawanie
   */
  add(a, b) {
    this.validateNumbers(a, b);
    const result = a + b;
    this.addToHistory('add', a, b, result);
    return result;
  }

  /**
   * Odejmowanie
   */
  subtract(a, b) {
    this.validateNumbers(a, b);
    const result = a - b;
    this.addToHistory('subtract', a, b, result);
    return result;
  }

  /**
   * Mnożenie
   */
  multiply(a, b) {
    this.validateNumbers(a, b);
    const result = a * b;
    this.addToHistory('multiply', a, b, result);
    return result;
  }

  /**
   * Dzielenie
   */
  divide(a, b) {
    this.validateNumbers(a, b);
    if (b === 0) {
      throw new Error('Division by zero');
    }
    const result = a / b;
    this.addToHistory('divide', a, b, result);
    return result;
  }

  /**
   * Potęgowanie
   */
  power(a, b) {
    this.validateNumbers(a, b);
    const result = Math.pow(a, b);
    this.addToHistory('power', a, b, result);
    return result;
  }

  /**
   * Pierwiastek kwadratowy
   */
  sqrt(a) {
    this.validateNumbers(a);
    if (a < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    const result = Math.sqrt(a);
    this.addToHistory('sqrt', a, null, result);
    return result;
  }

  /**
   * Walidacja liczb
   */
  validateNumbers(...numbers) {
    for (const num of numbers) {
      if (typeof num !== 'number' || isNaN(num)) {
        throw new Error('Invalid number');
      }
    }
  }

  /**
   * Dodanie do historii
   */
  addToHistory(operation, a, b, result) {
    this.history.push({
      operation,
      a,
      b,
      result,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Pobranie historii
   */
  getHistory() {
    return this.history;
  }

  /**
   * Czyszczenie historii
   */
  clearHistory() {
    this.history = [];
  }
}

module.exports = Calculator;
