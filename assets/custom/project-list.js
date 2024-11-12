if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { project_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================

// employee dashboard data - table - load
async function all_data_load_dashboard(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    

    const tableData = document.getElementById("projectData");
    tableData.innerHTML = ''; // Clear table data
    var x = "";

    try{
        const r = await fetch((`${project_API}/get`), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    
        let res = await r.json();
        let user = res?.projects
        
        if(user.length > 0){
            for (var i = 0; i < user.length; i++) {
                let e = user[i];
        
                // console.log(user[i].clientName)
                x += `<tr data-id="${e._id}">
                        <td><input type="checkbox" class="checkbox_child" value="${e._id}" /></td>
                        <td>${capitalizeFirstLetter(e?.projectName) || '-'}</td>
                        <td>${e?.projectId}</td>
                        <td>${(user[i]?.clientName?.name) == undefined ? " -" : (capitalizeFirstLetter(user[i]?.clientName?.name))} (${(user[i]?.clientName?.userId) == undefined ? "-" : ((user[i]?.clientName?.userId))})</td>
                        <td>${(user[i]?.assignedTo?.name) == undefined ? " -" : (capitalizeFirstLetter(user[i]?.assignedTo?.name))} (${(user[i]?.assignedTo?.userId) == undefined ? "-" : (user[i]?.assignedTo?.userId)})</td>
                        <td>${formatDate(e?.deadline) || '-'}</td>
                        <td>${capitalizeFirstLetter(e?.status) || '-'}</td>
                        <td class="text-end">
                            <div class="dropdown dropdown-action">
                                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="material-icons">more_vert</i></a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a  href="project-view.html?id=${e?._id}" class="dropdown-item" ><i class="fa-regular fa-eye"></i> View</a>
                                    <a  href="edit-project.html?id=${e?._id}" class="dropdown-item" ><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                                    <a class="dropdown-item" onclick="individual_delete('${e?._id}')" href="#" data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                                </div>
                            </div>
                        </td>
                    </tr>`;
            }
            tableData.innerHTML = x;
        } else {
            x = `
                <tr>
                    <td  colspan="8" class='text-center'><i class="fa-solid fa-times"></i> Data not present</td>
                </tr>`;

            tableData.innerHTML = x;
        }
    } catch(error){
        x = `
            <tr>
                <td  colspan="8" class='text-center'><i class="fa-solid fa-times"></i> Data not present</td>
            </tr>`;

        tableData.innerHTML = x;

        console.error('Error loading employee data:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        checkbox_function();
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}

// On page load, load employee data for the dashboard
window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);
