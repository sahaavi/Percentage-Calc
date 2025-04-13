// Add keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for all calculator sections
    const sections = document.querySelectorAll('.calculator-section');
    sections.forEach(section => {
        const inputs = section.querySelectorAll('input');
        const button = section.querySelector('button');
        
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    button.click();
                }
            });

            // Allow only numbers and specific keys
            input.addEventListener('keydown', (e) => {
                // Allow: backspace, delete, tab, escape, enter, decimal point
                if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.keyCode >= 35 && e.keyCode <= 39) || // Allow: home, end, left, right
                    (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+V
                    (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+C
                    (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+X
                    (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+A
                    // Allow: minus sign
                    e.keyCode === 189 || e.keyCode === 109) {
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
                    (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        });
    });
});

function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

function calculatePercentage() {
    const percent = parseFloat(document.getElementById('percent1').value);
    const value = parseFloat(document.getElementById('value1').value);
    const resultElement = document.getElementById('result1');

    if (isNaN(percent) || isNaN(value)) {
        resultElement.textContent = 'Please enter valid numbers';
        return;
    }

    const result = (percent / 100) * value;
    resultElement.textContent = `${formatNumber(result)}`;
}

function calculateWhatPercent() {
    const value1 = parseFloat(document.getElementById('value2').value);
    const value2 = parseFloat(document.getElementById('value3').value);
    const resultElement = document.getElementById('result2');

    if (isNaN(value1) || isNaN(value2)) {
        resultElement.textContent = 'Please enter valid numbers';
        return;
    }

    if (value2 === 0) {
        resultElement.textContent = 'Cannot calculate percentage when the second value is 0';
        return;
    }

    const result = (value1 / value2) * 100;
    resultElement.textContent = `${formatNumber(result)}%`;
}

function calculateIncreaseDecrease() {
    const oldValue = parseFloat(document.getElementById('oldValue').value);
    const newValue = parseFloat(document.getElementById('newValue').value);
    const resultElement = document.getElementById('result3');
    const differenceElement = document.getElementById('difference');

    if (isNaN(oldValue) || isNaN(newValue)) {
        resultElement.textContent = 'Please enter valid numbers';
        differenceElement.textContent = 'Please enter valid numbers';
        return;
    }

    if (oldValue === 0) {
        resultElement.textContent = 'Cannot calculate when initial value is 0';
        differenceElement.textContent = 'Cannot calculate when initial value is 0';
        return;
    }

    const change = ((newValue - oldValue) / oldValue) * 100;
    const difference = newValue - oldValue;
    const changeType = change >= 0 ? 'increase' : 'decrease';
    
    resultElement.textContent = `${formatNumber(Math.abs(change))}% ${changeType}`;
    differenceElement.textContent = formatNumber(difference);
}

function calculateFinalValue() {
    const baseValue = parseFloat(document.getElementById('baseValue').value);
    const changePercent = parseFloat(document.getElementById('changePercent').value);
    const finalValueElement = document.getElementById('finalValue');
    const differenceElement = document.getElementById('valueDifference');

    if (isNaN(baseValue) || isNaN(changePercent)) {
        finalValueElement.textContent = 'Please enter valid numbers';
        differenceElement.textContent = 'Please enter valid numbers';
        return;
    }

    const finalValue = baseValue * (1 + changePercent / 100);
    const difference = finalValue - baseValue;
    
    finalValueElement.textContent = formatNumber(finalValue);
    differenceElement.textContent = formatNumber(difference);
}

// Scientific Calculator
let previousOperand = '';
let currentOperand = '0';
let lastOperation = '';
let shouldResetScreen = false;
let isNewCalculation = true;

function updateDisplay() {
    document.querySelector('.previous-operand').textContent = previousOperand;
    // Format the current operand for display
    let displayNumber = currentOperand;
    if (displayNumber.length > 12) {
        // Convert to exponential notation if number is too long
        displayNumber = parseFloat(displayNumber).toExponential(6);
    }
    document.querySelector('.current-operand').textContent = displayNumber;
}

function clearCalc() {
    previousOperand = '';
    currentOperand = '0';
    lastOperation = '';
    shouldResetScreen = false;
    isNewCalculation = true;
    updateDisplay();
}

function deleteLast() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function addNumber(number) {
    if (shouldResetScreen || isNewCalculation) {
        currentOperand = '0';
        shouldResetScreen = false;
        isNewCalculation = false;
    }
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else if (number === '.' && !currentOperand.includes('.')) {
        currentOperand += number;
    } else if (number !== '.') {
        // Limit the length of the number to prevent overflow
        if (currentOperand.replace(/[.-]/g, '').length < 12) {
            currentOperand += number;
        }
    }
    updateDisplay();
}

function addOperator(operator) {
    if (operator === '-' && currentOperand === '0') {
        currentOperand = '-';
        updateDisplay();
        return;
    }

    if (currentOperand === '0' && previousOperand === '') return;

    if (previousOperand !== '' && !previousOperand.includes('=')) {
        calculate(true);
    }

    if (previousOperand.includes('=')) {
        previousOperand = '';
    }

    lastOperation = operator;
    previousOperand = `${currentOperand} ${operator}`;
    shouldResetScreen = true;
    isNewCalculation = false;
    updateDisplay();
}

function addFunction(func) {
    const prevValue = parseFloat(currentOperand);
    let result;

    switch(func) {
        case 'sin':
            result = Math.sin(prevValue * Math.PI / 180);
            previousOperand = `sin(${currentOperand})`;
            break;
        case 'cos':
            result = Math.cos(prevValue * Math.PI / 180);
            previousOperand = `cos(${currentOperand})`;
            break;
        case 'tan':
            result = Math.tan(prevValue * Math.PI / 180);
            previousOperand = `tan(${currentOperand})`;
            break;
        case 'sqrt':
            result = Math.sqrt(prevValue);
            previousOperand = `√(${currentOperand})`;
            break;
        case 'x²':
            result = prevValue ** 2;
            previousOperand = `(${currentOperand})²`;
            break;
        case 'log':
            result = Math.log10(prevValue);
            previousOperand = `log(${currentOperand})`;
            break;
        case 'π':
            result = Math.PI;
            previousOperand = 'π';
            break;
        case 'e':
            result = Math.E;
            previousOperand = 'e';
            break;
    }
    currentOperand = result.toString();
    shouldResetScreen = true;
    isNewCalculation = true;
    updateDisplay();
}

function calculate(keepResult = false) {
    if (!previousOperand || currentOperand === '0') return;

    const prev = parseFloat(previousOperand.split(' ')[0]);
    const current = parseFloat(currentOperand);
    let result;

    switch(lastOperation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
    }

    if (!keepResult) {
        previousOperand = `${previousOperand} ${currentOperand} =`;
        isNewCalculation = true;
    }
    currentOperand = result.toString();
    lastOperation = '';
    updateDisplay();
    if (!keepResult) {
        shouldResetScreen = true;
    }
}

// Add keyboard support for scientific calculator
document.addEventListener('keydown', function(e) {
    // Only handle calculator keys if focus is not in an input field
    if (document.activeElement.tagName !== 'INPUT') {
        // Prevent default behavior for calculator keys
        if (e.key.match(/[0-9]/) || e.key.match(/[\+\-\*\/\(\)\.]/) || 
            e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
        }

        // Numbers
        if (e.key.match(/[0-9]/)) {
            addNumber(e.key);
        }
        // Operators
        else if (e.key === '+') addOperator('+');
        else if (e.key === '-') addOperator('-');
        else if (e.key === '*') addOperator('*');
        else if (e.key === '/') addOperator('/');
        // Decimal point
        else if (e.key === '.') addNumber('.');
        // Parentheses
        else if (e.key === '(') addOperator('(');
        else if (e.key === ')') addOperator(')');
        // Enter/Equal
        else if (e.key === 'Enter' || e.key === '=') calculate();
        // Backspace
        else if (e.key === 'Backspace') deleteLast();
        // Escape/Clear
        else if (e.key === 'Escape') clearCalc();
    }
}); 