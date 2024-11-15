// Ensure token is set and redirect if not found
if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { capitalizeFirstLetter } from './globalFunctions2.js'
import { departments_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================
let res = [];

 // Load Department List
async function all_data_load_dashboard() {
    try {
        try{
            loading_shimmer();
        } catch(error){console.log(error)}
        // -----------------------------------------------------------------------------------

        // Fetch departments data
        const table = document.getElementById('departmentData');
        table.innerHTML = ''; // Clear previous data
        let rows = [];

        const response = await fetch(`${departments_API}/get`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res = await response.json(); // Fetch and parse department data
        console.log("Department Data:", res); // Log fetched data

        console.log(res)

        if(res.length>0){
            res.forEach(department => {
                rows.push(`
                    <tr data-id="${department._id}">
                        <td><input type="checkbox" class="checkbox_child" value="${department._id || '-'}"></td>
                        <td>${capitalizeFirstLetter(department?.departments) || '-'}</td>
                        <td>
                            <div class="dropdown dropdown-action">
                                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="material-icons">more_vert</i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" onclick="handleClickOnEditdepartment('${department._id}')" data-bs-toggle="modal" data-bs-target="#edit_department">
                                        <i class="fa-solid fa-pencil m-r-5"></i> Edit
                                    </a>
                                    <a class="dropdown-item" onclick="individual_delete('${department._id}')" data-bs-toggle="modal" data-bs-target="#delete_department">
                                        <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                `);
            });

            // Add the rows to the table
            table.innerHTML = rows.join('');
            checkbox_function(); // Apply checkbox functionality
        } else {
            rows = `
                <tr>
                    <td  colspan="3" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
                </tr>`;
    
            table.innerHTML = rows;
        }

    } catch (error) {
        console.error("Error loading departments:", error);
        status_popup("Failed to load departments", false);
    } 
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}

// Department addition logic
document.getElementById('add_department').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        try{
            loading_shimmer();
            document.querySelectorAll(".btn-close").forEach(e => e.click());
        } catch(error){console.log(error)}
        // -----------------------------------------------------------------------------------

        const departments = document.getElementById('departments').value;
        const response = await fetch(`${departments_API}/post`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ departments })
        });

        const success = response.ok;
        status_popup(success ? "Department Added <br> Successfully!" : "Please try again later", success);
        if (success) {
            all_data_load_dashboard(); // Reload departments after addition
        }
    } catch (error) {
        console.error('Error adding Department:', error);
        status_popup("Please try <br> again later", false);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});

// Show department data in edit modal by _id
window.handleClickOnEditdepartment = function (_id) {
    const department = res.find(dept => dept._id === _id);
    if (department) {
        document.getElementById('editdepartment').value = department.departments || '';

        const editForm = document.getElementById('edit_department_form');
 
        editForm.onsubmit = null;

        // Attach new event listener for form submission
        editForm.onsubmit = async function(event) {
            event.preventDefault();
            try {
                try{
                    Array.from(document.querySelectorAll(".btn-close")).forEach(e => e.click());
                    loading_shimmer();
                } catch(error){console.log(error)}
                // -----------------------------------------------------------------------------------

                const departments = document.getElementById('editdepartment').value;
                const response = await fetch(`${departments_API}/update`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ departments, _id })
                });

                const success = response.ok;
                status_popup(success ? "Department Updated Successfully!" : "Failed to update department", success);
                if (success) {
                    editForm.reset(); // Reset edit form fields
                    await all_data_load_dashboard(); // Reload department list
                }
            } catch (error) {
                console.error("Error updating department:", error);
                status_popup("Failed to update department", false);
            }
            // ----------------------------------------------------------------------------------------------------
            try{
                remove_loading_shimmer();
            } catch(error){console.log(error)}
        };
    } else {
        console.error("Edit department form element not found");
    }
}


window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);
