import {status_popup} from './globalFunctions1.js';
import {user_API ,project_API ,invoice_API} from './apis.js';
const token = localStorage.getItem("token");

try {
    const response = await fetch(`${user_API}/data/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
  
const client_select_option = document.getElementById("client_select_option");
res.users.clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client._id;
    option.text = `${client?.name} (${client?.userId})`;
    client_select_option.appendChild(option);
  });
}
catch(error){
    console.error('Error fetching data:', error);
  alert('Failed to load client and employee data.');
}
async function showProjectDropdown(){
    const r1 = await fetch(`${project_API}/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      const r2 = await r1.json();
      
      const project_select_option = document.getElementById("project_select_option");
      console.log(r2?.projects)
      r2?.projects.map((e) => {
        let a1 = document.createElement("option");
        a1.value = e?._id || '-';
        a1.text = `${e?.projectName} (${e?.projectId})` || '-' ;
        project_select_option.appendChild(a1);
      });
}
showProjectDropdown();    
// Invoice create API start 

    const createInvoiceForm = document.getElementById('create-invoice-form');
    createInvoiceForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const clientAddress = document.getElementById('clientAddress').value;
        const billingAddress = document.getElementById('billingAddress').value;
        const invoiceDate = document.getElementById('invoiceDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const tax = document.getElementById('tax').value;
        const client = document.getElementById('client_select_option').value;
        const project = document.getElementById('project_select_option').value
        const taxType = document.getElementById('taxType').value
        const discount = document.getElementById('discount').value
        var totalAmount = document.getElementById('totalAmount');
        var grandTotalAmount = document.getElementById('grandTotal')
        const total = totalAmount.innerText;
        const GrandTotal = grandTotalAmount.innerText;

        let details = [];
        const items = document.getElementsByClassName('item');
        const descriptions = document.getElementsByClassName('description');
        const unitCosts = document.getElementsByClassName('unitCost');
        const quantities = document.getElementsByClassName('quantity');
        const amounts = document.getElementsByClassName('invoiceAmount');

        for (let i = 0; i < items.length; i++) {
            details.push({
                item: items[i].value,
                description: descriptions[i].value,
                unitCost: unitCosts[i].value,
                qty: quantities[i].value,
                amount: amounts[i].value
            });
        }
        try {
            const response = await fetch(`${invoice_API}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email, 
                    clientAddress, 
                    billingAddress, 
                    invoiceDate, 
                    dueDate, 
                    details, 
                    tax, 
                    total, 
                    GrandTotal, 
                    client, 
                    project, 
                    taxType,
                    discount
                })
            })
            const res = await response.json()
            console.log(res);
            const c1 = (response.ok==true);
            try{
                status_popup( ((c1) ? "Invoice Created <br> Successfully" : "Please try again later"), (c1) );
                setTimeout(function(){
                    window.location.href = 'invoices.html';
                },(Number(document.getElementById("b1b1").innerText)*1000));
            } catch (error){
              status_popup( ("Please try again later"), (false) );
            }
        } catch (error) {
            status_popup( ("Please try again later"), (false) );
            console.log(error)
        }
    })

    // Invoice create API end

    window.removeInvoiceTableRow = function removeInvoiceTableRow(i, tag_id) {
        console.log("this is made by me, REMOVE INVOICE TABLE ROW")
    
        document.getElementById(tag_id).children[1].children[i - 1].remove();
    
        Array.from(document.getElementById(tag_id).children[1].children).map(
            (e, i) => {
                var dummyNo1 = i + 1;
                if (dummyNo1 != 1) {
                    e.cells[0].innerText = dummyNo1;
                    e.cells[(e.cells.length) - 1].innerHTML = `<a href="javascript:void(0)" class="text-danger font-18 remove" onClick="removeInvoiceTableRow(${dummyNo1}, '${tag_id}')" title="Remove"><i class="fa-regular fa-trash-can"></i></a>`;
                }
            });
    }
    // Add Table Row function globally declared for reuse
    window.addInvoiceTableRow = function addInvoiceTableRow(tag_id, item, description, unitCost, qty, amount, cond) {
    
        console.log("brother, i am working here, and this is a demo. so, relax")
    
        item = (item == undefined) ? "" : item;
        description = (description == undefined) ? "" : description;
        unitCost = (unitCost == undefined) ? "" : unitCost;
        qty = (qty == undefined) ? "" : qty;
        amount = (amount == undefined) ? "" : amount;
        cond = (cond == undefined) ? false : cond;
    
        if (cond) {
            document.querySelector('.item').value = item;
            document.querySelector('.description').value = description;
            document.querySelector('.unitCost').value = unitCost;
            document.querySelector('.quantity').value = qty
            document.querySelector('.invoiceAmount').value = amount;
            cond = false;
            return;
        }
    
    
    
        // console.log("this is made by me, ADD INVOICE TABLE ROW")
        const varTableConst = document.getElementById(tag_id).children[1].children;
        const i = (Number(varTableConst[(varTableConst.length) - 1].cells[0].innerText)) + 1;
    
        var tableBody = document.createElement('tr');
        tableBody.innerHTML = `
                                <td>${i}</td> <td><input value="${item}" class="form-control item" type="text"></td> 
                                <td><input class="form-control description" value="${description}" type="text"></td> 
                                <td><input class="form-control unitCost" value="${unitCost}" type="text"></td> 
                                <td><input class="form-control quantity" value="${qty}" type="text"></td> 
                                <td><input disabled class="form-control invoiceAmount" value="${amount}" type="text"></td> 
                                <td>
                                  <a href="javascript:void(0)" class="text-danger font-18 remove" 
                                  onClick="removeInvoiceTableRow(${i}, '${tag_id}')" 
                                  title="Remove"><i class="fa-regular fa-trash-can"></i></a>
                                </td>
                                `;
        document.querySelector(".tbodyone").appendChild(tableBody);
        a = Array.from(document.getElementsByClassName('addProduct'));
    }

    function cccc(){


        // Function to calculate the invoice amount for a given row
        function calculateInvoiceAmount(row) {
            const unitCost = parseFloat(row.querySelector('.unitCost').value) || 0; // Default to 0 if not a number
            const quantity = parseFloat(row.querySelector('.quantity').value) || 0; // Default to 0 if not a number
            const totalAmount = unitCost * quantity;
            row.querySelector('.invoiceAmount').value = totalAmount.toFixed(2); // Format as two decimal places

        t_amt();
        }

        // Attach event listeners to existing rows
        const rows = document.querySelectorAll('.tbodyone tr');
        rows.forEach(row => {
            const unitCostInput = row.querySelector('.unitCost');
            const quantityInput = row.querySelector('.quantity');

            // Event listener for unitCost change
            unitCostInput.addEventListener('input', function() {
                calculateInvoiceAmount(row);
            });

            // Event listener for quantity change
            quantityInput.addEventListener('input', function() {
                calculateInvoiceAmount(row);
            });
        });

        
}

function f(){
    Array.from(document.querySelectorAll(".unitCost")).map(e=>{
        
        e.removeEventListener("input", cccc)
        e.addEventListener("input", cccc)
    })
    Array.from(document.querySelectorAll(".quantity")).map(e=>{
        e.removeEventListener("input", cccc)
        e.addEventListener("input", cccc)
    })
    // Array.from(document.querySelectorAll(".unitCost, .quantity")).map(element => {
    //     console.log('first log')
    //     element.removeEventListener("input", cccc);
    //     console.log('second log')
    //     element.addEventListener("input", cccc);
    //     console.log('third log')
    // });


}
f();


document.getElementById("discount").addEventListener("input",all)
document.getElementById("tax").addEventListener("input",all);


function t_amt(){
    let a1 = 0;
    Array.from(document.querySelectorAll(".invoiceAmount")).map(e=> a1+=Number(e.value));
    // Array.from(document.querySelectorAll(".invoiceAmount")).map(a=> console.log("E :- ",a));
    // console.log("hello brohte :- ",a1)
    document.getElementById("totalAmount").innerText = a1;
    all();
}

function all(){
    let discount = Number(document.getElementById("discount").value);
    let tax = Number(document.getElementById("tax").value);
    let totalAmount = Number(document.getElementById("totalAmount").innerText);


    let a1 = (totalAmount*discount)/100;
    let a2 = (totalAmount-a1);
    let a3 = (a2*tax)/100;
    let a4 = a2+a3;
    // console.log(a3)

    document.getElementById("grandTotal").innerText = a4;
}
    // let totalAmount;
    // function handleToGenerateAmount(){
    //     totalAmount=0;
    //     const unitCosts = document.querySelectorAll('.unitCost');
    //     const quantities = document.querySelectorAll('.quantity');
    //     const amounts = document.querySelectorAll('.invoiceAmount');
    //     const total = document.getElementById('totalAmount');
    //     const grandTotal = document.getElementById('grandTotal');
    
    //     for (let i = 0; i < unitCosts.length; i++) {
    //         const unitCosting = parseFloat(unitCosts[i].value) || 0;
    //         const qty = parseFloat(quantities[i].value) || 0;
    //         amounts[i].value = (unitCosting * qty).toFixed(2); 
    //         totalAmount+=parseFloat(amounts[i].value) || 0;
    //     }
    //     total.innerText = totalAmount;
    //     grandTotal.innerText = totalAmount;
    // }
    // let grandTotalAmount;
    // function handleTaxAmountOnChange(){
    //     const tax = document.getElementById('tax')
    //     const total = document.getElementById('totalAmount');
    //     const grandTotal = document.getElementById('grandTotal');
    //     const discount = document.getElementById('discount');
    //     discount.setAttribute('disabled','disabled');
    //     const taxPerc = parseFloat(tax.value);
    //     if(taxPerc != 0){
    //         grandTotal.innerText = (parseFloat(totalAmount+ (totalAmount * (taxPerc/100)))).toFixed(2);
    //         grandTotalAmount = (parseFloat(totalAmount+ (totalAmount * (taxPerc/100)))).toFixed(2);
    //     }
    // }
    
    // function handleDiscountAmountOnChange(){
    //     const discount = document.getElementById('discount');
    //     const tax = document.getElementById('tax')
    //     const grandTotal = document.getElementById('grandTotal');
    //     let discountedAmount;
    //     const discountVal = parseFloat(discount.value);
    //     if(discountVal != 0 ){
    //         discountedAmount = (grandTotalAmount * parseFloat(discountVal/100)).toFixed(2);
    //         grandTotal.innerText = grandTotalAmount - discountedAmount;
    //     }
    // }
    // const tax = document.getElementById('tax');
    // tax.addEventListener('blur',()=>{
    //     const discount = document.getElementById('discount');
    //     const tax = document.getElementById('tax')
    //     discount.removeAttribute('disabled');
    //     tax.setAttribute('disabled','disabled');
    // })