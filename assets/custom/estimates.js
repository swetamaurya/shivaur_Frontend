if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate } from './globalFunctions2.js'
// -------------------------------------------------------------------------
import {main_hidder_function} from './gloabl_hide.js';
import { estimate_API, user_API, global_search_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
import {rtnPaginationParameters, setTotalDataCount} from './globalFunctionPagination.js';

// =================================================================================
const token = localStorage.getItem('token');
// =========================================================================================
async function handleSearch() {
  const searchFields = ["estimatesId", "cltname"]; // IDs of input fields
  const searchType = "Estimate"; // Type to pass to the backend
  const tableData = document.getElementById("tableData");

  let tableContent = ""; // Initialize table content

  try {
    // Show loading shimmer
    loading_shimmer();

    // Construct query parameters for the search
    const queryParams = new URLSearchParams({ type: searchType });
    searchFields.forEach((field) => {
      const value = document.getElementById(field)?.value;
      if (value) queryParams.append(field, value);
    });

    // Fetch search results
    const response = await fetch(`${global_search_API}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();

    // Check if data exists in the response
    if (res.data && res.data.length > 0) {
      res.data.forEach((e, index) => {
        tableContent += `
          <tr data-id="${e._id}">
            <th class="width-thirty"><input type="checkbox" class="checkbox_child" value="${e._id || '-'}"></th>
            <td>${index + 1}</td>
            <td>${e.estimatesId}</td>
            <td>${e?.client?.name || "-"} ${e?.client?.userId || ''}</td>
            <td>${formatDate(e.estimateDate)}</td>
            <td>${formatDate(e.expiryDate)}</td>
            <td>₹ ${Number(e.GrandTotal).toFixed(2)}</td>
            <td class="text-end">
              <div class="dropdown dropdown-action">
                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown"
                  aria-expanded="false"><i class="material-icons">more_vert</i></a>
                <div class="dropdown-menu dropdown-menu-right">
                  <a class="dropdown-item hr_restriction " href="edit-estimate.html?id=${e._id}"><i class="fa-solid fa-pencil m-r-5"></i>
                    Edit</a>
                  <a class="dropdown-item" href="estimate-view.html?id=${e._id}"><i class="fa-solid fa-eye m-r-5"></i>
                    View</a>
                  <a class="dropdown-item hr_restriction " onclick="individual_delete('${e._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                    <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                  </a>
                </div>
              </div>
            </td>
          </tr>`;
      });
    } else {
      // No data found
      tableContent = `<tr><td colspan="8" class="text-center">No results found</td></tr>`;
    }
  } catch (error) {
    console.error("Error during search:", error);
    // Handle errors during the search
    tableContent = `<tr><td colspan="8" class="text-center">An error occurred during search</td></tr>`;
  } finally {
    // Update table content and remove shimmer
    tableData.innerHTML = tableContent;
    checkbox_function(); // Reinitialize checkboxes
    remove_loading_shimmer();
  }
  try{
      main_hidder_function();
  } catch (error){console.log(error)}
}

// =======================================================================================
// Event listener for search button
document.getElementById("searchButton").addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch(); // Trigger search
});
// =========================================================================================
// =========================================================================================
// =========================================================================================


async function all_data_load_dashboard() {
  try{
    loading_shimmer();
  } catch(error){console.log(error)}
    
  let tableData = document.getElementById('tableData');
  const response = await fetch(`${estimate_API}/get${rtnPaginationParameters()}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
  })
  let res = await response.json();
  let res2 = res?.data;
  // console.log("brorro := ",res2);
  setTotalDataCount(res?.totalEstimates);
  
  let x = '';
  for (let i = 0; i < res2.length; i++) {
    let e = res2[i];
    x += `<tr data-id="${e._id}">
    <th class="width-thirty"><input type="checkbox" class="checkbox_child" value="${e?._id || '-'}"></th>
    <td>${i + 1}</td>
    <td>${e.estimatesId}</td>
    <td>${e?.client?.name || "-"} (${e?.client?.userId || ''})</td>
    <td>${formatDate(e.estimateDate)}</td>
    <td>${formatDate(e.expiryDate)}</td>
    <td>₹ ${Number(e.GrandTotal).toFixed(2)}</td>
    <td class="text-end">
              <div class="dropdown dropdown-action">
                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown"
                  aria-expanded="false"><i class="material-icons">more_vert</i></a>
                <div class="dropdown-menu dropdown-menu-right">
                  <a class="dropdown-item  hr_restriction" href="edit-estimate.html?id=${e._id}"><i class="fa-solid fa-pencil m-r-5"></i>
                    Edit</a>
                  <a class="dropdown-item" href="estimate-view.html?id=${e._id}"><i class="fa-solid fa-eye m-r-5"></i>
                    View</a>

                  <a class="dropdown-item  hr_restriction " onclick="individual_delete('${e?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
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
  try{
      main_hidder_function();
  } catch (error){console.log(error)}
}

all_data_load_dashboard();
objects_data_handler_function(all_data_load_dashboard);