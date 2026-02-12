// Kalkulator Zaawansowany z Historią i Motywem
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.history = this.loadHistory();
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Nie można dzielić przez zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Dodaj do historii
        const operationSymbol = this.getOperationSymbol(this.operation);
        this.addToHistory(`${prev} ${operationSymbol} ${current} = ${computation}`);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operation] || operation;
    }

    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    sqrt() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        if (current < 0) {
            alert('Nie można obliczyć pierwiastka z liczby ujemnej!');
            return;
        }
        const result = Math.sqrt(current);
        this.addToHistory(`√${current} = ${result}`);
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
    }

    power() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        const result = current * current;
        this.addToHistory(`${current}² = ${result}`);
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.textContent =
                `${this.previousOperand} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    addToHistory(calculation) {
        const historyItem = {
            calculation: calculation,
            timestamp: new Date().toLocaleString('pl-PL')
        };
        this.history.unshift(historyItem);
        if (this.history.length > 20) {
            this.history.pop();
        }
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContent = document.getElementById('historyContent');
        if (this.history.length === 0) {
            historyContent.innerHTML = '<p class="empty-history">Brak historii obliczeń</p>';
        } else {
            historyContent.innerHTML = this.history.map(item =>
                `<div class="history-item">
                    <div style="font-weight: 600; margin-bottom: 5px;">${item.calculation}</div>
                    <div style="font-size: 12px; opacity: 0.6;">${item.timestamp}</div>
                </div>`
            ).join('');
        }
    }
}

// Inicjalizacja - Kalkulator Główny
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Obsługa przycisków numerycznych
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
        animateButton(button);
    });
});

// Obsługa operatorów
document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
        animateButton(button);
    });
});

// Obsługa akcji
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        switch(action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                break;
            case 'decimal':
                calculator.appendNumber('.');
                break;
            case 'percent':
                calculator.percent();
                break;
            case 'sqrt':
                calculator.sqrt();
                break;
            case 'power':
                calculator.power();
                break;
            case 'history':
                toggleHistory();
                break;
        }
        calculator.updateDisplay();
        animateButton(button);
    });
});

// Funkcja animacji przycisku
function animateButton(button) {
    button.classList.add('btn-press');
    setTimeout(() => button.classList.remove('btn-press'), 200);
}

// Obsługa klawiatury
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        calculator.delete();
        calculator.updateDisplay();
    }
});

// Przełącznik motywu
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Załaduj zapisany motyw
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.querySelector('.icon').textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    themeToggle.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Panel historii
const historyPanel = document.getElementById('historyPanel');
const closeHistory = document.getElementById('closeHistory');
const clearHistory = document.getElementById('clearHistory');

function toggleHistory() {
    historyPanel.classList.toggle('active');
    calculator.updateHistoryDisplay();
}

closeHistory.addEventListener('click', () => {
    historyPanel.classList.remove('active');
});

clearHistory.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą historię?')) {
        calculator.clearHistory();
    }
});

// Kliknięcie na element historii
document.getElementById('historyContent').addEventListener('click', (e) => {
    const historyItem = e.target.closest('.history-item');
    if (historyItem) {
        const calculation = historyItem.querySelector('div').textContent;
        const result = calculation.split('=')[1].trim();
        calculator.currentOperand = result;
        calculator.updateDisplay();
        historyPanel.classList.remove('active');
    }
});

// Inicjalizacja wyświetlacza
calculator.updateDisplay();
