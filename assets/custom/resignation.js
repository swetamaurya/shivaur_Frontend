// Redirect if token is missing
if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}

import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { user_API, resignation_API, departments_API } from './apis.js';
import { individual_delete, objects_data_handler_function } from './globalFunctionsDelete.js';

window.individual_delete = individual_delete;
const token = localStorage.getItem('token');

let cachedEmployee = [];
let cachedDepartments = [];
let res = [];

// Fetch Employee and Department Data
async function fetchEmployeeAndDepartments() {
    if (cachedEmployee.length === 0) {
        try {
            const response = await fetch(`${user_API}/data/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            cachedEmployee = data.users.employees || [];
            
        } catch (error) {
            console.error('Error fetching Employee:', error);
        }
    }

    if (cachedDepartments.length === 0) {
        try {
            const response = await fetch(`${departments_API}/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            cachedDepartments = await response.json();
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }
}

// Populate Dropdowns for Add/Edit Forms
window.populateEmployeeDropdown = function populateEmployeeDropdown() {
    const addEmpSelectOption = document.getElementById("add_employee");
    const editEmpSelectOption = document.getElementById("edit_employee");
    let addEmployee = document.querySelector('#add_resignation').attributes[3]

    // addEmpSelectOption.innerHTML = `<option value="" disabled selected>Select Employee</option>`;
    editEmpSelectOption.innerHTML = `<option value="" disabled selected>Select Employee</option>`;
    console.log('This is my response employee--->>>',cachedEmployee)

    if(!addEmployee){
    cachedEmployee.forEach(employee => {
        const option = document.createElement("option");
        option.value = employee._id ? employee._id: '';
        option.textContent = employee.name ? employee.name : '';
        // addEmpSelectOption.appendChild(option);
        editEmpSelectOption.appendChild(option);
    
    });
  }
  else{
    cachedEmployee.forEach(employee => {
        const option = document.createElement("option");
        option.value = employee._id ? employee._id: '';
        option.textContent = employee.name ? employee.name : '';
        addEmpSelectOption.appendChild(option);
    
    });
  }
}

window.populateDepartmentDropdown = function populateDepartmentDropdown() {
    // const addDeptSelectOption = document.getElementById("departments");
    const editDeptSelectOption = document.getElementById("edit-departments");

    // addDeptSelectOption.innerHTML = `<option value="" disabled selected>Select Department</option>`;
    editDeptSelectOption.innerHTML = `<option value="" disabled selected>Select Department</option>`;

    cachedDepartments.forEach(department => {
        const option = document.createElement("option");
        option.value = department._id;
        option.textContent = department.departments;
        // addDeptSelectOption.appendChild(option);
        editDeptSelectOption.appendChild(option );
    });
}

// Load all resignation data and display it in the table
async function all_data_load_dashboard() {
    try {
        loading_shimmer();
        await fetchEmployeeAndDepartments();

        populateEmployeeDropdown();
        populateDepartmentDropdown();

        const table = document.getElementById('resignation-table-body');
        table.innerHTML = '';
        let rows = [];

        const response = await fetch(`${resignation_API}/getAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res = await response.json();
      res.forEach(e => {
            const employeeName = e.employee ? e.employee.name : '-';
            const departmentName = e.department ? e.department.departments : '-';
            const resignationDate = e.resignationDate ? new Date(e.resignationDate).toLocaleDateString() : '-' 
            const reason = e.reason || '-';
            const noticeDate = e.noticeDate ? new Date(e.noticeDate).toLocaleDateString() : '-';

            rows.push(`<tr data-id="${e._id}">
                <td><input type="checkbox" class="checkbox_child" value="${e._id || '-'}"></td>
                <td>${employeeName}</td>
                <td>${departmentName}</td>
                <td>${resignationDate}</td>
                <td>${reason}</td>
                <td>${noticeDate}</td>
                <td>
                    <div class="dropdown dropdown-action">
                        <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="material-icons">more_vert</i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" onclick="handleClickOnEditResignation('${e._id}')" data-bs-toggle="modal" data-bs-target="#edit_resignation">
                                <i class="fa-solid fa-pencil m-r-5"></i> Edit
                            </a>
                            <a class="dropdown-item" onclick="individual_delete('${e._id}')" data-bs-toggle="modal" data-bs-target="#delete_resignation">
                                <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                            </a>
                        </div>
                    </div>
                </td>
            </tr>
        `);
    });
        table.innerHTML = rows.join('');
        checkbox_function();
    } catch (error) {
        console.error("Error loading resignations:", error);
    } finally {
        remove_loading_shimmer();
    }
}

window.onload = all_data_load_dashboard;

// Format date for Edit form
function formatDate(dateString) {
    return new Date(dateString).toISOString().split('T')[0];
}

// Edit Resignation
window.handleClickOnEditResignation = async function (_id) {
    const resignation = res.find(item => item._id === _id);
    if (!resignation) {
        console.error("Resignation data not found for ID:", _id);
        return;
    }

    await fetchEmployeeAndDepartments();
    populateEmployeeDropdown();
    populateDepartmentDropdown();

    document.getElementById("edit_employee").value = resignation.employee?._id || '';
    document.getElementById("edit_departments").value = resignation.department?._id || '';
    document.getElementById("edit_noticeDate").value = formatDate(resignation.noticeDate) || '';
    document.getElementById("edit_resignationDate").value = formatDate(resignation.resignationDate) || '';
    document.getElementById("edit_reason").value = resignation.reason;

    const editForm = document.getElementById("edit-resignation");
    editForm.onsubmit = null;

    editForm.onsubmit = async function(event) {
        event.preventDefault();
        try {
            loading_shimmer();

            const updateData = {
                employee: document.getElementById("edit_employee").value,
                department: document.getElementById("edit_departments").value,
                noticeDate: document.getElementById("edit_noticeDate").value,
                resignationDate: document.getElementById("edit_resignationDate").value,
                reason: document.getElementById("edit_reason").value
            };

            const response = await fetch(`${resignation_API}/update`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id, ...updateData })
            });

            const success = response.ok;
            status_popup(success ? "Resignation Updated Successfully!" : "Please try again later", success);
            
            if (success) await all_data_load_dashboard();
        } catch (error) {
            console.error('Error updating Resignation:', error);
            status_popup("Please try again later", false);
        } finally {
            remove_loading_shimmer();
        }
    };
};
 

// Initialize on page load
window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);

 
// document.getElementById('add-resignation-form').addEventListener('submit', async function (event) {
//     event.preventDefault();
//     const submitButton = event.target.querySelector("button[type='submit']");
//     submitButton.disabled = true;

//     try {
//         document.querySelectorAll(".btn-close").forEach(e => e.click());
//         loading_shimmer();

//         const employee = document.getElementById('add_employee').value;
//         const department = document.getElementById('departments').value;
//         const noticeDate = document.getElementById('add_noticeDate').value;
//         const resignationDate = document.getElementById('add_resignationDate').value;
//         const reason = document.getElementById('add_reason').value;

//         const response = await fetch(`${resignation_API}/post`, {
//             method: 'POST',
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ employee, department, noticeDate, resignationDate, reason })
//         });

//         const success = response.ok;
//         if (success) 
//             status_popup(success ? "Resignation added <br> Successfully" : "Please try again later", success);

//         loadResignation();
//     } catch (error) {
//         console.error('Error adding Resignation:', error);
//         status_popup("Please try <br> again later", false);
//     } finally {
//         remove_loading_shimmer();
//     }
// });