export function initDailyCalculator() {
    const form = document.getElementById('budgetForm');
    form.addEventListener('submit', handleDailySubmit);
    
    // Real-time input validation
    const inputs = ['vehicleBudget', 'expectedSales', 'tireGrossProfitBudgeted', 'currentTireGrossProfit', 'currentRubberDollarsSold', 'currentTiresSold'];
    inputs.forEach(id => document.getElementById(id).addEventListener('input', validateInput));
}

function validateInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    if (isNaN(value) || value <= 0) {
        input.classList.add('error');
        input.classList.remove('success');
        input.setCustomValidity('Please enter a positive number');
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        input.setCustomValidity('');
    }
}

function handleDailySubmit(event) {
    event.preventDefault();
    const isValid = Array.from(event.target.elements).every(element => element.checkValidity());
    
    if (!isValid) {
        document.getElementById('results').innerHTML = '<div class="alert alert-danger">Please correct the errors.</div>';
        return;
    }

    const vehicleBudget = parseFloat(document.getElementById('vehicleBudget').value);
    const expectedSales = parseFloat(document.getElementById('expectedSales').value);
    const tireGrossProfitBudgeted = parseFloat(document.getElementById('tireGrossProfitBudgeted').value);
    const currentTireGrossProfit = parseFloat(document.getElementById('currentTireGrossProfit').value);
    const currentRubberDollarsSold = parseFloat(document.getElementById('currentRubberDollarsSold').value);
    const currentTiresSold = parseFloat(document.getElementById('currentTiresSold').value);

    // Calculations
    const fluidExchangesNeeded = Math.ceil(vehicleBudget * 0.28);
    const inspectionsNeeded = Math.ceil(vehicleBudget * 0.21);
    const alignmentPrice = 129.99;
    const alignmentsNeededFor450 = Math.ceil(450 / alignmentPrice);
    const alignmentPercentageNeeded = (alignmentsNeededFor450 / vehicleBudget) * 100;
    
    let tireProfitMargin;
    if (currentTiresSold > 0) {
        tireProfitMargin = currentTireGrossProfit / currentTiresSold;
    } else {
        tireProfitMargin = currentTireGrossProfit > 0 ? currentTireGrossProfit / currentRubberDollarsSold : 1;
    }
    const tiresToMeetBudget = Math.ceil(tireGrossProfitBudgeted / tireProfitMargin);

    // Calculate average tire sale price
    const averageTireSalePrice = currentTiresSold > 0 ? currentRubberDollarsSold / currentTiresSold : 0;

    // Calculate expected tire sales revenue for the day
    const expectedTireSalesRevenue = tiresToMeetBudget * averageTireSalePrice;

    // Calculate service sales needed
    const serviceSalesNeeded = expectedSales - expectedTireSalesRevenue;

    // Calculate total labor budget for CST and VST
    const cstLaborPercentage = 0.15; // 15% for Customer Service Team
    const vstLaborPercentage = 0.22; // 22% for Vehicle Service Team
    const totalLaborBudget = expectedSales * (cstLaborPercentage + vstLaborPercentage);
    const cstLaborBudget = expectedSales * cstLaborPercentage;
    const vstLaborBudget = expectedSales * vstLaborPercentage;

    // Output
    const output = `
        <h2>Shop Statistics:</h2>
        <p>- You need to sell ${fluidExchangesNeeded} fluid exchanges to meet the 28% goal.</p>
        <p>- You need to perform ${inspectionsNeeded} complete vehicle inspections to meet the 21% goal.</p>
        <p>- You need to sell ${alignmentsNeededFor450} alignments to hit $450.</p>
        <p>- That's ${alignmentPercentageNeeded.toFixed(2)}% of your clients needing a paid alignment.</p>
        <p>- Based on your current profit margin of $${tireProfitMargin.toFixed(2)} per tire, you need to sell approximately ${tiresToMeetBudget} tires to meet your daily tire gross profit budget of $${tireGrossProfitBudgeted.toFixed(2)}.</p>
        <p>- You need to achieve 2 CFNA applications today.</p>
        <p>- Based on your feedback, you will need to generate approximately $${expectedTireSalesRevenue.toFixed(2)} from tire sales, leaving $${serviceSalesNeeded.toFixed(2)} to be made from service sales to meet your daily budgeted sales of $${expectedSales.toFixed(2)}.</p>
        <p>- Your total labor budget for today is $${totalLaborBudget.toFixed(2)}, with:</p>
        <ul>
            <li>$${cstLaborBudget.toFixed(2)} allocated for Customer Service Team (CST).</li>
            <li>$${vstLaborBudget.toFixed(2)} allocated for Vehicle Service Team (VST).</li>
        </ul>
    `;

    document.getElementById('results').innerHTML = '<div class="alert alert-success">Calculations Done</div>' + output;

    // Save to localStorage with the new fields
    localStorage.setItem('dailyStats', JSON.stringify({
        vehicleBudget, expectedSales, tireGrossProfitBudgeted, 
        currentTireGrossProfit, currentRubberDollarsSold, currentTiresSold,
        totalLaborBudget, cstLaborBudget, vstLaborBudget,
        expectedTireSalesRevenue, serviceSalesNeeded
    }));
}