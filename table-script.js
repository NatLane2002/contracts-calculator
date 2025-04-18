// Default mode: Micro (toggle switch OFF)
let isMicro = true;
let riskAmount = 0;

// Initialize values from URL parameters
document.addEventListener('DOMContentLoaded', function() {
  // Get risk amount from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('risk')) {
    riskAmount = parseFloat(urlParams.get('risk'));
    document.getElementById('riskAmount').textContent = riskAmount.toFixed(2);
  }
  
  // Check for micro/mini setting in URL
  if (urlParams.has('micro')) {
    isMicro = urlParams.get('micro') === 'true';
    document.getElementById('contractToggle').checked = !isMicro;
  }
  
  // Update table titles based on mode
  updateTableTitles();
  
  // Generate tables
  generateTables();
  
  // Apply dark mode if stored
  const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
  }
  
  // Set up tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const instrument = this.getAttribute('data-instrument');
      switchTables(instrument);
    });
  });
  
  // Update back button to include risk amount
  const backBtn = document.querySelector('.back-btn');
  if (backBtn && riskAmount > 0) {
    backBtn.href = `index.html?risk=${riskAmount}`;
  }
  
  // By default, show the nasdaq table
  switchTables('nasdaq');
});

// Calculate contracts using the provided formula
function numContractsCalculator(numberOfPoints, multiplier, pointValue, riskAmount) {
  const result = (numberOfPoints / pointValue) * multiplier;
  return Math.round(riskAmount / result);
}

// Toggle between Micro and Mini contracts
function toggleContractsAndRefreshTable() {
  const checkbox = document.getElementById('contractToggle');
  isMicro = !checkbox.checked;
  
  // Update table titles
  updateTableTitles();
  
  // Regenerate tables
  generateTables();
}

// Update table titles based on current mode
function updateTableTitles() {
  document.getElementById('sp500-table-title').textContent = isMicro ? "MES Contracts" : "ES Contracts";
  document.getElementById('nasdaq-table-title').textContent = isMicro ? "MNQ Contracts" : "NQ Contracts";
  document.getElementById('dowJones-table-title').textContent = isMicro ? "MYM Contracts" : "YM Contracts";
  document.getElementById('gold-table-title').textContent = isMicro ? "MGC Contracts" : "GC Contracts";
}

// Switch between tables
function switchTables(instrument) {
  // Hide all tables first
  document.querySelectorAll('.table-section').forEach(table => {
    table.style.display = 'none';
  });
  
  // Show the selected table
  document.getElementById(`${instrument}-table`).style.display = 'block';
  
  // Update active button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  document.querySelector(`.tab-btn[data-instrument="${instrument}"]`).classList.add('active');
}

// Generate tables with different SL ranges
function generateTables() {
  if (riskAmount <= 0) return;
  
  // Clear existing tables
  document.getElementById('sp500-contracts').innerHTML = '';
  document.getElementById('nasdaq-contracts').innerHTML = '';
  document.getElementById('dowJones-contracts').innerHTML = '';
  document.getElementById('gold-contracts').innerHTML = '';
  
  // Set multipliers based on mode
  const sp500Multiplier = isMicro ? 1.25 : 12.5;
  const nasdaqMultiplier = isMicro ? 0.5 : 5;
  const dowJonesMultiplier = isMicro ? 0.5 : 5;
  const goldMultiplier = isMicro ? 1 : 10; // MGC is 10oz, GC is 100oz
  
  // Generate data for each table
  generateTableData('sp500-contracts', sp500Multiplier, 0.25, false);
  generateTableData('nasdaq-contracts', nasdaqMultiplier, 0.25, false);
  generateTableData('dowJones-contracts', dowJonesMultiplier, 1, false);
  generateTableData('gold-contracts', goldMultiplier, 0.1, true); // Gold uses smaller ranges
}

// Generate table data for different SL ranges
function generateTableData(tableId, multiplier, pointValue, isGold) {
  const tableBody = document.getElementById(tableId);
  
  // Define stop loss ranges based on instrument type
  const ranges = isGold 
    ? [ // Smaller ranges for Gold (0-2, 2-4, etc.)
        { min: 0, max: 2 },
        { min: 2, max: 4 },
        { min: 4, max: 6 },
        { min: 6, max: 8 },
        { min: 8, max: 10 },
        { min: 10, max: 12 },
        { min: 12, max: 14 },
        { min: 14, max: 16 },
        { min: 16, max: 18 },
        { min: 18, max: 20 }
      ]
    : [ // Standard ranges for other instruments (5-point increments)
        { min: 0, max: 5 },
        { min: 5, max: 10 },
        { min: 10, max: 15 },
        { min: 15, max: 20 },
        { min: 20, max: 25 },
        { min: 25, max: 30 },
        { min: 30, max: 35 },
        { min: 35, max: 40 },
        { min: 40, max: 45 },
        { min: 45, max: 50 }
      ];
  
  // Generate rows for each range
  ranges.forEach(range => {
    // Calculate for midpoint of range
    const midpoint = (range.min + range.max) / 2;
    const contracts = numContractsCalculator(midpoint, multiplier, pointValue, riskAmount);
    
    // Create table row
    const row = document.createElement('tr');
    
    // Range column
    const rangeCell = document.createElement('td');
    rangeCell.textContent = `${range.min} - ${range.max} points`;
    row.appendChild(rangeCell);
    
    // Contracts column
    const contractsCell = document.createElement('td');
    contractsCell.textContent = contracts;
    
    // Highlight values - SWAPPED colors (red for high risk, green for low risk)
    if (contracts <= 1) {
      contractsCell.classList.add('high-contracts'); // Used to be low-contracts, now high (green)
    } else if (contracts >= 10) {
      contractsCell.classList.add('low-contracts'); // Used to be high-contracts, now low (red)
    }
    
    row.appendChild(contractsCell);
    
    // Add row to table
    tableBody.appendChild(row);
  });
}

// Dark Mode Toggle Functionality
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const darkModeEnabled = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkModeEnabled', darkModeEnabled);
} 