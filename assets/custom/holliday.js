if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}

import { checkbox_function } from './multi_checkbox.js'; // Import checkbox functionality
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { holiday_API } from './apis.js';
import {  formatDate,  capitalizeFirstLetter } from './globalFunctions2.js'

/////////////////////////////////////////////////////////////////////
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
const token = localStorage.getItem('token');

let res = []; // Renaming `res` to `holidayData` for clarity

// Load Holiday List
async function all_data_load_dashboard() {
 
    loading_shimmer();

  const table = document.getElementById('holidayData');
  table.innerHTML = ''; // Clear table content
  let rows = '';

  try {
      const response = await fetch(`${holiday_API}/get`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

       res = await response.json(); // Assign the fetched data to `holidayData`
      // console.log("Holiday Data:", holidayData);

      // Generate table rows
      res.forEach((holiday) => {
          rows += `
              <tr data-id="${holiday._id}">
                  <td><input type="checkbox" class="checkbox_child" value="${holiday._id || '-'}"></td>
                  <td>${capitalizeFirstLetter(holiday.holidayName)}</td>
                  <td>${ formatDate(holiday.holidayDate)}</td>
                  <td>${capitalizeFirstLetter(holiday.offDays)}</td>
                  <td>
                      <div class="dropdown dropdown-action">
                          <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="material-icons">more_vert</i></a>
                          <div class="dropdown-menu dropdown-menu-right">
                              <a class="dropdown-item" onclick="handleClickOnEditHoliday('${holiday._id}')" data-bs-toggle="modal" data-bs-target="#edit_holiday">
                                  <i class="fa-solid fa-pencil m-r-5"></i> Edit
                              </a>
                              <a class="dropdown-item" onclick="individual_delete('${holiday._id}')" data-bs-toggle="modal" data-bs-target="#delete_holiday">
                                  <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                              </a>
                          </div>
                      </div>
                  </td>
              </tr>`;
      });

      table.innerHTML = rows;
      checkbox_function(); // Apply checkbox functionality after loading the list
   
  } catch (error) {
      console.error("Error loading terminations:", error);
  } finally {
      remove_loading_shimmer();
  }
}

window.onload = all_data_load_dashboard;

// Add New Holiday
document.getElementById('add_holiday').addEventListener('submit', async function (event) {
  event.preventDefault();

  try {
    Array.from(document.querySelectorAll(".btn-close")).forEach(e => e.click());
    loading_shimmer();

      const holidayName = document.getElementById('holidayName').value;
      const holidayDate = document.getElementById('holidayDate').value;
      const offDays = document.getElementById('offDays').value;

 
      const response = await fetch(`${holiday_API}/post`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ holidayName, holidayDate, offDays })
      });

      const success = response.ok;
      status_popup(success ? "Holiday Added Successfully!" : "Failed to add holiday", success);
      if (success) all_data_load_dashboard();

  } catch (error) {
      console.error('Error adding holiday:', error);
      status_popup("Please try again later", false);
  } finally {
      remove_loading_shimmer();
  }
});

// Show holiday data in edit modal
window.handleClickOnEditHoliday = async function (_id) {
  const holiday = holidayData.find(h => h._id === _id);
  if (holiday) {
      document.getElementById('editHolidayName').value = holiday.holidayName;
      document.getElementById('editHolidayDate').value = holiday.holidayDate;
      document.getElementById('editHolidayDay').value = holiday.offDays;

      const editForm = document.getElementById('edit_holiday');
      if (editForm) {
          editForm.onsubmit = async function(event) {
              event.preventDefault();
              try {
                  loading_shimmer();

                  const holidayName = document.getElementById('editHolidayName').value;
                  const holidayDate = document.getElementById('editHolidayDate').value;
                  const offDays = document.getElementById('editHolidayDay').value;

                  const response = await fetch(`${holiday_API}/update`, {
                      method: 'POST',
                      headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ holidayName, holidayDate, offDays, _id })
                  });

                  const success = response.ok;
                  status_popup(success ? "Holiday Updated Successfully!" : "Failed to update holiday", success);
                  if (success) {
                      await all_data_load_dashboard(); // Reload holiday list
                  }
              } catch (error) {
                  console.error("Error updating holiday:", error);
                  status_popup("Failed to update holiday", false);
              } finally {
                  remove_loading_shimmer();
              }
          };
      } else {
          console.error("Edit holiday form element not found");
      }
  }
};

 

window.onload = all_data_load_dashboard;
objects_data_handler_function(all_data_load_dashboard);

 