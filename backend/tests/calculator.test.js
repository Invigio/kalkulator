const Calculator = require('../src/calculator');

describe('Calculator Unit Tests', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Addition', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(5, 3)).toBe(8);
    });

    test('should add negative numbers', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
    });

    test('should add positive and negative', () => {
      expect(calculator.add(10, -3)).toBe(7);
    });
  });

  describe('Subtraction', () => {
    test('should subtract two numbers', () => {
      expect(calculator.subtract(10, 3)).toBe(7);
    });

    test('should handle negative results', () => {
      expect(calculator.subtract(3, 10)).toBe(-7);
    });
  });

  describe('Multiplication', () => {
    test('should multiply two numbers', () => {
      expect(calculator.multiply(5, 3)).toBe(15);
    });

    test('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(calculator.multiply(-5, -3)).toBe(15);
    });
  });

  describe('Division', () => {
    test('should divide two numbers', () => {
      expect(calculator.divide(15, 3)).toBe(5);
    });

    test('should throw error on division by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
    });

    test('should handle decimal results', () => {
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333, 2);
    });
  });

  describe('Power', () => {
    test('should calculate power', () => {
      expect(calculator.power(2, 3)).toBe(8);
    });

    test('should handle power of zero', () => {
      expect(calculator.power(5, 0)).toBe(1);
    });

    test('should handle negative exponent', () => {
      expect(calculator.power(2, -2)).toBeCloseTo(0.25);
    });
  });

  describe('Square Root', () => {
    test('should calculate square root', () => {
      expect(calculator.sqrt(9)).toBe(3);
    });

    test('should handle square root of zero', () => {
      expect(calculator.sqrt(0)).toBe(0);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.sqrt(-9)).toThrow('Cannot calculate square root of negative number');
    });
  });

  describe('Validation', () => {
    test('should throw error for non-number input', () => {
      expect(() => calculator.add('5', 3)).toThrow('Invalid number');
    });

    test('should throw error for NaN', () => {
      expect(() => calculator.add(NaN, 3)).toThrow('Invalid number');
    });
  });

  describe('History', () => {
    test('should store calculation in history', () => {
      calculator.add(5, 3);
      const history = calculator.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].operation).toBe('add');
      expect(history[0].result).toBe(8);
    });

    test('should store multiple calculations', () => {
      calculator.add(5, 3);
      calculator.multiply(2, 4);
      calculator.subtract(10, 3);
      expect(calculator.getHistory()).toHaveLength(3);
    });

    test('should clear history', () => {
      calculator.add(5, 3);
      calculator.clearHistory();
      expect(calculator.getHistory()).toHaveLength(0);
    });

    test('should include timestamp in history', () => {
      calculator.add(5, 3);
      const history = calculator.getHistory();
      expect(history[0].timestamp).toBeDefined();
      expect(new Date(history[0].timestamp)).toBeInstanceOf(Date);
    });
  });
});
