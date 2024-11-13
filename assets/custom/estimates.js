import {estimate_API} from './apis.js';
import {  loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import {checkbox_function} from './multi_checkbox.js'
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
const token = localStorage.getItem("token");
    // get API for Estimate start

    var res;
    async function all_data_load_dashboard() {
      try{
        // loading_shimmer();
    } catch(error){console.log(error)}
        var tableData = document.getElementById('tableData');
        const status = 'pending';
        const response = await fetch(`${estimate_API}/get`, {
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
            <td>${i + 1}</td>
            <td>${e.estimatesId}</td>
            <td>${e.client && e.client.name ? e.client.name : "N/A"}</td>
            <td>${e.estimateDate}</td>
            <td>${e.expiryDate}</td>
            <td>${e.GrandTotal}</td>
            <td>${status}</td>
            <td class="text-end">
                      <div class="dropdown dropdown-action">
                        <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown"
                          aria-expanded="false"><i class="material-icons">more_vert</i></a>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="edit-estimate.html?id=${e._id}"><i class="fa-solid fa-pencil m-r-5"></i>
                            Edit</a>
                          <a class="dropdown-item" href="estimate-view.html?id=${e._id}"><i class="fa-solid fa-eye m-r-5"></i>
                            View</a>
  
                          <a class="dropdown-item" onclick="individual_delete('${e?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                            <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                        </a>
                        </div>
                      </div>
                    </td>
            </td></tr>`
        }
        tableData.innerHTML = x;
        checkbox_function();
        try{
          remove_loading_shimmer();
      } catch(error){console.log(error)}
    }

    window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);
    // get API for Estimate end
    // let estimateDeleteId;
  //  window.handleClickOnDeleteEstimate = function handleClickOnDeleteEstimate(id){
  //     estimateDeleteId = id;
  //   }

  //   async function handleClickToDeleteEstimateData() {
  //       var _id = estimateDeleteId;
  //       try {
  //           // const token = localStorage.getItem('authToken');
  //           const url = 'http://localhost:3000/estimates/delete';
  //           const response = await fetch(url, {
  //               method: 'POST',
  //               headers: {
  //                   'Content-Type': 'application/json',
  //                   'Authorization': ` Bearer ${token}`
  //               },
  //               body: JSON.stringify({ _id })
  //           })
  //           const resp = await response.json();
  //           console.log(resp);
  //           const row = document.querySelector(`tr[data-id="${_id}"]`);
  //           row.remove();
  //       } catch (error) {
  //           alert(error)
  //           console.log(error);
  //       }
  //   }