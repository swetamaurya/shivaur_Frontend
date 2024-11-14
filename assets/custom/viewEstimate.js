if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { estimate_API, user_API, project_API } from './apis.js';
// =================================================================================
const token = localStorage.getItem('token');
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
async function clientsDetails(_id_param) {
    try {
        let r = await fetch(`${user_API}/get/${_id_param}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        
        let r2 = await r.json();

        document.getElementById("clientName").innerText = r2?.name;
        document.getElementById("clientph").innerText = r2?.mobile;
        document.getElementById("clientMail").innerText = r2?.email;
    } catch (error) {
        console.error('Error updating client:', error);
    }
}
async function projDetails(_id_param) {
    const response = await fetch(`${project_API}/get/${_id_param}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });

    let r2 = await response.json();

    document.getElementById("proNm").innerHTML = `${r2?.projectName} (${r2?.projectId})`;    
}
// =========================================================================================

// var resp;
async function load_data() {
    let id = new URLSearchParams(window.location.search).get("id");
    const URL = `${estimate_API}/get/${id}`;
    const responseData = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    let resp = await responseData.json();

    console.log("bro :- ",resp)


    const tableData = document.getElementById('tableData')
    var x = '';
    resp?.details.map((e,i)=>{
        x += `<tr>
            <td>${i + 1}</td>
            <td>${e.item}</td>
            <td>${e.description}</td>
            <td>${e.unitCost}</td>
            <td>${e.qty}</td>
            <td>₹ ${e.amount}</td>
            </tr>`;
    })
    tableData.innerHTML = x;


    try{
        document.getElementById("estId").innerText = resp?.estimatesId;
        document.getElementById("createDate").innerText = formatDate(resp?.createdAt);
        document.getElementById("expiryDate").innerText = formatDate(resp?.expiryDate);
        document.getElementById("clientAddr").innerText = resp?.billingAddress;

        document.getElementById("subTotal").innerText = `₹ ${resp?.total}`;
        document.getElementById("taxType").innerText = resp?.taxType;
        document.getElementById("taxAmt").innerText = `${resp?.tax}%`;
        document.getElementById("discountAmt").innerText = `${resp?.discount}%`
        document.getElementById("grandTotal").innerText = `₹ ${resp?.GrandTotal}`;

        document.getElementById("otherInfo").innerText = resp?.otherInfo;

    } catch(error){
        console.log(error);
    }
    try{
        await clientsDetails(resp?.client);
    } catch(error){
        console.log(error);
    }
    try{
        await projDetails(resp?.project);
    } catch(error){
        console.log(error);
    }


    // ------------------------------------------------------------------------
    if(true) return;
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
load_data();

window.handleClickToDownloadPdf = function handleClickToDownloadPdf(){
    const generatePdfFile = document.getElementById('generatePdfFile');
    html2pdf(generatePdfFile);
}