if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { product_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;

import {} from "./globalFunctionsExport.js";
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================
// =================================================================================
// =================================================================================


// Load products only once on page load
async function all_data_load_dashboard() {
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  // -----------------------------------------------------------------------------------
  const productTable = document.getElementById("productData");

  if (!productTable) {
    console.error("Element with ID 'productData' not found.");
    return;
  }

  try {
    const r1 = await fetch(`${product_API}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Check if response is OK
    if (!r1.ok) throw new Error(`Error fetching data: ${r1.statusText}`);

    // Parse JSON response only once
    const p1 = await r1.json();
    const products = p1?.products || [];


    let tableContent = "";
    if(products.length>0){
      for(let i = 0; i<products.length; i++){
        tableContent += `
          <tr data-id="${products[i]?._id}">
            <td><input type="checkbox" class="checkbox_child" value="${products[i]?._id || '-'}"></td>
            <td>${capitalizeFirstLetter(products[i]?.productName) || "-"} (${products[i]?.productId || '-'})</td>
            <td>${capitalizeFirstLetter(products[i]?.category?.category) || "-"}</td>
            <td>${capitalizeFirstLetter(products[i]?.supplier) || "-"}</td>
            <td>${formatDate(products[i]?.purchaseDate) || "-"}</td>
            <td>₹ ${products[i]?.price || "-"}</td>
            <td>${products[i]?.quantity || "-"}</td>
            <td>${capitalizeFirstLetter(products[i]?.status) || "-"}</td>
            <td class="text-end">
              <div class="dropdown dropdown-action">
                <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="material-icons">more_vert</i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                  <a href="product-view.html?id=${products[i]?._id}" class="dropdown-item" ><i class="fa-regular fa-eye"></i> View</a>
                  <a href="edit-product.html?id=${products[i]?._id}" class="dropdown-item"><i class="fa-solid fa-pencil m-r-5"></i> Edit</a>
                  <a class="dropdown-item" onclick="individual_delete('${products[i]?._id}')"  data-bs-toggle="modal" data-bs-target="#delete_data"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                </div>
              </div>
            </td>
          </tr>`;
      }
      productTable.innerHTML = tableContent;
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
  checkbox_function();
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
}



// ==========================================================================================
// On page load, load employee data for the dashboard
window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);
