const token = localStorage.getItem("token");
    var resp;
    window.onload = async () => {
        const URL = 'http://localhost:3000/estimates/get';
        const responseData = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        resp = await responseData.json();
        let id = new URLSearchParams(window.location.search).get("id");
        resp.map((e,index)=>{
            if(e._id == id){
                const estimatesId = document.getElementById('estimatesId')
        const estimateDate = document.getElementById('createDate')
        const expiryDate = document.getElementById('expiryDate')
        let taxPerc = document.getElementById('taxPerc')
        taxPerc.innerText = sessionStorage.getItem('taxPercentage');
        const tableData = document.getElementById('tableData')
        const subTotal = document.getElementById('subTotal')
        const tax = document.getElementById('tax')
        const total = document.getElementById('total')
    
            
                var details = e.details;
                estimatesId.innerText = e.estimatesId
                estimateDate.innerText =e.estimateDate
                expiryDate.innerText = e.expiryDate
                subTotal.innerText = e.total;
                tax.innerText = e.tax;
                total.innerText = e.GrandTotal;
                let taxPercentage = Math.ceil((parseInt(tax.innerText) / parseInt(subTotal.innerText)) * 100);
                taxPerc.innerText = taxPercentage + '%'
                var x = '';
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
            
        
        sessionStorage.removeItem('taxPercentage');
            }
        })
    }

    function handleClickToDownloadPdf(){
        const generatePdfFile = document.getElementById('generatePdfFile');
        html2pdf(generatePdfFile);
    }