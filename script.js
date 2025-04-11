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
                    button.click();
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