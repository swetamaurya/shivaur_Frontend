if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { user_API, expense_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
let cachedClient = [];
try {
  const response = await fetch(`${user_API}/data/get`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
  });
  const resp = await response.json();

  cachedClient = resp?.users.employees;
  
  // ---------------------------------------------------------------------------------------------------
  const purchaseBy_select_option = document.getElementById('purchaseBy_select_option');
  resp.users.employees.map(employee=>{
      const option = document.createElement("option");
      option.value = employee._id;
      option.text = `${employee?.name} (${employee?.userId})`;
      purchaseBy_select_option.appendChild(option);
  })
  // ---------------------------------------------------------------------------------------------------
  var edit_purchaseBy_select_option = document.getElementById('edit-purchaseBy_select_option');
  resp.users.employees.map(employee=>{
      const option = document.createElement("option");
      option.value = employee._id;
      option.text = `${employee?.name}`;
      edit_purchaseBy_select_option.appendChild(option);
  })
  // ---------------------------------------------------------------------------------------------------
  var edit_purchaseBy_select_option = document.getElementById('view-purchaseBy_select_option');
  resp.users.employees.map(employee=>{
      const option = document.createElement("option");
      option.value = employee._id;
      option.text = `${employee?.name}`;
      edit_purchaseBy_select_option.appendChild(option);
  })
  // ---------------------------------------------------------------------------------------------------
}
catch(error){
  console.log(error)
}
// ------------------------------------------------------------------------------------------
function rtnCltName(_id_pro) {
  const rtnClt = cachedClient.find(d=> d?._id==_id_pro);
  const rtnCltDetails = `${rtnClt?.name} (${rtnClt?.userId})`;
  return rtnCltDetails;
}
// ===========================================================================================
// ===========================================================================================
async function all_data_load_dashboard () {

  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // -----------------------------------------------------------------------------------
  var tableData = document.getElementById('expenseTbody');
  try{
      const response = await fetch(`${expense_API}/get`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      })
      const res = await response.json();
      var x = '';
      if(res.length>0){
          for (var i = 0; i < res.length; i++) {
              var e = res[i]
              x += `<tr data-id=${e?._id}>
                          <td class="width-thirty"><input type="checkbox" class="checkbox_child" value="${e?._id || '-'}"></td>
                          <td>${e?.expenseName}</td>
                          <td>${rtnCltName(e?.purchaseBy)}</td>
                          <td>${formatDate(e?.purchaseDate)}</td>
                          <td>₹ ${e?.amount}</td>
                          <td>${e?.paidBy}</td>
                          <td class="text-center">${e?.status}</td>
                          <td class="text-end">
                              <div class="dropdown dropdown-action">
                                  <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="material-icons">more_vert</i></a>
                                  <div class="dropdown-menu dropdown-menu-right">
                                      <a onclick="handleClickToGenerateViewExpense('${e?._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#view_data"><i class="fa-solid fa-eye m-r-5"></i>View</a>
                                      <a onclick="handleClickToGenerateEditExpense('${e?._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edit_data"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                                      <a class="dropdown-item" onclick="individual_delete('${e?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete </a>
                                  </div>
                              </div>
                          </td>
                      </tr>
                  `;
          }
      } else {
          x = `
              <tr>
                  <td  colspan="8" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
              </tr>`;
      }
      tableData.innerHTML = x;
      checkbox_function();    
  } catch(error){
      let x = `
          <tr>
              <td  colspan="8" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
          </tr>`;
      tableData.innerHTML = x;
      console.log(error);
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
  
}
all_data_load_dashboard();
objects_data_handler_function(all_data_load_dashboard);

// ===========================================================================================
// ===========================================================================================
// ===========================================================================================
// ===========================================================================================

const addExpenseForm = document.getElementById('add_expense_form');
addExpenseForm.addEventListener('submit', async (event) => {
  event.preventDefault();

    if (!validateAddExpenseForm()) {
        return; // Prevent form submission if validation fails
    }
    try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=>e.click());
    } catch(error){console.log(error)}
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    
    const item = document.getElementById('add-item-name').value;
    const expenseName = document.getElementById('add-expense-name').value;
    const purchaseDate = document.getElementById('add-purchase-date').value;
    const purchaseBy = document.getElementById('purchaseBy_select_option').value;
    const amount = document.getElementById('add-amount').value;
    const paidBy = document.getElementById('add-paid-by').value;
    const status = document.getElementById('add-status').value;
    const description = document.getElementById('description').value;

    try {
        const formData = new FormData();

        const files = document.getElementById('add-file').files;
        for (const file of files) {
            formData.append("file", file);
        }

        // Append form fields
        formData.append("item", item);
        formData.append("expenseName", expenseName);
        formData.append("purchaseDate", purchaseDate);
        formData.append("purchaseBy", purchaseBy);
        formData.append("amount", amount);
        formData.append("paidBy", paidBy);
        formData.append("status", status);
        formData.append("description", description);

        // Send form data to server
        const response = await fetch(`${expense_API}/post`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        // const resp = await response.json();

        const success = response.ok;
        status_popup(success ? "Data Update <br> Successfully!" : "Please try <br> again later", success);
        if (success){
            all_data_load_dashboard();
        }
    } catch (error) {
        status_popup("Please try <br> again later")
        console.error('Error submitting project:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})
// ============================================================================================
// ============================================================================================
// ============================================================================================

window.handleClickToGenerateViewExpense = async function handleClickToGenerateViewExpense(id) {
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // -----------------------------------------------------------------------------------
  
  const responseData = await fetch(`${expense_API}/get/${id}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  })
  let resp = await responseData.json();
  document.getElementById("_id_hidden").value = resp?._id;
  document.getElementById("view-item-name").value = resp?.item;
  document.getElementById("view-expense-name").value = resp?.expenseName;
  document.getElementById("view-purchase-date").value = resp?.purchaseDate;
  document.getElementById("view-purchaseBy_select_option").value = resp?.purchaseBy;
  document.getElementById("view-amount").value = resp?.amount;
  document.getElementById("view-paid-by").value = resp?.paidBy;
  document.getElementById("view-status").value = resp?.status;
  document.getElementById("view-description").value = resp?.description || '';

  let f1 = resp?.files;
  
  if(f1.length>0){
      document.getElementById("viewUploadFilesDiv").classList.remove("d-none");

      let tbody1 = document.getElementById("viewUplaodFilesTable");

      f1.map((e,i)=>{
          let z1 = document.createElement("tr");
          z1.innerHTML = `
                      <td>${i+1}</td>
                      <td><input type="text" class="form-control" name="" value="File ${i+1}" disabled id=""></td>
                      <td class="text-center"><a href="${e} target="_blank" class="btn btn-primary"><i class="fa-regular fa-eye"></i></a></td>
                    `;
          tbody1.appendChild(z1);
      })


  } else{
      document.getElementById("uploadFilesDiv").classList.add("d-none");
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
}

// ============================================================================================
window.handleClickToGenerateEditExpense = async function handleClickToGenerateEditExpense(id) {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    const responseData = await fetch(`${expense_API}/get/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    let resp = await responseData.json();

    document.getElementById("_id_hidden").value = resp?._id;
    document.getElementById("edit-item-name").value = resp?.item;
    document.getElementById("edit-expense-name").value = resp?.expenseName;
    document.getElementById("edit-purchase-date").value = resp?.purchaseDate;
    document.getElementById("edit-purchaseBy_select_option").value = resp?.purchaseBy;
    document.getElementById("edit-amount").value = resp?.amount;
    document.getElementById("edit-paid-by").value = resp?.paidBy;
    document.getElementById("edit-status").value = resp?.status;
    document.getElementById("edit-description").value = resp?.description || '';

    let f1 = resp?.files;
    
    if(f1.length>0){
        document.getElementById("uploadFilesDiv").classList.remove("d-none");

        let tbody1 = document.getElementById("uplaodFilesTable");

        f1.map((e,i)=>{
            let z1 = document.createElement("tr");
            z1.innerHTML = `
                        <td>${i+1}</td>
                        <td><input type="text" class="form-control" name="" value="File ${i+1}" disabled id=""></td>
                        <td class="text-center"><a href="${e} target="_blank" class="btn btn-primary"><i class="fa-regular fa-eye"></i></a></td>
                        `;
            tbody1.appendChild(z1);
        })
    } else{
        document.getElementById("uploadFilesDiv").classList.add("d-none");
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}

const editExpenseForm = document.getElementById('edit_expense_form');
editExpenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateEditExpenseForm()) {
        return; // Prevent form submission if validation fails
    }
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    try {
        const item = document.getElementById('edit-item-name').value;
        const expenseName = document.getElementById('edit-expense-name').value;
        const purchaseDate = document.getElementById('edit-purchase-date').value;
        const purchaseBy = document.getElementById('edit-purchaseBy_select_option').value;
        const amount = document.getElementById('edit-amount').value;
        const paidBy = document.getElementById('edit-paid-by').value;
        const status = document.getElementById('edit-status').value;
        const description = document.getElementById('edit-description').value;
        const _id = document.getElementById("_id_hidden").value;

        const formData = new FormData();

        const files = document.getElementById('edit-files').files;
        for (const file of files) {
            formData.append("file", file);
        }

        // Append form fields
        formData.append("item", item);
        formData.append("expenseName", expenseName);
        formData.append("purchaseDate", purchaseDate);
        formData.append("purchaseBy", purchaseBy);
        formData.append("amount", amount);
        formData.append("paidBy", paidBy);
        formData.append("status", status);
        formData.append("description", description);
        formData.append("_id", _id);

        
        const response = await fetch(`${expense_API}/update`, {
        method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const success = response.ok;
        status_popup(success ? "Data Updated <br> Successfully!" : "Please try <br> again later", success);
        if (success){
            all_data_load_dashboard();
        }             
    } catch (error) {
        status_popup( ("Please try <br> again later"), (false) );
        console.error('Error submitting project:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})


// =========================================================================================================

function validateAddExpenseForm() {
    clearErrors();

    let isValid = true;

    // Validate fields
    const expenseName = document.getElementById("add-expense-name");
    const itemName = document.getElementById("add-item-name");
    const purchaseDate = document.getElementById("add-purchase-date");
    const purchaseBy = document.getElementById("purchaseBy_select_option");
    const amount = document.getElementById("add-amount");
    const paidBy = document.getElementById("add-paid-by");
    const status = document.getElementById("add-status");
    const description = document.getElementById("description");

    if (!expenseName.value.trim()) {
        showError(expenseName, "Expense Name is required");
        isValid = false;
    }

    if (!itemName.value.trim()) {
        showError(itemName, "Item Name is required");
        isValid = false;
    }

    if (!purchaseDate.value.trim()) {
        showError(purchaseDate, "Purchase Date is required");
        isValid = false;
    }

    if (!purchaseBy.value.trim()) {
        showError(purchaseBy, "Please select an employee");
        isValid = false;
    }

    if (!amount.value.trim() || isNaN(amount.value) || parseFloat(amount.value) <= 0) {
        showError(amount, "Enter a valid amount");
        isValid = false;
    }

    if (!paidBy.value.trim()) {
        showError(paidBy, "Please select a payment mode");
        isValid = false;
    }

    if (!status.value.trim()) {
        showError(status, "Please select a status");
        isValid = false;
    }

    if (!description.value.trim()) {
        showError(description, "Description is required");
        isValid = false;
    }

    return isValid;
}
// =========================================================================================================

function validateEditExpenseForm() {
    clearErrors();

    let isValid = true;

    // Validate fields
    const expenseName = document.getElementById("edit-expense-name");
    const itemName = document.getElementById("edit-item-name");
    const purchaseDate = document.getElementById("edit-purchase-date");
    const purchaseBy = document.getElementById("edit-purchaseBy_select_option");
    const amount = document.getElementById("edit-amount");
    const paidBy = document.getElementById("edit-paid-by");
    const status = document.getElementById("edit-status");
    const description = document.getElementById("edit-description");

    if (!expenseName.value.trim()) {
        showError(expenseName, "Expense Name is required");
        isValid = false;
    }

    if (!itemName.value.trim()) {
        showError(itemName, "Item Name is required");
        isValid = false;
    }

    if (!purchaseDate.value.trim()) {
        showError(purchaseDate, "Purchase Date is required");
        isValid = false;
    }

    if (!purchaseBy.value.trim()) {
        showError(purchaseBy, "Please select an employee");
        isValid = false;
    }

    if (!amount.value.trim() || isNaN(amount.value) || parseFloat(amount.value) <= 0) {
        showError(amount, "Enter a valid amount");
        isValid = false;
    }

    if (!paidBy.value.trim()) {
        showError(paidBy, "Please select a payment mode");
        isValid = false;
    }

    if (!status.value.trim()) {
        showError(status, "Please select a status");
        isValid = false;
    }

    if (!description.value.trim()) {
        showError(description, "Description is required");
        isValid = false;
    }

    return isValid;
}
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

// =========================================================================================================
// =========================================================================================================
// =========================================================================================================