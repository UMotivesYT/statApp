import { initDailyCalculator } from './dailyCalculator.js';
import { initMonthlyTracker } from './monthlyTracker.js';

document.addEventListener('DOMContentLoaded', () => {
    initDailyCalculator();
    initMonthlyTracker();
    
    // Function to handle navigation between sections
    window.showSection = function(section) {
        document.getElementById('daily').style.display = section === 'daily' ? 'block' : 'none';
        document.getElementById('monthly').style.display = section === 'monthly' ? 'block' : 'none';
    };
});