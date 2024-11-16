window.onload = ()=>{
    const loginMessage = localStorage.getItem('loginMessage');
    const registerMessage = localStorage.getItem('registerMessage');
    const message = document.getElementById('response')
    if(loginMessage){
        message.innerText = loginMessage
        setTimeout(()=>{
            message.style.display='none';
        },3000)
        localStorage.removeItem('loginMessage')
    }
    else if(registerMessage){
        message.innerText = loginMessage
        setTimeout(()=>{
            message.style.display='none';
        },3000)
        localStorage.removeItem('registerMessage')
    }
} 

if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
  }
  // =================================================================================
  import {   loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
  import { dashboard_API } from './apis.js';
  // =================================================================================
  const token = localStorage.getItem('token');
  // =================================================================================
  document.addEventListener("DOMContentLoaded", function () {
    
  
   
    async function fetchDashboardData() {
      try {
        // Show loading shimmer
        loading_shimmer();
  
        // Fetch data from the backend
        const response = await fetch(dashboard_API, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const data = await response.json();
  
        // Update the counts in the dashboard
        document.querySelector(".projects-count").textContent = data.counts.projectCount || 0;
        document.querySelector(".clients-count").textContent = data.counts.clientCount || 0;
        document.querySelector(".tasks-count").textContent = data.counts.taskCount || 0;
        document.querySelector(".employees-count").textContent = data.counts.employeeCount || 0;
  
        // Update recent invoices
        const invoicesTable = document.querySelector("#invoicesTable tbody");
        invoicesTable.innerHTML = data.recentInvoices.map(invoice => `
          <tr>
            <td><a href="invoice-view.html">${invoice.invoiceId}</a></td>
            <td>${invoice.clientName}</td>
            <td>${invoice.dueDate}</td>
            <td>${invoice.total}</td>
            <td><span class="badge ${getInvoiceStatusClass(invoice.status)}">${invoice.status}</span></td>
          </tr>
        `).join("");
  
        // Update recent clients
        const clientsTable = document.querySelector("#clientsTable tbody");
        clientsTable.innerHTML = data.recentClients.map(client => `
          <tr>
            
                <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.status}</td>
           
          </tr>
        `).join("");
  
        // Update recent projects
        const projectsTable = document.querySelector("#projectsTable tbody");
        projectsTable.innerHTML = data.recentProjects.map(project => `
          <tr>
            <td>
              <h2><a href="project-view.html">${project.projectName}</a></h2>
 
                <span>  ${project.clientName}</span><br>
                <span>  ${project.status}</span><br>
                <span>  ${project.deadline}</span>
              </small>
            </td>
            
          </tr>
        `).join("");
  
        // Update recent products
        const productsTable = document.querySelector("#productsTable tbody");
        productsTable.innerHTML = data.recentProducts.map(product => `
          <tr>
            <td>${product.productName}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
         
          </tr>
        `).join("");
  
        // Remove loading shimmer
        remove_loading_shimmer();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
  
    // Helper function to get status class for invoices
    function getInvoiceStatusClass(status) {
      switch (status) {
        case 'Paid': return 'bg-inverse-success';
        case 'Unpaid': return 'bg-inverse-danger';
        case 'Partially Paid': return 'bg-inverse-warning';
        default: return '';
      }
    }
  
    // Load data on page load
    fetchDashboardData();
  });
  