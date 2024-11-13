if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { capitalizeFirstLetter } from './globalFunctions2.js'
import { product_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================

// Function to load categories and display them in the table
async function all_data_load_dashboard() {

  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // ----------------------------------------------------------------------------------------------------
  
  const categoriesTable = document.getElementById("categoriesData");
  try {
      const response = await fetch(`${product_API}/categories/get`, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
      });
  
      const result = await response.json();
          
      if (response.ok) {
          let res = result; // Store fetched categories in the global `res` array
          let tableContent = "";
          res.forEach((category, index) => {
          tableContent += `
              <tr data-id="${category?._id}">
                  <td><input type="checkbox" class="checkbox_child" value="${category?._id || '-'}"></td>
              <td>${index + 1}</td>
              <td>${category?.category || "-"}</td>
              <td class="text-end">
                  <div class="dropdown dropdown-action">
                  <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                      <i class="material-icons">more_vert</i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                      <a class="dropdown-item" onclick="editCategory('${category?._id}', '${category?.category || '-'}')" data-bs-toggle="modal" data-bs-target="#edit_data">
                      <i class="fa fa-pencil m-r-5"></i> Edit
                      </a>
                      <a class="dropdown-item" onclick="deleteButtonFun('${category?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                          <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                      </a>
                  </div>
                  </div>
              </td>
              </tr>`;
          });
  
          categoriesTable.innerHTML = tableContent;
          checkbox_function();
      }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
} 
// =======================================================================================
// =======================================================================================
// On page load, load employee data for the dashboard
window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);

//////////////////////////////////////// categories ///////////////////////////////////////////


// Add a new category
document.getElementById("addCategoryForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  
  if (!validateCategoryForm("categories")) {
    return; // Stop form submission if validation fails
  }
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // ----------------------------------------------------------------------------------------------------
  
  const category = document.getElementById("categories").value;
  try {
      const response = await fetch(`${product_API}/categories/post`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ category }),
      });
      try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=>e.click());
      } catch(error){console.log(error);}
  
      const result = await response.json();
      
      const c1 = (response.ok);
      try{
          if(c1){
              all_data_load_dashboard();
          }
          status_popup( ((c1) ? "Data Updated <br> Successfully" : "Please try<br> again later"), (c1) );
      } catch (error){
          status_popup("Please try <br> again later", false);
      }
  } catch (error) {
    status_popup("Please try <br> again later", false);
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
});


window.editCategory = function editCategory(a, b) {
  document.getElementById("_id_hidden").value = a;
  document.getElementById("edit-categories").value = b;
}

// Handle edit category form submission
document.getElementById("editCategories").addEventListener("submit", async function (event) {
  event.preventDefault();
  
  if (!validateCategoryForm("edit-categories")) {
    return; // Stop form submission if validation fails
  }
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // ----------------------------------------------------------------------------------------------------
  
  
  let _id = document.getElementById("_id_hidden").value;
  let category = document.getElementById("edit-categories").value;


  try {
    const response = await fetch(`${product_API}/categories/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, _id }), // Ensure _id is included
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
    } catch (error){
      status_popup("Please try <br> again later", false);
    }
  } catch (error) {
    status_popup("Please try <br> again later", false);
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
});

// ==========================================================
// ==========================================================
// ==========================================================
// ==========================================================
// ==========================================================

// Validation function for both forms
function validateCategoryForm(fieldId) {
  clearErrors(); // Clear previous error messages

  const categoryField = document.getElementById(fieldId);

  if (!categoryField.value.trim()) {
    showError(categoryField, "Category name is required");
    return false;
  }

  if (categoryField.value.trim().length < 3) {
    showError(categoryField, "Category name must be at least 3 characters");
    return false;
  }

  return true;
}

// --------------------------------------------------------------------------------------------------
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