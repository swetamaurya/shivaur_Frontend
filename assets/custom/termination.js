if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { user_API, termination_API, departments_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================


// Caching employees and departments to avoid redundant API calls
let cachedEmployee = [];
let res =[]

// Fetch Employee and Department Data
async function fetchEmployeeAndDepartments() {
    if (cachedEmployee.length === 0) {
        try {
            const EmployeeResponse = await fetch(`${user_API}/data/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const res = await EmployeeResponse.json();
            cachedEmployee = res.users.employees || []; // Use fallback to empty array
        } catch (error) {
            console.error('Error fetching Employee:', error);
        }
    }
}

// Populate Dropdowns for Add/Edit Forms
function populateEmployeeDropdown() {
    const addEmpSelectOption = document.getElementById("add_employee");
    const editEmpSelectOption = document.getElementById("edit_employee");

    if (!addEmpSelectOption || !editEmpSelectOption) {
        console.error("Employee dropdown elements not found.");
        return;
    }

    addEmpSelectOption.innerHTML = `<option value="" disabled selected>Select Employee</option>`;
    editEmpSelectOption.innerHTML = `<option value="" disabled selected>Select Employee</option>`;

    cachedEmployee.forEach(employee => {
        const option = document.createElement("option");
        option.value = employee._id;
        option.textContent = employee.name;
        addEmpSelectOption.appendChild(option);
        editEmpSelectOption.appendChild(option.cloneNode(true)); // Clone for edit dropdown
    });
}
// Load Termination Data
async function all_data_load_dashboard() {
    try {
        loading_shimmer();
        await fetchEmployeeAndDepartments();

        populateEmployeeDropdown();

        const table = document.getElementById('termination-table-body');
        table.innerHTML = ''; // Clear previous data
        let rows = [];

        const response = await fetch(`${termination_API}/getAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res = await response.json(); // Populate global res array with termination data
        console.log("Termination Data Loaded in `res`:", res); // Log `res` to check data

        res.forEach(e => {
            const employeeName = e.employee ? e.employee.name : '-';
            const terminationType = e.TerminationType || '-';
            const reason = e.reason || '-';

            rows.push(`<tr data-id="${e._id}">
                <td><input type="checkbox" class="checkbox_child" value="${e._id || '-'}"></td>
                <td>${employeeName}</td>
                <td>${capitalizeFirstLetter(terminationType)}</td>
                <td>${formatDate(e.terminationDate)}</td>
                <td>${reason}</td>
                <td>
                    <div class="dropdown dropdown-action">
                        <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="material-icons">more_vert</i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" onclick="handleClickOnEdittermination('${e._id}')" data-bs-toggle="modal" data-bs-target="#edit_termination">
                                <i class="fa-solid fa-pencil m-r-5"></i> Edit
                            </a>
                            <a class="dropdown-item" onclick="individual_delete('${e._id}')" data-bs-toggle="modal" data-bs-target="#delete_termination">
                                <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                            </a>
                        </div>
                    </div>
                </td>
            </tr>`);
        });

        table.innerHTML = rows.join('');
        checkbox_function();

    } catch (error) {
        console.error("Error loading terminations:", error);
    } finally {
        remove_loading_shimmer();
    }
}

// Load all data on page load
window.onload = all_data_load_dashboard;


// Add Termination
document.getElementById('add-termination-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    try {
        Array.from(document.querySelectorAll(".btn-close")).forEach(e => e.click());
        loading_shimmer();

        const employee = document.getElementById('add_employee').value;
        const department = document.getElementById('departments').value;
        const TerminationType = document.getElementById('TerminationType').value;
        const terminationDate = document.getElementById('add_terminationDate').value;
        const reason = document.getElementById('add_reason').value;

        document.getElementById('add-termination-form').reset(); // Clear form fields

        const response = await fetch(`${termination_API}/post`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ employee, department, TerminationType, terminationDate, reason })
        });

        const success = response.ok;
        status_popup(success ? "Termination Added <br> Successfully!" : "Please try again later", success);
        if (success) all_data_load_dashboard();
    } catch (error) {
        console.error('Error adding Termination:', error);
        status_popup("Please try again later", false);
    } finally {
        remove_loading_shimmer();
    }
});

// Edit Termination
window.handleClickOnEdittermination = async function (_id) {
    const termination = res.find(item => item._id === _id);
    if (!termination) {
        console.error("Termination data not found for ID:", _id);
        return;
    }

    await fetchEmployeeAndDepartments();
    populateEmployeeDropdown();

    document.getElementById("edit_employee").value = termination.employee?._id || '';
    document.getElementById("edit_departments").value = termination.department?._id || '';
    document.getElementById("edit_TerminationType").value = termination.TerminationType || '';
    document.getElementById("edit_terminationDate").value = termination.terminationDate ? new Date(termination.terminationDate).toISOString().split('T')[0] : '';
    document.getElementById("edit_reason").value = termination.reason || '';

    const editForm = document.getElementById("edit-termination");

    // Remove any existing submit event listeners to prevent duplicate calls
    editForm.onsubmit = null;

    // Attach new event listener for form submission
    editForm.onsubmit = async function(event) {
        event.preventDefault();

        try {
            loading_shimmer();

            const updateData = {
                employee: document.getElementById("edit_employee").value,
                department: document.getElementById("edit_departments").value,
                TerminationType: document.getElementById("edit_TerminationType").value,
                terminationDate: document.getElementById("edit_terminationDate").value,
                reason: document.getElementById("edit_reason").value
            };

            const response = await fetch(`${termination_API}/update`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id, ...updateData })
            });

            const success = response.ok;
            status_popup(success ? "Termination Updated Successfully!" : "Please try again later", success);

            if (success) await all_data_load_dashboard();
        } catch (error) {
            console.error('Error updating termination:', error);
            status_popup("Please try again later", false);
        } finally {
            remove_loading_shimmer();
        }
    };
};


window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);

 
 