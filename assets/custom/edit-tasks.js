if(!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}

import {status_popup, loading_shimmer, remove_loading_shimmer} from './globalFunctions1.js';
import {task_API, user_API, project_API} from './apis.js';

const token = localStorage.getItem('token');
// =======================================================
// =======================================================
// =======================================================

async function dropdownForAddTask(){
  // =========================================================
  const r1 = await fetch(`${project_API}/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });
  const r2 = await r1.json();
  const project_select_option = document.getElementById("project_select_option");
  r2?.data.map((e) => {
    let a1 = document.createElement("option");
    a1.value = e?._id || '-';
    a1.text = `${e?.projectName} (${e?.projectId})` || '-' ;
    project_select_option.appendChild(a1);
  });
  // =========================================================
  // =========================================================
  const r3 = await fetch(`${user_API}/data/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });
  const r4 = (await r3.json());

  const dropdownContent_my_shivaur_mohit = document.getElementById("dropdownContent_my_shivaur_mohit");
  console.log("brororor ;_------------ ",r4?.users?.employee)

  let e = r4?.users?.employee;
  // r4?.users?.employee.map((e) => {
    let d1 = document.createElement("div");
    d1.innerHTML = `
                    <input type="checkbox" value="${e?._id}" class="assignee-checkbox_my_shivaur_mohit">
                    <label class="checkbox-label_my_shivaur_mohit">${e?.name} (${e?.userId})</label>`;
    d1.classList.add("checkbox-container_my_shivaur_mohit");
    dropdownContent_my_shivaur_mohit.appendChild(d1);    
  // });
}
// ==================================================================================================================

async function editTaskDataUpdate() {
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // -----------------------------------------------------------------------------------
  await dropdownForAddTask();
  // =========================================================================
  try{
    let _id_param = new URLSearchParams(window.location.search).get("id");  
    const r1 = await fetch(`${task_API}/get/${_id_param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if(!r1.ok){
      throw new Error();
    }
    
    const r2 = await r1.json();
    console.log(r2)

    let a1 = document.getElementById("startDate");
    let a2 = document.getElementById("status");
    let a3 = document.getElementById("task-title");
    let a4 = document.getElementById("description");
    let a5 = document.getElementById("_id_hidden");
    let a7 = document.getElementById("project_select_option");
    
    a1.value = r2?.startDate || '-';
    a2[0].innerText = r2?.status || '-';
    console.log("brohter ;---- ", r2?.status)
    a3.value = r2?.title || '-';
    a4.value = r2?.taskDescription || '-';
    a5.value = r2?._id || '-';
    a7.value = r2?.project?._id || '-';
    
    let a6 = document.getElementById("assigned_by_select_option");
    let op1 = document.createElement("option");
    op1.text = r2?.assignedBy?.name;
    op1.value = r2?.assignedBy?._id;
    a6.appendChild(op1);

    let a8 = document.getElementById("selectedAssignees_my_shivaur_mohit");
    let assTo = r2?.assignedTo;
    assTo.map((e)=>{
      Array.from(document.querySelectorAll(".assignee-checkbox_my_shivaur_mohit")).map((e2) => {
        if(e2.value==e?._id){
          e2.checked = true;
        }
      });

      let sp1 = document.createElement("span");
      sp1.innerText = e?.name;
      sp1.setAttribute("value", e?._id);
      sp1.classList.add("tag_my_shivaur_mohit");
      a8.appendChild(sp1);
    });

    
    let f1 = r2?.files;
    
    let a10 = document.getElementById("uploaded_files_tbodyone");
    if(f1.length>0){
      document.getElementById("file_main_div").classList.remove("d-none");
      f1.map((ee,i)=>{
        let tr1 = document.createElement("tr");
        tr1.innerHTML = `<td>${i+1}</td>
                          <td>
                              <input class="form-control" type="name" value="File ${i+1}" disabled id="paymentDate">
                          </td>
                          <td class="text-center">
                                      
                            <div class="dropdown dropdown-action">
                                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
                                class="material-icons">more_vert</i></a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a  href="${ee}" target="_blank" class="dropdown-item" ><i class="fa-regular fa-eye"></i> View</a>
                                </div>
                            </div>
                          </td>`;
        a10.appendChild(tr1);                        
      }) 
    };
    assignee_drop_down_checkbox();
  } catch(error){
    // window.location.href = 'tasks.html';
    console.log(error)
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
}
editTaskDataUpdate();

// =====================================================================================
// =====================================================================================
// =====================================================================================

// Task Post API 
const update_task_form = document.getElementById('update_task_form');
update_task_form.addEventListener('submit',async(event)=>{
  event.preventDefault();
  
  if (!validateTaskForm()) {
    return; // Stop form submission if validation fails
  }
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // -----------------------------------------------------------------------------------

  let startDate = document.getElementById('startDate').value;
  let status = document.getElementById('status').value;
  let assignedBy = document.getElementById('assigned_by_select_option').value;
  let title = document.getElementById('task-title').value;
  let project = document.getElementById('project_select_option').value;
  let taskDescription = document.getElementById('description').value;
  let _id_hidden = document.getElementById("_id_hidden").value;

  let formData = new FormData();

  Array.from(document.getElementById("selectedAssignees_my_shivaur_mohit").children).forEach((e)=>{
    formData.append("assignedTo",e.getAttribute('value'));
  });
  
  let files = document.getElementById('file').files;
  for (const file of files) {
    formData.append("file", file);
  }

  formData.append("_id",_id_hidden);
  formData.append("startDate", startDate);
  formData.append("status", status);
  formData.append("assignedBy", assignedBy);
  formData.append("title", title);
  formData.append("project", project);
  formData.append("taskDescription", taskDescription);

  try {
    const response = await fetch(`${task_API}/update`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const c1 = (response.ok);
    try{
      status_popup( ((c1) ? "Data Updated <br> Successfully" : "Please try <br> again later"), (c1) );
      setTimeout(function(){
        window.location.href = 'tasks.html'; 
      },(Number(document.getElementById("b1b1").innerText)*1000));
    } catch (error){
      status_popup("Please try <br> again later", false);
    }
  } catch (error) {
    console.log(error)
    status_popup("Please try <br> again later", false);
  }
  // ----------------------------------------------------------------------------------------------------
  try{
    remove_loading_shimmer();
} catch(error){console.log(error)}
});

// ==========================================================================================
// ==========================================================================================

function assignee_drop_down_checkbox(){
    
  const dropdownContent_my_shivaur_mohit = document.getElementById("dropdownContent_my_shivaur_mohit");
  const selectedAssignees_my_shivaur_mohit = document.getElementById("selectedAssignees_my_shivaur_mohit");
  const checkboxes_my_shivaur_mohit = document.querySelectorAll(".assignee-checkbox_my_shivaur_mohit");

  // Function to toggle dropdown visibility
  window.toggleDropdown_my_shivaur_mohit = function toggleDropdown_my_shivaur_mohit() {
    dropdownContent_my_shivaur_mohit.classList.toggle("show_my_shivaur_mohit");
  }

  // Close dropdown if clicked outside
  window.addEventListener("click", function (event) {
    if (!event.target.matches('.dropdown-btn_my_shivaur_mohit')) {
      dropdownContent_my_shivaur_mohit.classList.remove("show_my_shivaur_mohit");
    }
  });

  // Function to update selected assignees display
  function updateSelectedAssignees_my_shivaur_mohit() {
    // Clear the display area
    selectedAssignees_my_shivaur_mohit.innerHTML = "";

    // Loop through each checkbox and add selected ones to display
    checkboxes_my_shivaur_mohit.forEach((checkbox) => {
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling.textContent; // Get the label text
        const tag = document.createElement("span");
        tag.classList.add("tag_my_shivaur_mohit");
        tag.textContent = label; // Display the label text
        tag.setAttribute("value", checkbox.value);
        selectedAssignees_my_shivaur_mohit.appendChild(tag);
      }
    });
  }

  // Attach event listeners to all checkboxes for selection
  checkboxes_my_shivaur_mohit.forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectedAssignees_my_shivaur_mohit);
  });
}

// ===============================================================================================
// ===============================================================================================
// ===============================================================================================
// ===============================================================================================
// ===============================================================================================

// Validation function
function validateTaskForm() {
  clearErrors(); // Clear previous error messages

  let isValid = true;

  // Get field elements
  const taskTitle = document.getElementById("task-title");
  const project = document.getElementById("project_select_option");
  const assignees = document.getElementById("dropdownContent_my_shivaur_mohit");
  const assignedBy = document.getElementById("assigned_by_select_option");
  const status = document.getElementById("status");
  const description = document.getElementById("description");

  // Task Title Validation
  if (!taskTitle.value.trim()) {
    showError(taskTitle, "Please enter a valid task title");
    isValid = false;
  }

  // Project Validation
  if (!project.value.trim()) {
    showError(project, "Please select a project");
    isValid = false;
  }

  // Assignee Validation
  if (!isAnyAssigneeSelected()) {
    showError(document.getElementById("just_for_form_validation"), "Please select at least one assignee");
    isValid = false;
  }

  // Assigned By Validation
  if (!assignedBy.value.trim()) {
    showError(assignedBy, "Please select the person who assigned the task");
    isValid = false;
  }

  // Status Validation
  if (!status.value.trim()) {
    showError(status, "Please select a status");
    isValid = false;
  }

  // Description Validation
  if (!description.value.trim()) {
    showError(description, "Please provide a description");
    isValid = false;
  }

  return isValid;
}

// Function to check if any assignee is selected
function isAnyAssigneeSelected() {
  const checkboxes = document.querySelectorAll(
    "#dropdownContent_my_shivaur_mohit input[type='checkbox']"
  );
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
}

// Function to get selected assignees
function getSelectedAssignees() {
  const checkboxes = document.querySelectorAll(
    "#dropdownContent_my_shivaur_mohit input[type='checkbox']"
  );
  return Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
    .join(", ");
}

// Automatically set start date to tomorrow
document.addEventListener("DOMContentLoaded", function () {
  const startDateField = document.getElementById("startDate");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  startDateField.value = tomorrow.toISOString().split("T")[0];
  startDateField.setAttribute("min", startDateField.value);
});

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
function clearErrors() {
  const errorMessages = document.querySelectorAll('.text-danger.text-size.mohit_error_js_dynamic_validation');
  errorMessages.forEach((msg) => msg.remove());
}
