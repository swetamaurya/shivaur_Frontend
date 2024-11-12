const token = localStorage.getItem("token");
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
        const client = document.getElementById('client').value;
        const project = document.getElementById('project').value
        const taxType = document.getElementById('taxType').value
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
        const url = 'http://localhost:3000/invoice/post';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email, clientAddress, billingAddress, invoiceDate, dueDate, details, tax, total, GrandTotal, client, project, taxType
            })
        })
        const res = await response.json()
        console.log(res);
        if(response.ok){
            window.location.pathname = 'Frontend/invoices.html'
        }
        else{
            alert('something went wrong');
        }
    })

    // Invoice create API end

    function removeInvoiceTableRow(i, tag_id) {
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
    function addInvoiceTableRow(tag_id, item, description, unitCost, qty, amount, cond) {
    
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
                                    <td>${i}</td> <td><input value="${item}" class="form-control item" type="text"></td> <td><input class="form-control description" value="${description}" type="text"></td> <td><input class="form-control unitCost" value="${unitCost}" type="text"></td> <td><input class="form-control quantity" value="${qty}" type="text"></td> <td><input class="form-control invoiceAmount" value="${amount}" type="text"></td> <td>
                                    <a href="javascript:void(0)" class="text-danger font-18 remove" onClick="removeInvoiceTableRow(${i}, '${tag_id}')" title="Remove"><i class="fa-regular fa-trash-can"></i></a></td>
                                `;
        document.querySelector(".tbodyone").appendChild(tableBody);
        a = Array.from(document.getElementsByClassName('addProduct'));
    }
