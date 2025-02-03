// Default mode: Micro (toggle switch OFF)
let isMicro = true;  
let lastPoints = null;
let lastRiskAmount = null;

// Calculate contracts using the provided formula.
function numContractsCalculator(numberOfPoints, multiplier, pointValue, riskAmount) {
  const result = (numberOfPoints / pointValue) * multiplier;
  return riskAmount / result;
}

function calculate() {
  const points = parseFloat(document.getElementById('points').value);
  const riskAmount = parseFloat(document.getElementById('riskAmount').value);

  if (isNaN(points) || isNaN(riskAmount) || riskAmount <= 0) {
    return; // Exit if inputs are invalid.
  }

  lastPoints = points;       // Store last valid inputs.
  lastRiskAmount = riskAmount;

  updateResults(points, riskAmount);
}

function updateResults(points, riskAmount) {
  // Choose multipliers based on mode:
  const sp500Multiplier = isMicro ? 1.25 : 12.5;
  const nasdaqMultiplier = isMicro ? 0.5 : 5;
  const dowJonesMultiplier = isMicro ? 0.5 : 5;

  // Calculate contract numbers.
  const sp500 = numContractsCalculator(points, sp500Multiplier, 0.25, riskAmount);
  const nasdaq = numContractsCalculator(points, nasdaqMultiplier, 0.25, riskAmount);
  const dowJones = numContractsCalculator(points, dowJonesMultiplier, 1, riskAmount);

  // Update result fields.
  document.getElementById('sp500').textContent = sp500.toFixed(1);
  document.getElementById('nasdaq').textContent = nasdaq.toFixed(1);
  document.getElementById('dowJones').textContent = dowJones.toFixed(1);

  updateVisibility();
}

function toggleContracts() {
  // Toggle mode: When the switch is toggled ON, Mini mode; OFF means Micro mode.
  const checkbox = document.getElementById('contractToggle');
  // Using the inverse so that when checkbox is unchecked (default), isMicro is true.
  isMicro = !checkbox.checked;

  // Update result box labels based on the mode.
  document.getElementById('sp500-label').textContent = isMicro ? "MES" : "ES";
  document.getElementById('nasdaq-label').textContent = isMicro ? "MNQ" : "NQ";
  document.getElementById('dowJones-label').textContent = isMicro ? "MYM" : "YM";

  if (lastPoints !== null && lastRiskAmount !== null) {
    updateResults(lastPoints, lastRiskAmount);
  }
}

function updateVisibility() {
  const selected = document.querySelector('input[name="instrument"]:checked').value;

  document.getElementById('sp500-box').style.display = (selected === 'sp500') ? 'block' : 'none';
  document.getElementById('nasdaq-box').style.display = (selected === 'nasdaq') ? 'block' : 'none';
  document.getElementById('dowJones-box').style.display = (selected === 'dowJones') ? 'block' : 'none';
}

// Trigger calculate() when Enter is pressed in the points input field.
document.getElementById('points').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    calculate();
  }
});

// Update result visibility when radio buttons change.
document.querySelectorAll('input[name="instrument"]').forEach((elem) => {
  elem.addEventListener('change', updateVisibility);
});

// Dark Mode Toggle Functionality.
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const darkModeEnabled = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkModeEnabled', darkModeEnabled);
}

// On page load, apply dark mode if previously enabled and set default radio selection.
document.addEventListener('DOMContentLoaded', function() {
  const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
  }

  updateVisibility();
});
