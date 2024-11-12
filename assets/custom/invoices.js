const token = localStorage.getItem("token");
    // Invoice get API start 
    var res;
    window.onload = async () => {
        var tableData = document.getElementById('tableData');
        const status = 'pending';
        const url = 'http://localhost:3000/invoice/get';
        const response = await fetch(url, {
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
            <td>${i + 1}</td><td>${e.invoiceId}</td><td>${e.client}</td><td>${e.invoiceDate}</td><td>${e.dueDate}</td><td>${e.GrandTotal}</td><td>${e.status}
            <td class="text-end">
                      <div class="dropdown dropdown-action">
                        <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown"
                          aria-expanded="false"><i class="material-icons">more_vert</i></a>
                        <div class="dropdown-menu dropdown-menu-right">
                         <a class="dropdown-item" href="invoice-view.html?id=${e._id}"><i class="fa-solid fa-eye m-r-5"></i>
                            View</a> 
                        <a class="dropdown-item" href="edit-invoice.html?id=${e._id}"><i class="fa-solid fa-pencil m-r-5"></i>
                            Edit</a>
                         
                          <a class="dropdown-item" onclick="handleClickOnDeleteInvoice('${e._id}')" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#delete_invoice" ><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                        </div>
                      </div>
                    </td>
            </td></tr>`
            // <a class="dropdown-item" href="#"><i class="fa-regular fa-file-pdf m-r-5"></i> Download</a>

        }
        tableData.innerHTML = x;
    }
    // Invoice get API end

    var invoiceDeleteId;
    function handleClickOnDeleteInvoice(id){
        invoiceDeleteId = id;
    }

    async function handleClickToDeleteInvoiceData() {
        var _id = invoiceDeleteId;
        try {
            const url = 'http://localhost:3000/invoice/delete';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ` Bearer ${token}`
                },
                body: JSON.stringify({ _id })
            })
            const resp = await response.json();
            console.log(resp);
            const row = document.querySelector(`tr[data-id="${_id}"]`);
            row.remove();
        } catch (error) {
            alert(error)
            console.log(error);
        }
    }
    