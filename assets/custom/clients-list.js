if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { user_API } from './apis.js';
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
<<<<<<< HEAD
// -------------------------------------------------------------------------
import {main_hidder_function} from './gloabl_hide.js';
=======
import { user_API } from './apis.js';
>>>>>>> d26da3fff18da4e43729e763ccb5d089cb5bb30a
// import { globalSearch } from './globalSearch.js'; // API URL
import { global_search_API } from './apis.js'; // Define your global search API URL
const token = localStorage.getItem('token');
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
import {rtnPaginationParameters, setTotalDataCount} from './globalFunctionPagination.js';

import {} from "./globalFunctionsExport.js";
// =================================================================================

// =================================================================================
 
 // Function to handle search and update the same table
async function handleSearch() {
    const searchFields = ["userId", "name"]; // IDs of input fields
    const searchType = "user"; // Type to pass to the backend
    const tableData = document.getElementById("tableData");
    let x = '';

    try {
        loading_shimmer();

        // Fetch search results
        const queryParams = new URLSearchParams({ type: searchType });
        searchFields.forEach((field) => {
            const value = document.getElementById(field)?.value;
            if (value) queryParams.append(field, value);
        });

        const response = await fetch(`${global_search_API}?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        if (res.data?.length > 0) {
            res.data.forEach((e) => {
                x += `<tr data-id="${e?._id}">
                        <td><input type="checkbox" class="checkbox_child" value="${e?._id || '-'}"></td>
                        <td>${e?.name || '-'}</td>
                        <td>${e?.userId || ''}</td>
                        <td>${e?.contactName || '-'}</td>
                        <td>${e?.email || '-'}</td>
                        <td>${e?.mobile || '-'}</td>
                        <td>${e?.status || '-'}</td>
                        <td class="text-end">
                            <div class="dropdown dropdown-action">
                                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="material-icons">more_vert</i></a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" onclick="handleClickOnViewClient('${e?._id}')"  data-bs-toggle="modal" data-bs-target="#view_data"><i class="fa-regular fa-eye m-r-5"></i> View</a>
<<<<<<< HEAD
                                    <a class="dropdown-item hr_restriction employee_restriction" onclick="handleClickOnEditClient('${e?._id}')" data-bs-toggle="modal" data-bs-target="#edit_data"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                                    <a class="dropdown-item hr_restriction employee_restriction" onclick="individual_delete('${e?._id}')" href="#" data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
=======
                                    <a class="dropdown-item" onclick="handleClickOnEditClient('${e?._id}')" data-bs-toggle="modal" data-bs-target="#edit_data"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                                    <a class="dropdown-item" onclick="individual_delete('${e?._id}')" href="#" data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
>>>>>>> d26da3fff18da4e43729e763ccb5d089cb5bb30a
                                </div>
                            </div>
                        </td>
                    </tr>`;
            });
        } else {
            x = `<tr><td colspan="8" class="text-center">No results found</td></tr>`;
        }
    } catch (error) {
        console.error("Error during search:", error);
        x = `<tr><td colspan="8" class="text-center">An error occurred during search</td></tr>`;
    } finally {
        tableData.innerHTML = x;
        checkbox_function(); // Reinitialize checkboxes
        remove_loading_shimmer();
    }
<<<<<<< HEAD
    try{
        main_hidder_function();
    } catch (error){console.log(error)}
=======
>>>>>>> d26da3fff18da4e43729e763ccb5d089cb5bb30a
}


// =======================================================================================
// Event listener for search button
document.getElementById("searchButton").addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch(); // Trigger search
});

async function all_data_load_dashboard(){
    const tableData = document.getElementById("tableData");
    let x = '';
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const response = await fetch(`${user_API}/data/get${rtnPaginationParameters()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    
        const res = await response.json();
        console.log("broro :- ",res);
        setTotalDataCount(res?.totalClients);
        let user = res?.users?.clients;

        if(user.length>0){
    
            for (let i = 0; i < user.length; i++) {
                let e = user[i];
                x += `<tr data-id="${e?._id}">
                        <td><input type="checkbox" class="checkbox_child" value="${e?._id || '-'}"></td>
                        <td>${e?.name || '-'} </td>
                        <td>${e?.userId || ''}</td>
                        <td>${e?.contactName || '-'}</td>
                        <td>${e?.email || '-'}</td>
                        <td>${e?.mobile || '-'}</td>
                        <td>${e?.status || '-'}</td>
                        <td class="text-end">
                            <div class="dropdown dropdown-action">
                                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="material-icons">more_vert</i></a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" onclick="handleClickOnViewClient('${e?._id}')"  data-bs-toggle="modal" data-bs-target="#view_data"><i class="fa-regular fa-eye m-r-5"></i> View</a>
                                    <a class="dropdown-item hr_restriction employee_restriction" onclick="handleClickOnEditClient('${e?._id}')" data-bs-toggle="modal" data-bs-target="#edit_data"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                                    <a class="dropdown-item hr_restriction employee_restriction" onclick="individual_delete('${e?._id}')" href="#" data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                                </div>
                            </div>
                        </td>
                    </tr>`;
            }
        } else {
            x = `
                <tr>
                    <td  colspan="8" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
                </tr>`;
        }
    } catch(error){
        x += `
                <tr>
                    <td  colspan="8" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
                </tr>`;
    }
    tableData.innerHTML = x;
    checkbox_function();
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
    try{
        main_hidder_function();
    } catch (error){console.log(error)}
}

// =======================================================================================
// =======================================================================================

// On page load, load employee data for the dashboard
window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);

// ====================================================================================================================================
// ====================================================================================================================================
window.handleClickOnViewClient = async function handleClickOnViewClient(_id){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try {
        let r = await fetch(`${user_API}/get/${_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        
        let r2 = await r.json();
        document.getElementById('view-name').value = r2?.name;
        document.getElementById('view-address').value = r2?.address;
        document.getElementById('view-email').value = r2?.email;
        document.getElementById('view-mobile').value = r2?.mobile;
        document.getElementById('view-status').value = r2?.status;
        document.getElementById('viewContactName').value = r2?.contactName;
        document.getElementById('viewContactEmail').value = r2?.contactEmail;
        document.getElementById('viewContactMobile').value = r2?.contactMobile;
    } catch (error) {
        console.error('Error updating client:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
// ====================================================================================================================================
// ====================================================================================================================================
// ====================================================================================================================================
// ====================================================================================================================================
window.handleClickOnEditClient = async function handleClickOnEditClient(_id){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try {
        let r = await fetch(`${user_API}/get/${_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        
        let r2 = await r.json();
        document.getElementById("_id_hidden_update").value = r2?._id;
        document.getElementById('update-name').value = r2?.name;
        document.getElementById('update-address').value = r2?.address;
        document.getElementById('update-email').value = r2?.email;
        document.getElementById('update-mobile').value = r2?.mobile;
        document.getElementById('update-status').value = r2?.status;
        document.getElementById('editContactName').value = r2?.contactName;
        document.getElementById('editContactEmail').value = r2?.contactEmail;
        document.getElementById('editContactMobile').value = r2?.contactMobile;
    } catch (error) {
        console.error('Error updating client:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
const clientUpdateForm = document.getElementById('client-update-form');
clientUpdateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateEmployeeForm("edit")) {
        return; // Stop form submission if validation fails
    }
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    let _id = document.getElementById("_id_hidden_update").value;    
    let name = document.getElementById('update-name').value;
    let address = document.getElementById('update-address').value;
    let email = document.getElementById('update-email').value;
    let mobile = document.getElementById('update-mobile').value;
    let status = document.getElementById('update-status').value;
    let contactName = document.getElementById('editContactName').value;
    let contactEmail = document.getElementById('editContactEmail').value;
    let contactMobile = document.getElementById('editContactMobile').value;

    try {
        const response = await fetch(`${user_API}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, contactMobile, contactName, address, contactEmail, status, email, mobile, _id })
        });
            
        try{
            Array.from(document.querySelectorAll(".btn-close")).map(e=>e.click());
        } catch(error){console.log(error);}

        const c1 = (response.ok);
        try{
            if(c1){
                all_data_load_dashboard();
            }
            status_popup( ((c1) ? "Data Updated <br> Successfully" : "Please try <br> again later"), (c1) );
        } catch (error){}
    } catch (error) {
        console.error('Error updating client:', error);
        status_popup("Please try <br> again later", false);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});
// ====================================================================================================================================
const addClientForm = document.getElementById('add-client-form');
addClientForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateEmployeeForm("add")) {
        return; // Stop form submission if validation fails
    }
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    
    let name = document.getElementById('name_client').value;
    let address = document.getElementById('address').value;
    let email = document.getElementById('email').value;
    let mobile = document.getElementById('mobile').value;
    let status = document.getElementById('status').value;
    let roles = document.getElementById('roles').value;
    let contactName = document.getElementById('contactName').value;
    let contactEmail = document.getElementById('contactEmail').value;
    let contactMobile = document.getElementById('contactMobile').value;

    // Send a POST request to create a client
    let response = await fetch(`${user_API}/post`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, contactEmail, mobile, contactName, contactMobile, status, roles, address })
    });
    
    try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=>e.click());
      } catch(error){console.log(error);}
    
    let c1 = (response.ok);
    try{
        if(c1){
            all_data_load_dashboard();
        }
        status_popup( ((c1) ? "Data Updated <br> Successfully" : "Please try <br> again later"), (c1) );
    } catch (error){
        status_popup("Please try <br> again later", false);
    }
    try{
        document.getElementById('name_client').value = '';
        document.getElementById('address').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mobile').value = '';
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMobile').value = '';
    } catch(error){console.log("error")}
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});
// ====================================================================================================================================
// ====================================================================================================================================
// ====================================================================================================================================
// ====================================================================================================================================
// ====================================================================================================================================

// Validation function for both forms
function validateEmployeeForm(formType) {
    clearErrors(); // Clear previous error messages
  
    const fieldsToValidate = formType === "add" ? {
        name: "name_client",
        email: "email",
        address: "address",
        mobile: "mobile",
        status: "status",
        roles: "roles",
    } : {
        name: "update-name",
        email: "update-email",
        address: "update-address",
        mobile: "update-mobile",
        status: "update-status",
    };
  
    let isValid = true;
  
    for (const [fieldName, fieldId] of Object.entries(fieldsToValidate)) {
        const field = document.getElementById(fieldId);
    
        if (!field.value.trim()) {
            showError(field, `${capitalize(fieldName)} is required`);
            isValid = false;
        } else if (fieldName === "email" || fieldName === "update-email") {
            if (!validateEmail(field.value)) {
            showError(field, `Enter a valid ${capitalize(fieldName)}`);
            isValid = false;
            }
        } else if (fieldName === "mobile" && (field.value.length < 10 || field.value.length > 13)) {
            showError(field, "Mobile number must be between 10 and 13 digits");
            isValid = false;
        } else if (fieldName === "name_client" || fieldName === "update-name") {
            if (/\d/.test(field.value)) {
            showError(field, "Name cannot contain numbers");
            isValid = false;
            }
        }
    }
  
    return isValid;
}
  
  // Helper function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}  
  // Helper function to capitalize field names for error messages
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// Function to show error messages inside the correct div next to labels
// --------------------------------------------------------------------------------------------------
function showError(element, message) {
    const errorContainer = element.previousElementSibling; // Access the div with label
    let errorElement = errorContainer.querySelector('.text-danger.text-size');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'text-danger text-size mohit_error_js_dynamic_validation';
        errorElement.style.fontSize = '10px';
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
        errorContainer.appendChild(errorElement);
    } else {
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
    }
}
// --------------------------------------------------------------------------------------------------
// Function to clear all error messages
// --------------------------------------------------------------------------------------------------
function clearErrors() {
    const errorMessages = document.querySelectorAll('.text-danger.text-size.mohit_error_js_dynamic_validation');
    errorMessages.forEach((msg) => msg.remove());
}


