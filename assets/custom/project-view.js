if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}
// =================================================================================
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { project_API } from './apis.js';
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================


window.onload = async () => {
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  try{
    let _id_param = new URLSearchParams(window.location.search).get("id");
    const response = await fetch(`${project_API}/get/${_id_param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let responseData = await response.json();
  
    console.log(responseData)
    
    const description = document.getElementById("description");  
    const tableData = document.getElementById("tbodyone");
    const tableData2 = document.getElementById("tbodytwo");
    const tableData3 = document.getElementById("tbodythree");
    const tableInstallmentData = document.getElementById("tbodyInstallment");
    const projectName = document.getElementById("project-name");
  
  
    document.getElementById("task_page").href= `project-add-task.html?id=${responseData._id}`;
  
    // ==================================================================================
    
    let rd_tasks = responseData.tasks;
    if(rd_tasks.length!=0){
      document.getElementById("file_main_div2").classList.remove("d-none");
      let task_details = document.getElementById("task_details");
      task_details.classList.remove("d-none");
  
      let task_details_tbodyone = document.getElementById("task_details_tbodyone");
      rd_tasks.map((ee,i)=>{
        let rowNew = document.createElement("tr");
        rowNew.innerHTML = `
                            <td>${i+1}</td>
                            <td>
                                <a href="task-view.html?id=${ee?._id}">${ee?.title}</a>
                            </td>
                            <td>
                                <span>${formatDate(ee?.startDate)}</span>
                            </td>
                            <td class="text-center">
                              <a href="task-view.html?id=${ee?._id}" class="btn btn-primary"><i class="fa-solid fa-eye"></i></a>
                            </td>`;
        task_details_tbodyone.appendChild(rowNew);
      })
  
    }else {
      document.getElementById("file_main_div2").classList.add("d-none");
      document.getElementById("task_details").classList.add("d-none");
    }
    
  
    
  
    // ==================================================================================
    let rd_doc = responseData.document;
    if(rd_doc.length!=0){
      document.getElementById("file_main_div").classList.remove("d-none");
      let uploaded_files = document.getElementById("uploaded_files");
      uploaded_files.classList.remove("d-none");
  
      let uploaded_files_tbodyone = document.getElementById("uploaded_files_tbodyone");
      rd_doc.map((ee,i)=>{
        let rowNew = document.createElement("tr");
        rowNew.innerHTML = `
                            <td>${i+1}</td>
                            <td>
                                <input class="form-control" type="name" value="File ${i+1}" disabled id="paymentDate">
                            </td>
                            <td class="text-center">
                                        
                                      <a  href="${ee}" target="_blank" class="btn btn-primary" ><i class="fa-regular fa-eye"></i></a>
                              <div class="dropdown dropdown-action d-none">
                                  <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
                                  class="material-icons">more_vert</i></a>
                                  <div class="dropdown-menu dropdown-menu-right">
                                      <a  href="${ee}" target="_blank" class="dropdown-item" ><i class="fa-regular fa-eye"></i> View</a>
                                      <a class="dropdown-item" onClick="uploadedFileDelete('${responseData._id}','${ee}')"  href="#" data-bs-toggle="modal" data-bs-target="#delete_project"><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                                  </div>
                              </div>
                            </td>`;
        uploaded_files_tbodyone.appendChild(rowNew);
      })
  
    }else {
      document.getElementById("file_main_div").classList.add("d-none");
      document.getElementById("uploaded_files").classList.add("d-none");
    }
  
    tableData.innerHTML = `
                              <tr>
                                  <td>Start Date : </td>
                                  <td class="text-end">${formatDate(responseData?.startDate)}</td>
                              </tr>
                              <tr>
                                  <td>Deadline : </td>
                                  <td class="text-end">${formatDate(responseData?.deadline)}</td>
                              </tr>
                              <tr>
                                  <td>Status : </td>
                                  <td class="text-end">${responseData?.status}</td>
                              </tr>
                              <tr>
                                  <td>Priority : </td>
                                  <td class="text-end">${responseData?.priority}</td>
                              </tr>
                              <tr>
                                  <td>Price : </td>
                                  <td class="text-end">₹${responseData?.price}</td>
                              </tr>
                              <tr>
                                  <td>Discount Rupee : </td>
                                  <td class="text-end"> ${responseData?.discountPercentage}% ( ₹${responseData?.discountRupee} ) </td>
                              </tr>
                              <tr>
                                  <td>Tax : </td>
                                  <td class="text-end">${responseData?.tax}% ( ₹${responseData?.tax_rs} )</td>
                              </tr>
                              <tr>
                                  <td>Tax Type : </td>
                                  <td class="text-end">${responseData?.taxType}</td>
                              </tr>
                              <tr>
                                  <td>Total Price : </td>
                                  <td class="text-end">₹${responseData?.totalPrice}</td>
                              </tr>`;
                      
    // ============================================================================================================
    let clt = responseData?.clientName;
    // clientProfile.html?id=672c7678a4ebee59f2bc6fad
    tableData2.innerHTML = `
                              <tr>
                                  <td>Name : </td>
                                  <td class="text-end"><a href='clientProfile.html?id=${clt?._id}'>${clt?.name}</a></td>
                              </tr>
                              <tr>
                                  <td>Id : </td>
                                  <td class="text-end"><a href='clientProfile.html?id=${clt?._id}'>${clt?.userId}</a></td>
                              </tr>
                              <tr>
                                  <td>Email : </td>
                                  <td class="text-end"><a href='clientProfile.html?id=${clt?._id}'>${clt?.email}</a></td>
                              </tr>`;
                      
    // ============================================================================================================
    let assTo = responseData?.assignedTo;
    // clientProfile.html?id=672c7678a4ebee59f2bc6fad
    tableData3.innerHTML = `
                              <tr>
                                  <td>Name : </td>
                                  <td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.name}</a></td>
                              </tr>
                              <tr>
                                  <td>Id : </td>
                                  <td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.userId}</a></td>
                              </tr>
                              <tr>
                                  <td>Email : </td>
                                  <td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.email}</a></td>
                              </tr>`;
    // ============================================================================================================
    // ============================================================================================================
    // for(let k=0; k<assignProject.length; i++){
    let installment=''
    responseData.installmentDetails.map((e,i)=>{
      installment+= `<tr><td>${i+1}</td>
                        <td >${formatDate(e.paymentDate)}</td>
                        <td >₹${e.paymentAmount}</td>
                        <td>${e.paymentStatus}</td>
                        <td>${formatDate(e.paidDate)}</td>
                      </tr>`
    })
    tableInstallmentData.innerHTML = installment
    // assignedProjectList.innerHTML = z;
    description.innerText = responseData.description;
    projectName.innerText = `${responseData.projectName} ( ${responseData?.projectId} )`;
  } catch(error){
    window.location.href = 'project-list.html';
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
};



document.getElementById("edit_project_btn").addEventListener("click", function(){
  let _id_param = new URLSearchParams(window.location.search).get("id");
    // viewProjectDetails(_id_param);
    window.location.href = `/front-end/edit-project.html?id=${_id_param}`;
})


window.uploadedFileDelete = function uploadedFileDelete(projectId, fileUrlName){
  console.log("bro : ",projectId," :- ",fileUrlName, " :0 ",JSON.stringify({"_id":projectId, "fileName":fileUrlName}));

      
  const c = document.getElementById("deleteButton");
  c.addEventListener("click", api_delete);

  async function api_delete(event) {
    event.preventDefault();
    c.removeEventListener("click", api_delete);
    
    try{
        let rr1 = await fetch(`${project_API}/deleteFile`, {
            method:'POST',
                headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "_id":projectId, 
              "fileName":fileUrlName
            })
        });
        console.log("broro :0 ",rr1)
        const c1 = (rr1.status==200);
        try{
            status_popup( ((c1) ? "File Deleted <br> Successfully" : "Please try again later"), (c1) );
            setTimeout(function(){
                window.location.reload();
            },((Number(document.getElementById("b1b1").innerText)-1)*1000));
        } catch (error){}
    } catch (error ){
        console.log("eroorrrr :0 ",error);
        status_popup("Please try again later", false);
    }
  }
}




// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================



window.removeInvoiceTableRow = function removeInvoiceTableRow(i, tag_id) {
  console.log("this is made by me, REMOVE INVOICE TABLE ROW");
  document.getElementById(tag_id).children[1].children[i - 1].remove();
  Array.from(document.getElementById(tag_id).children[1].children).map(
    (e, i) => {
      var dummyNo1 = i + 1;
      if (dummyNo1 != 1) {
        e.cells[0].innerText = dummyNo1;
        e.cells[
          e.cells.length - 1
        ].innerHTML = `<a href="javascript:void(0)" class="text-danger font-18 remove" onClick="removeInvoiceTableRow(${dummyNo1}, '${tag_id}')" title="Remove"><i class="fa-regular fa-trash-can"></i></a>`;
      }
    }
  );
}
// Add Table Row function globally declared for reuse
window.addInvoiceTableRow = function addInvoiceTableRow(tag_id) {
  console.log("this is made by me, ADD INVOICE TABLE ROW");
  const varTableConst = document.getElementById(tag_id).children[1].children;
  const i =
    Number(varTableConst[varTableConst.length - 1].cells[0].innerText) + 1;
  var tableBody = document.createElement("tr");
  tableBody.innerHTML = `
                          <td>${i}</td>
                        <td>
                           <input class="form-control paymentDate" type="date" id="paymentDate">
                        </td>
                        <td>
                          <input class="form-control paymentAmount" type="number"  placeholder="Enter Installment Amount" id="paymentAmount">
                        </td>
                        <td>
                          <select class="form-control paymentStatus" id="paymentStatus">
                            <option value="" disabled="" selected="">Select Status</option>
                            <option value="Active">Paid</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        <td>
                          <input class="form-control paidDate" type="date" id="paidDate">
                        </td>
                        <td class="text-center"><a href="javascript:void(0)" class="text-danger font-18 addProduct" onclick="removeInvoiceTableRow(${i}, '${tag_id}')" title="Remove"><i class="fa-regular fa-trash-can"></i></a>
                        </td>
                      `;
  tableBody.classList.add("installmentData");
  document.querySelector(".tbodyone").appendChild(tableBody);
  // a = Array.from(document.getElementsByClassName("addProduct"));
}




function global_price_calculate() {
  const discount_p = document.getElementById("discount_p");
  const discount_rs = document.getElementById("discount_rs");
  const price = document.getElementById("price");
  const tax_rs = document.getElementById("tax_rs");
  const totalPrice = document.getElementById("totalPrice");
  const tax = document.getElementById("tax");
  price.addEventListener("input", f1);
  tax.addEventListener("input", my_calc_1);
  
  discount_p.addEventListener("input", function () {
    if (Number(discount_p.value) > 0) {
      discount_rs.setAttribute("disabled", "disabled");
    } else {
      discount_rs.removeAttribute("disabled", "disabled");
    }
    f2();
  });
  discount_rs.addEventListener("input", function () {
    if (Number(discount_rs.value) > 0) {
      discount_p.setAttribute("disabled", "disabled");
    } else {
      discount_p.removeAttribute("disabled", "disabled");
    }
    f3();
  });
  function f1() {
    if (discount_p.getAttribute("disabled")) {
      f3();
    }
    if (
      discount_rs.getAttribute("disabled") ||
      Number(discount_rs.value) == 0
    ) {
      f2();
    }
  }
  function f2() {
    const p_price_12 = Number(price.value);
    const ps_discount_p = Number(discount_p.value);
    try {
      const mm_1 = formatValue_of_2((p_price_12 * ps_discount_p) / 100);
      discount_rs.value = mm_1;
    } catch {}
    my_calc_1();
  }
  function f3() {
    const p_price_12 = Number(price.value);
    const ps_discount_rs = Number(discount_rs.value);
    try {
      const mm_1 = formatValue_of_2(
        (Number(ps_discount_rs) / Number(p_price_12)) * 100
      );
      discount_p.value = mm_1;
    } catch {}
    my_calc_1();
  }
  function my_calc_1() {
    const my_aa1 = Number(tax.value);
    const my_aa2 = Number(discount_rs.value);
    const my_aa3 = Number(price.value);
    const rs_to_my_1 = formatValue_of_2(((my_aa3 - my_aa2) * my_aa1) / 100);
    tax_rs.value = rs_to_my_1;
    total_price_value_calc();
  }
  function total_price_value_calc() {
    const ma1 = Number(
      Number(price.value) - Number(discount_rs.value) + Number(tax_rs.value)
    );
    totalPrice.value = formatValue_of_2(ma1);
  }
  function formatValue_of_2(value) {
    // Convert the value to a number
    const num = parseFloat(value);
    // Check if the number is an integer
    if (Number.isInteger(num)) {
      return num.toString(); // Return as a string without decimals
    }
    // Convert to string and split by the decimal point
    const parts = num.toString().split(".");
    // If there are more than 2 decimal places, truncate to 2
    if (parts[1] && parts[1].length > 2) {
      return num.toFixed(2);
    }
    // Otherwise, return the original number
    return num.toString();
  }
}


