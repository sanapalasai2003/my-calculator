let display = document.getElementById('display');
let currentInput = '';
let currentOperator = '';
let previousInput = '';
let calculated = false; // To handle immediate new input after calculation

function appendNumber(num) {
    if (calculated) {
        currentInput = num.toString();
        calculated = false;
    } else {
        // Prevent multiple decimal points
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num.toString();
    }
    display.value = currentInput;
}

function appendOperator(operator) {
    if (currentInput === '' && previousInput === '') return; // No input yet
    if (currentInput !== '' && previousInput !== '' && currentOperator !== '') {
        // If we have a full expression and click another operator, calculate first
        calculate();
        previousInput = display.value; // Use the result as previous input
        currentInput = ''; // Clear current input for next number
    } else if (currentInput !== '') {
        previousInput = currentInput;
    }
    currentOperator = operator;
    currentInput = ''; // Clear current input for the next number
    display.value = previousInput + ' ' + currentOperator; // Show expression
    calculated = false; // Reset calculation flag
}

function calculate() {
    if (previousInput === '' || currentInput === '' || currentOperator === '') {
        return; // Not enough parts to calculate
    }

    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) {
        display.value = 'Error';
        clearAll();
        return;
    }

    switch (currentOperator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                display.value = 'Error: Div by 0';
                clearAll();
                return;
            }
            result = prev / curr;
            break;
        default:
            return; // Should not happen
    }

    // Rounding to avoid floating point inaccuracies for display
    display.value = parseFloat(result.toFixed(8)).toString(); // Limit decimals, then convert back
    currentInput = display.value; // Set the result as the new current input for chained operations
    previousInput = '';
    currentOperator = '';
    calculated = true;
}

function clearDisplay() {
    currentInput = '';
    currentOperator = '';
    previousInput = '';
    calculated = false;
    display.value = '';
}

// Optional: Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(parseInt(key));
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent default Enter key behavior (e.g., submitting forms)
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    }
});
