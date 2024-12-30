export function initMonthlyTracker() {
    const monthSelect = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const loadButton = document.querySelector('button[onclick="loadCalendar()"]');
    const generateButton = document.getElementById('generateGoalSheet');

    // Populate month select
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = (index + 1).toString().padStart(2, '0');
        option.text = month;
        monthSelect.appendChild(option);
    });

    monthSelect.addEventListener('change', loadCalendar);
    yearInput.addEventListener('change', loadCalendar);
    loadButton.addEventListener('click', loadCalendar);
    generateButton.addEventListener('click', generateGoalSheet);

    // Load calendar if a month is already selected on page load
    if (monthSelect.value) {
        loadCalendar();
    }
}

function loadCalendar() {
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const daysInMonth = new Date(year, month, 0).getDate();
    let calendarHTML = '<div class="text-center">';
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${year}-${month.padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        const savedData = localStorage.getItem(dateKey);
        const cellClass = savedData ? 'day-cell saved' : 'day-cell';
        calendarHTML += `<div class="${cellClass}" onclick="showDayDetails(${i})">${i}</div>`;
    }
    
    calendarHTML += '</div>';
    document.getElementById('calendar').innerHTML = calendarHTML;
    document.getElementById('generateGoalSheet').style.display = 'block';
}

function showDayDetails(day) {
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const dateKey = `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    let savedData = localStorage.getItem(dateKey);
    savedData = savedData ? JSON.parse(savedData) : {};

    let html = `
        <h3>Details for ${day}/${month}/${year}</h3>
        <form id="dayDetailsForm">
            <div class="mb-3">
                <label for="dayVehicleBudget" class="form-label">Vehicles:</label>
                <input type="number" class="form-control" id="dayVehicleBudget" value="${savedData.vehicles || ''}" required>
            </div>
            <!-- Add other inputs similarly -->
            <button type="button" class="btn btn-primary" onclick="saveDayDetails('${dateKey}')">Save</button>
        </form>
    `;
    document.getElementById('dailyDetails').innerHTML = html;
    document.getElementById('dailyDetails').style.display = 'block';
}

function saveDayDetails(dateKey) {
    const vehicles = document.getElementById('dayVehicleBudget').value;
    localStorage.setItem(dateKey, JSON.stringify({ vehicles: vehicles }));
    alert(`Data for ${dateKey} saved!`);
}

function generateGoalSheet() {
    // Placeholder for actual logic
    const goalSheet = document.createElement('table');
    goalSheet.className = 'goal-sheet';
    
    const headerRow = goalSheet.insertRow();
    ['Fluid Exchanges', 'Inspections', 'Alignments', 'Tires', 'CFNA'].forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        headerRow.appendChild(th);
    });

    const dataRow = goalSheet.insertRow();
    for (let i = 0; i < 5; i++) { // Assuming 5 columns for now
        const td = dataRow.insertCell();
        td.textContent = '...'; // Placeholder data
    }

    document.getElementById('goalSheetOutput').innerHTML = '';
    document.getElementById('goalSheetOutput').appendChild(goalSheet);
}