if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { task_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;

import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================


async function all_data_load_dashboard(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    
    const tableData = document.getElementById('tableData');
    const response = await fetch(`${task_API}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    let user = (await response.json())?.tasks;
    let x = '';
    if(user.length>0){
    // if(false){
        for (let i = 0; i < user.length; i++) {
            let assignToName = [];

            let zz1 = user[i]?.assignedTo || 0;
            if(zz1?.length>0){
            (zz1).map((e)=>{
                let z1 = `${e?.name || '' }`;
                assignToName.push(z1);
            })
            }

            x += `<tr data-id="${user[i]?._id || '-'}">
            <td><input type="checkbox" class="checkbox_child" value="${user[i]?._id || '-'}"></td>
            <td>${user[i]?.title || '-'}</td>
            <td>${user[i]?.project?.projectName || '-'} (${user[i]?.project?.projectId || ''})</td>
            <td>${assignToName.join(", ") || '-'}</td>
            <td>${formatDate(user[i]?.startDate) || '-'}</td>
            <td>${user[i]?.status || '-'}</td>
            <td class="text-end">
                <div class="dropdown dropdown-action">
                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="material-icons">more_vert</i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="edit-tasks.html?id=${user[i]?._id}"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                    <a class="dropdown-item" href="task-view.html?id=${user[i]?._id}" ><i class="fa-solid fa-eye m-r-5"></i> View</a>
                    <a class="dropdown-item" onclick="individual_delete('${user[i]?._id}')" href="#" data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                </div>
                </div>
            </td>
            </tr>`;
        }
    } else {
        x = `
                <tr>
                    <td  colspan="9" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
                </tr>`;
    }
    tableData.innerHTML = x;  
    checkbox_function();
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
// =======================================================================================
// =======================================================================================