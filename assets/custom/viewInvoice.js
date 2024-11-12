const token = localStorage.getItem("token");
    window.onload = async function loadInvoiceData() {
        const URL = 'http://localhost:3000/invoice/get';
        const responseData = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const resp = await responseData.json();
        console.log(resp);
        let id = new URLSearchParams(window.location.search).get("id");
        resp.map((e,index)=>{
            if(id == e._id){
                const invoicesId = document.getElementById('invoicesId')
        const invoiceDate = document.getElementById('invoiceDate')
        const dueDate = document.getElementById('dueDate')
        const taxPerc = document.getElementById('taxPerc');
        const tableData = document.getElementById('tableData')
        const subTotal = document.getElementById('subTotal')
        const tax = document.getElementById('tax')
        const total = document.getElementById('total')
        
                var details = e.details;
                invoicesId.innerText = e.invoiceId
                invoiceDate.innerText = e.invoiceDate
                dueDate.innerText = e.dueDate
                subTotal.innerText = e.total;
                tax.innerText = e.tax;
                total.innerText = e.GrandTotal;
                let taxPercentage = Math.ceil((parseInt(tax.innerText) / parseInt(subTotal.innerText)) * 100);
                taxPerc.innerText = taxPercentage + '%'
                var x = ''
                for (j = 0; j < details.length; j++) {
                    x += `<tr>
                       <td>${j + 1}</td>
                       <td>${details[j].item}</td>
                       <td>${details[j].description}</td>
                       <td>${details[j].unitCost}</td>
                       <td>${details[j].qty}</td>
                       <td>${details[j].amount}</td>
                    </tr>`
                }
                tableData.innerHTML = x;
            }
        })
    }
    function handleClickToDownloadPdf(){
        const generatePdfFile = document.getElementById('generatePdfFile');
        html2pdf(generatePdfFile);
    }