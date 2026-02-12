/**
 * Frontend Unit Tests
 */

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Setup DOM
document.body.innerHTML = `
  <input id="display" value="0">
  <div id="expression"></div>
  <div id="history-list"></div>
  <div id="api-indicator" class="indicator"></div>
  <span id="api-status-text"></span>
  <button id="theme-toggle"></button>
  <button id="clear-history"></button>
`;

// Import after DOM setup
const CalculatorApp = require('../src/script.js');

describe('Frontend Unit Tests', () => {
  let app;

  beforeEach(() => {
    // Reset mocks
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // Reset DOM
    document.getElementById('display').value = '0';
    document.getElementById('expression').textContent = '';

    // Create app instance
    app = new CalculatorApp();
  });

  describe('Initialization', () => {
    test('should initialize with default values', () => {
      expect(app.currentValue).toBe('0');
      expect(app.previousValue).toBeNull();
      expect(app.operation).toBeNull();
      expect(app.shouldResetDisplay).toBe(false);
    });

    test('should have API URL configured', () => {
      expect(app.apiUrl).toBeDefined();
    });
  });

  describe('Number Input', () => {
    test('should handle single digit input', () => {
      app.handleNumber('5');
      expect(app.currentValue).toBe('5');
    });

    test('should handle multiple digits', () => {
      app.handleNumber('1');
      app.handleNumber('2');
      app.handleNumber('3');
      expect(app.currentValue).toBe('123');
    });

    test('should handle decimal point', () => {
      app.handleNumber('5');
      app.handleNumber('.');
      app.handleNumber('5');
      expect(app.currentValue).toBe('5.5');
    });

    test('should not allow multiple decimal points', () => {
      app.handleNumber('5');
      app.handleNumber('.');
      app.handleNumber('5');
      app.handleNumber('.');
      expect(app.currentValue).toBe('5.5');
    });

    test('should reset display after operation', () => {
      app.currentValue = '123';
      app.shouldResetDisplay = true;
      app.handleNumber('5');
      expect(app.currentValue).toBe('5');
    });
  });

  describe('Display Management', () => {
    test('should update display', () => {
      app.currentValue = '42';
      app.updateDisplay();
      expect(document.getElementById('display').value).toBe('42');
    });

    test('should update expression', () => {
      app.previousValue = 10;
      app.operation = 'add';
      app.updateExpression();
      expect(document.getElementById('expression').textContent).toBe('10 +');
    });

    test('should clear expression when no operation', () => {
      app.previousValue = null;
      app.operation = null;
      app.updateExpression();
      expect(document.getElementById('expression').textContent).toBe('');
    });
  });

  describe('Clear and Delete', () => {
    test('should clear all values', () => {
      app.currentValue = '123';
      app.previousValue = 456;
      app.operation = 'add';
      app.clear();

      expect(app.currentValue).toBe('0');
      expect(app.previousValue).toBeNull();
      expect(app.operation).toBeNull();
    });

    test('should delete last character', () => {
      app.currentValue = '123';
      app.delete();
      expect(app.currentValue).toBe('12');
    });

    test('should set to 0 when deleting last digit', () => {
      app.currentValue = '5';
      app.delete();
      expect(app.currentValue).toBe('0');
    });
  });

  describe('API Communication', () => {
    test('should call API for calculation', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 8, operation: 'add', a: 5, b: 3 })
      });

      const result = await app.calculate('add', 5, 3);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/calculate'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'add', a: 5, b: 3 })
        })
      );
      expect(result).toBe(8);
      expect(app.currentValue).toBe('8');
    });

    test('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Division by zero' })
      });

      await expect(app.calculate('divide', 10, 0)).rejects.toThrow('Division by zero');
    });

    test('should check API health', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'OK' })
      });

      await app.checkApiHealth();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/health'));
    });
  });

  describe('Theme Management', () => {
    test('should toggle theme', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      app.toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should save theme to localStorage', () => {
      app.toggleTheme();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('calculator-theme', expect.any(String));
    });

    test('should load theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      app.loadTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('History Management', () => {
    test('should load history from API', async () => {
      const mockHistory = [
        { operation: 'add', a: 5, b: 3, result: 8, timestamp: '2024-01-01' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory
      });

      await app.loadHistory();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/history'));
    });

    test('should display history items', () => {
      const history = [
        { operation: 'add', a: 5, b: 3, result: 8 },
        { operation: 'multiply', a: 2, b: 4, result: 8 }
      ];

      app.displayHistory(history);

      const historyList = document.getElementById('history-list');
      expect(historyList.children.length).toBe(2);
    });

    test('should display empty message when no history', () => {
      app.displayHistory([]);

      const historyList = document.getElementById('history-list');
      expect(historyList.innerHTML).toContain('Brak historii');
    });

    test('should clear history via API', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'History cleared' })
      });

      await app.clearHistory();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/history'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('Error Handling', () => {
    test('should show error and reset', (done) => {
      app.showError('Test error');
      expect(app.currentValue).toBe('Error');

      setTimeout(() => {
        expect(app.currentValue).toBe('0');
        done();
      }, 2100);
    });
  });

  describe('API Status Indicator', () => {
    test('should set online status', () => {
      app.setApiStatus(true);
      expect(document.getElementById('api-indicator').className).toContain('online');
      expect(document.getElementById('api-status-text').textContent).toContain('Połączono');
    });

    test('should set offline status', () => {
      app.setApiStatus(false);
      expect(document.getElementById('api-indicator').className).toContain('offline');
      expect(document.getElementById('api-status-text').textContent).toContain('Brak połączenia');
    });
  });
});
