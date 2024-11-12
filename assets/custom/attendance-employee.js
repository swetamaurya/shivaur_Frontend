// Initializing Variables
let workSessionStartTime = null;
let breakSessionStartTime = null;
let workTimerInterval = null;
let breakTimerInterval = null;
let accumulatedWorkTime = 0;
let accumulatedBreakTime = 0;

// Redirect if no token
if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}

import { attendance_API } from './apis.js';

const token = localStorage.getItem("token");
const userId = localStorage.getItem("User_id");

// Initialize on window load
window.onload = function () {
    const punchButton = document.getElementById('punchButton');
    const breakButton = document.getElementById('breakButton');

    // Event Listeners for Punch and Break Buttons
    punchButton.addEventListener('click', () => {
        const action = punchButton.textContent === 'Punch In' ? 'workPunchIn' : 'workPunchOut';
        action === 'workPunchIn' ? punchIn() : punchOut();
    });

    breakButton.addEventListener('click', () => {
        const action = breakButton.textContent === 'Break In' ? 'breakPunchIn' : 'breakPunchOut';
        action === 'breakPunchIn' ? breakIn() : breakOut();
    });

    // Initialize Punch In/Out Button State
    const isPunchedIn = localStorage.getItem("isPunchedIn") === "true";
    const punchInTime = localStorage.getItem("punchInTime");
    if (isPunchedIn && punchInTime) {
        startWorkSessionTimer(new Date(punchInTime));
        punchButton.textContent = 'Punch Out';
    } else {
        punchButton.textContent = 'Punch In';
    }

    // Load and Display Total Break Time from localStorage
    const storedBreakTime = parseInt(localStorage.getItem("totalBreakTime") || "0");
    accumulatedBreakTime = storedBreakTime;
    displayTotalBreakTime(storedBreakTime / 60000); // Convert ms to minutes

    fetchAttendanceRecords();
};

// Punch In Function
async function punchIn() {
    try {
        const response = await fetch(`${attendance_API}/punch`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, action: 'workPunchIn' })
        });
        
        const data = await response.json();
        if (response.ok) {
            workSessionStartTime = new Date();
            localStorage.setItem("isPunchedIn", "true");
            localStorage.setItem("punchInTime", workSessionStartTime);
            startWorkSessionTimer(workSessionStartTime);
            document.getElementById('punchButton').textContent = 'Punch Out';
            fetchAttendanceRecords();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Punch-in failed:', error.message);
    }
}

// Punch Out Function
async function punchOut() {
    try {
        const response = await fetch(`${attendance_API}/punch`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, action: 'workPunchOut' })
        });
        
        const data = await response.json();
        if (response.ok) {
            accumulatedWorkTime += new Date() - workSessionStartTime;
            localStorage.setItem("isPunchedIn", "false");
            stopWorkSessionTimer();
            document.getElementById('punchButton').textContent = 'Punch In';
            fetchAttendanceRecords();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Punch-out failed:', error.message);
    }
}

// Break In Function
async function breakIn() {
    try {
        const response = await fetch(`${attendance_API}/punch`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, action: 'breakPunchIn' })
        });
        
        const data = await response.json();
        if (response.ok) {
            breakSessionStartTime = new Date();
            localStorage.setItem("isOnBreak", "true");
            stopWorkSessionTimer(); // Pause work session timer
            startBreakSessionTimer();
            document.getElementById('breakButton').textContent = 'Break Out';
            fetchAttendanceRecords();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Break-in failed:', error.message);
    }
}

// Break Out Function
async function breakOut() {
    try {
        const response = await fetch(`${attendance_API}/punch`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, action: 'breakPunchOut' })
        });
        
        const data = await response.json();
        if (response.ok) {
            accumulatedBreakTime += new Date() - breakSessionStartTime;
            localStorage.setItem("isOnBreak", "false");
            stopBreakSessionTimer(); // Stop break timer
            localStorage.setItem("totalBreakTime", accumulatedBreakTime);
            displayTotalBreakTime(accumulatedBreakTime / 60000); // Convert ms to minutes
            startWorkSessionTimer(new Date()); // Resume work session timer
            document.getElementById('breakButton').textContent = 'Break In';
            fetchAttendanceRecords();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Break-out failed:', error.message);
    }
}

// Timer Functions
function startWorkSessionTimer(startTime) {
    workSessionStartTime = startTime;
    clearInterval(workTimerInterval);
    workTimerInterval = setInterval(updateWorkSessionTime, 1000);
}

function stopWorkSessionTimer() {
    clearInterval(workTimerInterval);
}

function updateWorkSessionTime() {
    const elapsedTime = new Date() - workSessionStartTime + accumulatedWorkTime;
    document.getElementById('workSessionTime').textContent = formatTime(elapsedTime);
}

function startBreakSessionTimer() {
    breakSessionStartTime = new Date();
    clearInterval(breakTimerInterval);
    breakTimerInterval = setInterval(updateBreakSessionTime, 1000);
}

function stopBreakSessionTimer() {
    clearInterval(breakTimerInterval);
}

function updateBreakSessionTime() {
    const elapsedTime = new Date() - breakSessionStartTime + accumulatedBreakTime;
    document.getElementById('breakSessionTime').textContent = formatTime(elapsedTime);
}

// Display Total Times
function displayTotalWorkTime(totalMinutes) {
    document.getElementById('workHoursDisplay').textContent = formatTime(totalMinutes * 60000); // Convert to milliseconds
}

function displayTotalBreakTime(totalMinutes) {
    document.getElementById('breakHoursDisplay').textContent = formatTime(totalMinutes * 60000); // Convert to milliseconds
}

// Helper to Format Time in hh:mm:ss
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


// Fetch and display attendance records
async function fetchAttendanceRecords() {
    try {
        const response = await fetch(`${attendance_API}/get`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch attendance records');
        }

        const data = await response.json();
        if (data.attendanceRecords && data.attendanceRecords.length > 0) {
            populateTable(data.attendanceRecords);
        } else {
            displayNoRecordsMessage();
        }
    } catch (error) {
        console.error('Error fetching attendance:', error.message);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('attendance-table');
    tableBody.innerHTML = '';

    data.reverse().forEach((entry, index) => {
        const row = document.createElement('tr');
        const date = new Date(entry.date).toLocaleDateString();
        const punchIn = entry.punchIn ? new Date(entry.punchIn).toLocaleTimeString() : '-';
        const punchOut = entry.punchOut ? new Date(entry.punchOut).toLocaleTimeString() : '-';

        // Parse totalWorkHours and totalBreakHours from string format to minutes
        const workHoursParts = entry.totalWorkHours.match(/(\d+)\s*hrs\s*(\d+)\s*mins/);
        const totalWorkMinutes = workHoursParts
            ? parseInt(workHoursParts[1]) * 60 + parseInt(workHoursParts[2])
            : 0;

        const breakHoursParts = entry.totalBreakHours.match(/(\d+)\s*hrs\s*(\d+)\s*mins/);
        const totalBreakMinutes = breakHoursParts
            ? parseInt(breakHoursParts[1]) * 60 + parseInt(breakHoursParts[2])
            : 0;

        // Calculate display values for total work time
        const workHours = Math.floor(totalWorkMinutes / 60);
        const workMinutes = totalWorkMinutes % 60;
        const workSeconds = 0; // Assume seconds are 0 if not provided
        const totalWorkHoursDisplay = `${String(workHours).padStart(2, '0')} hrs ${String(workMinutes).padStart(2, '0')} mins ${String(workSeconds).padStart(2, '0')} secs`;

        // Calculate display values for total break time
        const breakHours = Math.floor(totalBreakMinutes / 60);
        const breakMinutes = totalBreakMinutes % 60;
        const breakSeconds = 0; // Assume seconds are 0 if not provided
        const totalBreakHoursDisplay = `${String(breakHours).padStart(2, '0')} hrs ${String(breakMinutes).padStart(2, '0')} mins ${String(breakSeconds).padStart(2, '0')} secs`;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${date}</td>
            <td>${punchIn}</td>
            <td>${punchOut}</td>
            <td>${totalWorkHoursDisplay}</td>
            <td>${totalBreakHoursDisplay}</td>
        `;

        tableBody.appendChild(row);
    });
}

function displayNoRecordsMessage() {
    const tableBody = document.getElementById('attendance-table');
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">No attendance records found</td>
        </tr>
    `;
}
