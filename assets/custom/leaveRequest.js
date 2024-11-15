import {leave_API, leaveType_API} from './apis.js'
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// import { objects_data_handler_function} from './globalFunctionsDelete.js';
const token = localStorage.getItem('token');

async function leaveSelectOption() {
  try{
      const response = await fetch(`${leaveType_API}/get`,{
          method: 'GET',
          headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type':'application/json'
          }
      });
      let res = await response.json();
      let leaveType = document.getElementById('editleaveType');

      res.map(e2=>{
            let op = document.createElement("option");
            op.value = e2?._id;
            op.text = e2?.leaveName;

            leaveType.appendChild(op);
        });
    }catch(error){
      console.log(error);
    }
  }
  leaveSelectOption();

async function all_data_load_dashboard(){
    const leavestableData = document.getElementById('leavesData');
    var x='';
    try{
      // loading_shimmer();
  } catch(error){console.log(error)}
    try{
        const response = await fetch(`${leave_API}/get`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        let res = await response.json();
        let e = res.leaves
        for(let i=0; i<e.length; i++){
            x+=`
            <tr data-id="${e[i]._id}">
            <td><input type="checkbox" class="checkbox_child" value="${e[i]?._id || '-'}"></td>
                       
                          <td>${e[i].employee ? e[i].employee.name:'N/A' }</td>
                          <td>${e[i].leaveType ? e[i].leaveType.leaveName:'N/A'}</td>
                          <td>${e[i].from}</td>
                          <td>${e[i].to}</td> 
                          <td>${e[i].noOfDays}</td>
                          <td>${e[i].reason}</td>
                          <td>${e[i].leaveStatus}</td>
                          <td class="text-end">
                            <div class="dropdown dropdown-action">
  <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="material-icons">more_vert</i>
  </a>
  <div class="dropdown-menu dropdown-menu-right">
    <a onclick="handleClickToEditLeaves('${e[i]._id}')" class="dropdown-item" 
    data-bs-toggle="modal" data-bs-target="#edit_leave">
	  <i class="fa-solid fa-pencil m-r-5"></i> Edit </a>
<a class="dropdown-item" onclick="handleClickOnEditApproveLeaves('${e[i]._id}')" 
data-bs-toggle="modal" data-bs-target="#approve_leave">
  <i class="fa-regular fa-thumbs-up"></i> Approve </a>
    <a class="dropdown-item" onclick="individual_delete('${e[i]?._id}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                            <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                        </a>
  </div>
</div>
                          </td>
                        </tr>`
        }
        checkbox_function();
leavestableData.innerHTML = x;
}
catch(error){
    console.log(error)
}
try{
  remove_loading_shimmer();
} catch(error){console.log(error)}
}
window.onload = all_data_load_dashboard
objects_data_handler_function(all_data_load_dashboard)
let leaveId;

window.handleClickToEditLeaves = async function handleClickToEditLeaves(id) {
  leaveId = id;
  const leaveType = document.getElementById("editleaveType");
  const from = document.getElementById("editfromDate");
  const to = document.getElementById("editToDate");
  const noOfDays = document.getElementById("editNumberDays");
  const remark = document.getElementById("editReason");
  const reason = document.getElementById("editReason");
  
  const response = await fetch(`${leave_API}/get/${id}`,{
    method: 'GET',
    headers:{
      'Authorization': `Bearer ${token}`,
      'Content-Type':'application/json'
    }
  });
  let res = await response.json();

  leaveType.value = res.leaveType._id 
      from.value = res.from;
      to.value = res.to;
      noOfDays.value = res.noOfDays;
      remark.value = res.remark ? res.remark : "";
      reason.value = res.reason;
      return;
}

const edit_leave_form = document.getElementById('edit_leave_form');
edit_leave_form.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const _id = leaveId;
  const leaveType = document.getElementById("editleaveType").value;
  const from = document.getElementById("editfromDate").value;
  const to = document.getElementById("editToDate").value;
  const noOfDays = document.getElementById("editNumberDays").value;
  const remark = document.getElementById("editReason").value;
  const reason = document.getElementById("editReason").value;

  try {
    const response = await fetch(`${leave_API}/update`,{
      method: 'POST',
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({leaveType,from,to,noOfDays,remark,reason,_id})
    });
    let res = await response.json();
    console.log(res);
    const c1 = (response.ok==true);
      try{
          status_popup( ((c1) ? "Leaves Updated <br> Successfully" : "Please try again later"), (c1) );
          setTimeout(function(){
              // window.location.href = 'estimates.html'; 
          },(Number(document.getElementById("b1b1").innerText)*1000));
      } catch (error){
        status_popup( ("Please try again later"), (false) );
      }
  } catch (error) {
    status_popup( ("Please try again later"), (false) );
    console.log(error);
  }
})
let approveLeaveId;
window.handleClickOnEditApproveLeaves = function handleClickOnEditApproveLeaves(id){
  approveLeaveId = id
  console.log(approveLeaveId)
}

const statusButtons = document.querySelectorAll(".status-btn");
statusButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();

    const leaveStatus = event.target.getAttribute("data-status"); // Get Approved/Declined from clicked button

    if (
      !leaveStatus ||
      (leaveStatus !== "Approved" && leaveStatus !== "Declined")
    ) {
      console.log("Invalid leave status.");
      return;
    }

    try {
      // Send POST request to update leave status
      const response = await fetch(`${leave_API}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: approveLeaveId, leaveStatus }),
      });

      const resp = await response.json();
      console.log(resp);
        const row = document.querySelector(`tr[data-id="${approveLeaveId}"]`);
        if (row) {
          row.querySelector("td:nth-child(9)").textContent = leaveStatus; // Update the leaveStatus in the table
        }
        const c1 = (response.ok==true);
      try{
          status_popup( ((c1) ? `Leave ${leaveStatus} <br> Successfully` : "Please try again later"), (c1) );
          setTimeout(function(){
              // window.location.href = 'estimates.html'; 
          },(Number(document.getElementById("b1b1").innerText)*1000));
      } catch (error){
        status_popup( ("Please try again later"), (false) );
      }

    } catch (error) {
      console.error("Error approving leave:", error);
    }
  });
});
