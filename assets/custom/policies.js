const token = localStorage.getItem("token");
import {policy_API} from './apis.js';
import {  loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import {checkbox_function} from './multi_checkbox.js'
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
    // get API for Estimate start

    var res;
    async function all_data_load_dashboard () {
      try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    
        let policyTableData = document.getElementById('policyTableData');
        const response = await fetch(`${policy_API}/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        res = await response.json();
        console.log(res);
        var x = '';
        for (var i = 0; i < res.length; i++) {
            var e = res[i]
            x += `<tr data-id="${e._id}">
            <th class="width-thirty"><input type="checkbox" class="checkbox_child" value="${e?._id || '-'}"></th>
                    <td>${i+1}</td>
                    <td>${e.policyName}</td>
                    <td>${e.department?.departments}</td>
                    <td>${e.date}</td>
                    <td class="text-end">
                      <div class="dropdown dropdown-action">
                        <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown"
                          aria-expanded="false"><i class="material-icons">more_vert</i></a>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="policy-view.html?id=${e._id}">
                          <i class="fa-solid fa-eye m-r-5"></i> View</a>
                          <a class="dropdown-item" href="edit-policy.html?id=${e._id}">
                          <i class="fa-solid fa-pencil m-r-5"></i>
                            Edit</a>
                              <a class="dropdown-item" onclick="individual_delete('${e?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                            <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                        </a>
                        </div>
                      </div>
                    </td>
                  </tr>`
        }
        policyTableData.innerHTML = x;
        checkbox_function();
        
    // ----------------------------------------------------------------------------------------------------
    try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
    }
    

    

// On page load, load employee data for the dashboard
window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);

