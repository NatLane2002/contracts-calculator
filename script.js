let isMicro = true;
let lastPoints = null;
let lastRiskAmount = null;

function numContractsCalculator(numberOfPoints, multiplier, pointValue, riskAmount) {
    const result = (numberOfPoints / pointValue) * multiplier;
    return riskAmount / result;
}

function calculate() {
    const points = parseFloat(document.getElementById('points').value);
    const riskAmount = parseFloat(document.getElementById('riskAmount').value);

    if (isNaN(points) || isNaN(riskAmount) || riskAmount <= 0) {
        return; // Exit the function if the input is invalid
    }

    lastPoints = points; // Store the last valid inputs
    lastRiskAmount = riskAmount;

    updateResults(points, riskAmount);
}

function updateResults(points, riskAmount) {
    const sp500Multiplier = isMicro ? 1.25 : 12.5;
    const nasdaqMultiplier = isMicro ? 0.5 : 5;
    const dowJonesMultiplier = isMicro ? 0.5 : 5;

    // Calculate the contracts
    const sp500 = numContractsCalculator(points, sp500Multiplier, 0.25, riskAmount);
    const nasdaq = numContractsCalculator(points, nasdaqMultiplier, 0.25, riskAmount);
    const dowJones = numContractsCalculator(points, dowJonesMultiplier, 1, riskAmount);

    // Display the results
    document.getElementById('sp500').textContent = sp500.toFixed(1);
    document.getElementById('nasdaq').textContent = nasdaq.toFixed(1);
    document.getElementById('dowJones').textContent = dowJones.toFixed(1);
}

function toggleContracts() {
    isMicro = !isMicro;
    const label = isMicro ? 'Micro' : 'Mini';
    document.getElementById('sp500-label').textContent = `${label} S&P500 (${isMicro ? 'MES' : 'ES'})`;
    document.getElementById('nasdaq-label').textContent = `${label} Nasdaq (${isMicro ? 'MNQ' : 'NQ'})`;
    document.getElementById('dowJones-label').textContent = `${label} DowJones (${isMicro ? 'MYM' : 'YM'})`;

    if (lastPoints !== null && lastRiskAmount !== null) {
        updateResults(lastPoints, lastRiskAmount); // Recalculate based on last valid inputs
    }
}

function clearFields() {
    const riskAmountValue = document.getElementById('riskAmount').value;
    document.getElementById('points').value = '';
    document.getElementById('sp500').textContent = '0.0';
    document.getElementById('nasdaq').textContent = '0.0';
    document.getElementById('dowJones').textContent = '0.0';
    document.getElementById('riskAmount').value = riskAmountValue;

    // Reset the last valid inputs
    lastPoints = null;
    lastRiskAmount = null;
}
