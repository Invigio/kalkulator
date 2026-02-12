/**
 * Calculator Frontend - REST API Client
 */

class CalculatorApp {
  constructor() {
    this.apiUrl = window.API_URL || '';
    this.display = document.getElementById('display');
    this.expression = document.getElementById('expression');
    this.historyList = document.getElementById('history-list');
    this.apiIndicator = document.getElementById('api-indicator');
    this.apiStatusText = document.getElementById('api-status-text');

    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;

    this.init();
  }

  /**
   * Inicjalizacja
   */
  init() {
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.loadTheme();
    this.checkApiHealth();
    this.loadHistory();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', () => this.handleNumber(button.dataset.number));
    });

    // Operator buttons
    document.querySelectorAll('[data-operation]').forEach(button => {
      button.addEventListener('click', () => this.handleOperation(button.dataset.operation));
    });

    // Action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', () => this.handleAction(button.dataset.action));
    });

    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Clear history
    document.getElementById('clear-history')?.addEventListener('click', () => this.clearHistory());
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        this.handleNumber(e.key);
      } else if (e.key === '+') {
        this.handleOperation('add');
      } else if (e.key === '-') {
        this.handleOperation('subtract');
      } else if (e.key === '*') {
        this.handleOperation('multiply');
      } else if (e.key === '/') {
        e.preventDefault();
        this.handleOperation('divide');
      } else if (e.key === 'Enter' || e.key === '=') {
        this.handleAction('equals');
      } else if (e.key === 'Escape' || e.key === 'c') {
        this.handleAction('clear');
      } else if (e.key === 'Backspace') {
        this.handleAction('delete');
      }
    });
  }

  /**
   * Handle number input
   */
  handleNumber(num) {
    if (this.shouldResetDisplay) {
      this.currentValue = num === '.' ? '0.' : num;
      this.shouldResetDisplay = false;
    } else {
      if (num === '.' && this.currentValue.includes('.')) return;
      this.currentValue = this.currentValue === '0' && num !== '.' ? num : this.currentValue + num;
    }
    this.updateDisplay();
  }

  /**
   * Handle operation
   */
  async handleOperation(op) {
    const current = parseFloat(this.currentValue);

    if (op === 'sqrt') {
      await this.calculate('sqrt', current, null);
      return;
    }

    if (this.previousValue !== null && this.operation && !this.shouldResetDisplay) {
      await this.calculate(this.operation, this.previousValue, current);
    }

    this.previousValue = parseFloat(this.currentValue);
    this.operation = op;
    this.shouldResetDisplay = true;
    this.updateExpression();
  }

  /**
   * Handle actions
   */
  async handleAction(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'delete':
        this.delete();
        break;
      case 'equals':
        if (this.operation && this.previousValue !== null) {
          const current = parseFloat(this.currentValue);
          await this.calculate(this.operation, this.previousValue, current);
          this.operation = null;
          this.previousValue = null;
        }
        break;
    }
  }

  /**
   * Calculate using API
   */
  async calculate(operation, a, b) {
    try {
      const response = await fetch(`${this.apiUrl}/api/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, a, b })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Błąd obliczeń');
      }

      const data = await response.json();
      this.currentValue = data.result.toString();
      this.updateDisplay();
      this.shouldResetDisplay = true;

      // Refresh history
      await this.loadHistory();

      return data.result;
    } catch (error) {
      this.showError(error.message);
      throw error;
    }
  }

  /**
   * Clear display
   */
  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.updateDisplay();
    this.updateExpression();
  }

  /**
   * Delete last character
   */
  delete() {
    if (this.shouldResetDisplay) return;
    this.currentValue = this.currentValue.length > 1
      ? this.currentValue.slice(0, -1)
      : '0';
    this.updateDisplay();
  }

  /**
   * Update display
   */
  updateDisplay() {
    this.display.value = this.currentValue;
  }

  /**
   * Update expression
   */
  updateExpression() {
    if (this.previousValue !== null && this.operation) {
      const symbols = {
        add: '+',
        subtract: '−',
        multiply: '×',
        divide: '÷',
        power: '^'
      };
      this.expression.textContent = `${this.previousValue} ${symbols[this.operation] || this.operation}`;
    } else {
      this.expression.textContent = '';
    }
  }

  /**
   * Load history from API
   */
  async loadHistory() {
    try {
      const response = await fetch(`${this.apiUrl}/api/history`);
      const history = await response.json();
      this.displayHistory(history);
    } catch (error) {
      console.error('Błąd ładowania historii:', error);
    }
  }

  /**
   * Display history
   */
  displayHistory(history) {
    if (!this.historyList) return;

    if (history.length === 0) {
      this.historyList.innerHTML = '<p class="empty">Brak historii</p>';
      return;
    }

    const symbols = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷',
      power: '^',
      sqrt: '√'
    };

    this.historyList.innerHTML = history.reverse().map(item => {
      const op = symbols[item.operation] || item.operation;
      const expr = item.b !== null
        ? `${item.a} ${op} ${item.b}`
        : `${op}${item.a}`;
      return `<div class="history-item">${expr} = ${item.result}</div>`;
    }).join('');
  }

  /**
   * Clear history
   */
  async clearHistory() {
    try {
      await fetch(`${this.apiUrl}/api/history`, { method: 'DELETE' });
      await this.loadHistory();
    } catch (error) {
      this.showError('Błąd czyszczenia historii');
    }
  }

  /**
   * Check API health
   */
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/api/health`);
      if (response.ok) {
        this.setApiStatus(true);
      } else {
        this.setApiStatus(false);
      }
    } catch (error) {
      this.setApiStatus(false);
    }
  }

  /**
   * Set API status indicator
   */
  setApiStatus(isOnline) {
    if (isOnline) {
      this.apiIndicator.className = 'indicator online';
      this.apiStatusText.textContent = 'Połączono z API';
    } else {
      this.apiIndicator.className = 'indicator offline';
      this.apiStatusText.textContent = 'Brak połączenia z API';
    }
  }

  /**
   * Show error
   */
  showError(message) {
    this.currentValue = 'Error';
    this.updateDisplay();
    console.error(message);
    setTimeout(() => {
      this.clear();
    }, 2000);
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('calculator-theme', newTheme);

    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  /**
   * Load theme from localStorage
   */
  loadTheme() {
    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  }
}

// Initialize app when DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.calculatorApp = new CalculatorApp();
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalculatorApp;
}
