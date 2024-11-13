import { expense_API ,user_API } from './apis.js';
import { status_popup , loading_shimmer , remove_loading_shimmer } from './globalFunctions1.js';
import { checkbox_function } from './multi_checkbox.js';
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
const token = localStorage.getItem("token");
window.individual_delete = individual_delete;

try {
  const response = await fetch(`${user_API}/data/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const resp = await response.json();
  const purchaseBy_select_option = document.getElementById('purchaseBy_select_option');
  resp.users.employees.map(employee=>{
    const option = document.createElement("option");
    option.value = employee._id;
    option.text = `${employee?.name}`;
    purchaseBy_select_option.appendChild(option);
})
}
catch(error){
  console.log(error)
}

const addExpenseForm = document.getElementById('add_expense_form');
addExpenseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const addExpense = document.getElementById('add_expense')
  const item = document.getElementById('add-item-name').value;
  const expenseName = document.getElementById('add-expense-name').value;
  const purchaseDate = document.getElementById('add-purchase-date').value;
  const purchaseBy = document.getElementById('purchaseBy_select_option').value;
  const amount = document.getElementById('add-amount').value;
  const paidBy = document.getElementById('add-paid-by').value;
  const status = document.getElementById('add-status').value;
  const description = document.getElementById('description').value
  // const file = document.getElementById('add-file').value;

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

    console.log("Form Data:", formData);

    // Send form data to server
    const response = await fetch(`${expense_API}/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const resp = await response.json();
    console.log(resp)
    const success = response.ok;
        status_popup(success ? "Expenses Added <br> Successfully!" : "Please try again later", success);
        if (success) all_data_load_dashboard();
  } catch (error) {
    status_popup("Please try again later")
    console.error('Error submitting project:', error);
  }
  finally{
    remove_loading_shimmer();
  }
})

async function all_data_load_dashboard () {
  
    var tableData = document.getElementById('expenseTbody');
    const response = await fetch(`${expense_API}/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const res = await response.json();
    console.log(res);
    var x = '';
    for (var i = 0; i < res.length; i++) {
      var e = res[i]
      x += `<tr data-id=${e._id}>
              <th class="width-thirty"><input type="checkbox" class="checkbox_child" value="${e?._id || '-'}"></th>
              <td>${i + 1}</td>
  <td>
  <strong>${e.item}</strong>
  </td>
  <td>${e.expenseName}</td>
  <td>${e.purchaseDate}</td>
  <td>
  ${e.purchaseBy && e.purchaseBy.name ? e.purchaseBy.name : 'N/A'}
  </td>
  <td>${e.amount}</td>
  <td>${e.paidBy}</td>
  <td class="text-center">
  ${e.status}
  </td>
  <td class="text-end">
  <div class="dropdown dropdown-action">
  <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="material-icons">more_vert</i></a>
  <div class="dropdown-menu dropdown-menu-right">
  <a class="dropdown-item" href="expenses-view.html?id=${e._id}"><i class="fa-solid fa-eye m-r-5"></i>View</a>
  <a onclick="handleClickToGenerateEditExpense('${e._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edit_expense"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                                  <a class="dropdown-item" onclick="individual_delete('${e?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                              <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                          </a>
  </div>
  </div>
  </td>
  </tr>`
    }
    tableData.innerHTML = x;
    checkbox_function();
}
window.onload = all_data_load_dashboard
objects_data_handler_function(all_data_load_dashboard);

var item = document.getElementById('edit-item-name')
var expenseName = document.getElementById('edit-expense-name');
var purchaseDate = document.getElementById('edit-purchase-date');
// var purchaseBy = document.getElementById('edit-purchase-by');
var amount = document.getElementById('edit-amount');
var paidBy = document.getElementById('edit-paid-by');
var status11 = document.getElementById('edit-status');
var description = document.getElementById('edit-description');

try {
  const response = await fetch(`${user_API}/data/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const resp = await response.json();
  var edit_purchaseBy_select_option = document.getElementById('edit-purchaseBy_select_option');
  resp.users.employees.map(employee=>{
    const option = document.createElement("option");
    option.value = employee._id;
    option.text = `${employee?.name}`;
    edit_purchaseBy_select_option.appendChild(option);
})
}
catch(error){
  console.log(error)
}


let expensesEditId;
window.handleClickToGenerateEditExpense = async function handleClickToGenerateEditExpense(id) {
  const responseData = await fetch(`${expense_API}/get/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  let resp = await responseData.json();
  item.value = resp.item;
  expenseName.value = resp.expenseName;
  purchaseDate.value = resp.purchaseDate;
  edit_purchaseBy_select_option.value = resp.purchaseBy._id ? resp.purchaseBy._id : '';
  amount.value = resp.amount;
  paidBy.value = resp.paidBy;
  status11.value = resp.status;
  description.value = resp.description;
  expensesEditId = id;
}

const editExpenseForm = document.getElementById('edit_expense_form');
editExpenseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    loading_shimmer();
  const editExpense = document.getElementById('edit_expense');
  const item = document.getElementById('edit-item-name').value;
  const expenseName = document.getElementById('edit-expense-name').value;
  const purchaseDate = document.getElementById('edit-purchase-date').value;
  const purchaseBy = document.getElementById('edit-purchaseBy_select_option').value;
  const amount = document.getElementById('edit-amount').value;
  const paidBy = document.getElementById('edit-paid-by').value;
  const status = document.getElementById('edit-status').value;
  const description = document.getElementById('edit-description').value;
  const _id = expensesEditId;
  // const file = document.getElementById('add-file').value;

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

    console.log("Form Data:", formData);

    // Send form data to server
    const response = await fetch(`${expense_API}/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const resp = await response.json();
    console.log(resp)
    const success = response.ok;
        status_popup(success ? "Expenses Updated <br> Successfully!" : "Please try again later", success);
        if (success) all_data_load_dashboard();
  } catch (error) {
    status_popup( ("Please try again later"), (false) );
    alert(error);
    console.error('Error submitting project:', error);
  }
  finally {
    remove_loading_shimmer();
}
})

