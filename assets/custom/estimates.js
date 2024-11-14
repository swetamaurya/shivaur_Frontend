if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate } from './globalFunctions2.js'
import { estimate_API, user_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================


let cachedClients = [];
try {
    const response = await fetch(`${user_API}/data/get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const res = await response.json();
    cachedClients = res?.users?.clients;
    
    console.log(cachedClients);
}
catch(error){
    console.error('Error fetching data:', error);
}
function rtnCltNm(nm){
  let data = cachedClients.find(d=> d._id == nm);
  let name = data?.name;
  let cltid = data?.userId;

  return `${name} (${cltid})`;
}
// =================================================================================



var res;
async function all_data_load_dashboard() {
  try{
    loading_shimmer();
  } catch(error){console.log(error)}
    
  var tableData = document.getElementById('tableData');
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
    <td>${rtnCltNm(e.client)}</td>
    <td>${formatDate(e.estimateDate)}</td>
    <td>${formatDate(e.expiryDate)}</td>
    <td>₹ ${Number(e.GrandTotal).toFixed(2)}</td>
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

all_data_load_dashboard();
objects_data_handler_function(all_data_load_dashboard);