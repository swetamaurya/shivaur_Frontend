// for employees-list.html
if(!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}

import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import {user_API,departments_API,desginations_API} from './apis.js';

const token = localStorage.getItem('token');
let _id_not_use_again;

// -------------------------------------------------------------------------------------------
async function dropDrownLoad() {
    try{
        let departments = document.getElementById("edit-department");
        let r1 = await fetch(`${departments_API}/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        let r2 = await r1.json();

        console.log(r2)
        departments.innerHTML = '';
        r2?.data.forEach((e)=>{
            let s = document.createElement("option");
            s.value = e?._id;
            s.textContent = e?.departments;
            departments.appendChild(s);
        })
    } catch (error){console.log(error)}
    try{
        let designations = document.getElementById("edit-designation");
        let r1 = await fetch(`${desginations_API}/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        let r2 = await r1.json();
        console.log(r2)
    
        designations.innerHTML = '';
        r2?.data.forEach((e)=>{
            let s = document.createElement("option");
            s.value = e?._id;
            s.textContent = e?.designations;
            designations.appendChild(s);
        })
    } catch (error){console.log(error)}
}
dropDrownLoad();
// -------------------------------------------------------------------------------------------

// employee dashboard data - table - load
async function all_data_load_dashboard(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    const id = new URLSearchParams(window.location.search).get('id');

    try{
        if (id) {
            const r1 = await fetch(`${user_API}/get/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const r2 = await r1.json();
            
            _id_not_use_again = r2?._id || id;

            if(r1.ok){

                //user profile section
                let a1 = r2;

                document.getElementById("view-profile-image").src = a1?.image || 'assets/img/profiles/avatar-02.jpg';

                try{
                    document.getElementById("view-name").innerText = a1?.name || '-';
                    document.getElementById("view-joining-date").innerText = formatDate(a1?.joiningDate) || '-';
                    document.getElementById("view-mobile").innerText = a1?.mobile || '-';
                    document.getElementById("view-email-id").innerText = a1?.email || '-';
                    document.getElementById("view-dob").innerText = formatDate(a1?.DOB) || '-';
                    document.getElementById("view-gender").innerText = a1?.gender || '-';
                    
                    document.getElementById("view-user-id").innerText = a1?.userId || '-';
                    document.getElementById("view-status").innerText = a1?.status || '-';
                    document.getElementById("view-roles").innerText = a1?.roles || '-';
                    document.getElementById("view-department").innerText = await rtn_deprt(a1?.departments) || '-';
                    document.getElementById("view-designation").innerText = await rtn_degi(a1?.designations) || '-';
                    document.getElementById("view-address").innerText = a1?.address || '-';
                } catch(error){console.log(error)}
                try{
                    document.getElementById("edit-profile-image").src = a1?.image || 'assets/img/profiles/avatar-02.jpg';
                    document.getElementById("edit-name").value = a1?.name || '-';
                    document.getElementById("edit-user-id").value = a1?.userId || '-';
                    document.getElementById("edit-joining-date").value = a1?.joiningDate || '-';
                    document.getElementById("edit-status").value = (a1?.status || '-').toLowerCase();
                    document.getElementById("edit-mobile").value = a1?.mobile || '-';
                    document.getElementById("edit-roles").value = a1?.roles || '-';
                    document.getElementById("edit-email-id").value = a1?.email || '-';
                    document.getElementById("edit-department").value = a1?.departments || '-';
                    document.getElementById("edit-dob").value = a1?.DOB || '-';
                    document.getElementById("edit-designation").value = a1?.designations || '-';
                    document.getElementById("edit-gender").value = a1?.gender || '-';
                    document.getElementById("edit-address").value = a1?.address || '-';
                } catch(error){console.log(error)}
                //emergency section
                let a2 = r2?.primaryContact;
                try{
                        //1 
                    document.getElementById("view-primaryName").innerText = a2?.name || '-';
                    document.getElementById("view-primaryRelationship").innerText = a2?.relationship || '-';
                    document.getElementById("view-primaryPhone").innerText = a2?.phone || '-';
                    document.getElementById("view-primaryAddress").innerText = a2?.address || '-';
                } catch(error) {console.log(error)}
                let a3 = r2?.secondaryContact;
                try{   //2
                    document.getElementById("view-secondaryName").innerText = a3?.name || '-';
                    document.getElementById("view-secondaryRelationship").innerText = a3?.relationship || '-';
                    document.getElementById("view-secondaryPhone").innerText = a3?.phone || '-';
                    document.getElementById("view-secondaryAddress").innerText = a3?.address || '-';
        
                }catch(error){console.log(error)}
                try{
                    document.getElementById("edit-primaryName").value = a2?.name || '-';
                    document.getElementById("edit-primaryRelationship").value = a2?.relationship || '-';
                    document.getElementById("edit-primaryPhone").value = a2?.phone || '-';
                    document.getElementById("edit-primaryAddress").value = a2?.address || '-';
                    document.getElementById("edit-secondaryName").value = a3?.name || '-';
                    document.getElementById("edit-secondaryRelationship").value = a3?.relationship || '-';
                    document.getElementById("edit-secondaryPhone").value = a3?.phone || '-';
                    document.getElementById("edit-secondaryAddress").value = a3?.address || '-';
                } catch(error) {console.log(error)}
                let a4 = r2?.bankDetails;
                try{
                    //bank section
                    document.getElementById("view-holderName").innerText = a4?.accountHolder || '-';
                    document.getElementById("view-bankName").innerText = a4?.bankName || '-';
                    document.getElementById("view-branchName").innerText = a4?.branchName || '-';
                    document.getElementById("view-accountType").innerText = a4?.accountType || '-';
                    document.getElementById("view-accountNumber").innerText = a4?.accountNumber || '-';
                    document.getElementById("view-IFSCCode").innerText = a4?.IFSCCode || '-';
                    document.getElementById("view-panNumber").innerText = a4?.PANNumber || '-';
                } catch(error){console.log(error)}
            }else {
                window.location.href = 'employees-list.html';
            }
        } else{
            window.location.href = 'employees-list.html';
        }
    } catch(error){
        window.location.href = 'employees-list.html';
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}

async function rtn_degi(degi_id){
    let r1 = await fetch(`${desginations_API}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    let r2 = (await r1.json())?.data;

    for(let i = 0; i<r2.length; i++){
        if((r2[i]?._id)==degi_id){
            return r2[i]?.designations;
        }
    }
}
async function rtn_deprt(deprt_id){
    let r1 = await fetch(`${departments_API}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    let r2 = (await r1.json())?.data;

    for(let i = 0; i<r2.length; i++){
        if((r2[i]?._id)==deprt_id){
            return r2[i]?.departments;
        }
    }
}

// =============================================================================================
// all employee load, on window load
all_data_load_dashboard();
// =============================================================================================
// =============================================================================================
// =============================================================================================
// =============================================================================================

// edit employee event listener
document.getElementById('profile-update-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateProfileForm()) {
        return; // Stop form submission if validation fails
    }
    try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=> e.click());
    } catch(error){console.log(error)}
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    let f = new FormData();
    f.append("_id",_id_not_use_again);
    f.append("userId",document.getElementById("edit-user-id").value);
    f.append("name",document.getElementById("edit-name").value);
    f.append("email",document.getElementById("edit-email-id").value);
    f.append("mobile",document.getElementById("edit-mobile").value);
    f.append("roles",document.getElementById("edit-roles").value);
    f.append("DOB",document.getElementById("edit-dob").value);
    f.append("address",document.getElementById("edit-address").value);
    f.append("gender",document.getElementById("edit-gender").value);
    f.append("status",document.getElementById("edit-status").value);
    f.append("joiningDate",document.getElementById("edit-joining-date").value);
    f.append("departments",document.getElementById("edit-department").value);
    f.append("designations",document.getElementById("edit-designation").value);
    
    let file1 = document.getElementById("edit-profile-image-update").files[0];
    if (file1) {
        f.append('image', file1);
    }

    try{
        let r = await fetch(`${user_API}/update`, {
            method:'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
            },
            body: f,
        });

        let c1 = (r.ok);
        if(c1){
            all_data_load_dashboard();
        }           
        status_popup( ((c1) ? "Data Updated <br> Successfully" : "Please try <br> again later"), (c1) );
    } catch (error){
        console.log(error);
        status_popup("Please try <br> again later", false);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});


//edit emergency contact event listener
document.getElementById('emergency-contact-update-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateEmergencyContactForm()) {
        return; // Stop form submission if validation fails
    }
    try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=> e.click());
    } catch(error){console.log(error)}
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    let z1 = document.getElementById("edit-primaryName").value;
    let z2 = document.getElementById("edit-primaryRelationship").value;
    let z3 = document.getElementById("edit-primaryPhone").value;
    let z4 = document.getElementById("edit-primaryAddress").value;

    let z5 = document.getElementById("edit-secondaryName").value;
    let z6 = document.getElementById("edit-secondaryRelationship").value;
    let z7 = document.getElementById("edit-secondaryPhone").value;
    let z8 = document.getElementById("edit-secondaryAddress").value;

    let zz1 = {
        'name': z1,
        'relationship': z2,
        'phone': z3,
        'address': z4
    };
    let zz2 = {
        'name': z5,
        'relationship': z6,
        'phone': z7,
        'address': z8
    };


    try{
        let r = await fetch(`${user_API}/update`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                '_id':_id_not_use_again,
                'primaryContact': zz1,
                'secondaryContact': zz2,
            }),
        });

        let c1 = (r.ok);
        if(c1){
            all_data_load_dashboard();
        }           
        status_popup( ((c1) ? "Date Updated <br> Successfully" : "Please try <br> again later"), (c1) );
    } catch (error){
        console.log(error);
        status_popup("Please try <br> again later", false);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});


// ===================================================================================================
// ===================================================================================================
// ===================================================================================================
// ===================================================================================================
// ===================================================================================================
// ===================================================================================================
// Validation function for profile update form
function validateProfileForm() {
    clearErrors(); // Remove previous error messages

    let isValid = true;

    // Get all field elements
    const name = document.getElementById('edit-name');
    const email = document.getElementById('edit-email-id');
    const mobile = document.getElementById('edit-mobile');
    const roles = document.getElementById('edit-roles');
    const DOB = document.getElementById('edit-dob');
    const address = document.getElementById('edit-address');
    const gender = document.getElementById('edit-gender');
    const status = document.getElementById('edit-status');
    const department = document.getElementById('edit-department');
    const designation = document.getElementById('edit-designation');

    // Validation rules
    if (!name.value.trim() || /\d/.test(name.value)) {
        showError(name, 'Enter a valid name without numbers');
        isValid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Enter a valid email address');
        isValid = false;
    }

    const mobileValue = mobile.value.trim();
    if (!mobileValue || mobileValue.length < 10 || mobileValue.length > 13 || !/^\d+$/.test(mobileValue)) {
        showError(mobile, 'Enter a valid phone number (10-13 digits, numbers only)');
        isValid = false;
    }

    if (!roles.value.trim()) {
        showError(roles, 'Please select a role');
        isValid = false;
    }

    if (!DOB.value.trim()) {
        showError(DOB, 'Date of Birth is required');
        isValid = false;
    }

    if (!address.value.trim()) {
        showError(address, 'Address is required');
        isValid = false;
    }

    if (!gender.value.trim()) {
        showError(gender, 'Please select a gender');
        isValid = false;
    }

    if (!status.value.trim()) {
        showError(status, 'Please select a status');
        isValid = false;
    }

    if (!department.value.trim()) {
        showError(department, 'Please select a department');
        isValid = false;
    }

    if (!designation.value.trim()) {
        showError(designation, 'Please select a designation');
        isValid = false;
    }

    return isValid;
}
// ============================================================================
// ============================================================================
// ============================================================================
// Validation function for emergency contact form
function validateEmergencyContactForm() {
    clearErrors(); // Clear previous error messages

    let isValid = true;

    // Primary Contact fields
    const primaryName = document.getElementById('edit-primaryName');
    const primaryRelationship = document.getElementById('edit-primaryRelationship');
    const primaryPhone = document.getElementById('edit-primaryPhone');
    const primaryAddress = document.getElementById('edit-primaryAddress');

    // Secondary Contact fields
    const secondaryName = document.getElementById('edit-secondaryName');
    const secondaryRelationship = document.getElementById('edit-secondaryRelationship');
    const secondaryPhone = document.getElementById('edit-secondaryPhone');
    const secondaryAddress = document.getElementById('edit-secondaryAddress');

    // Validation rules for Primary Contact
    if (!primaryName.value.trim() || /\d/.test(primaryName.value)) {
        showError(primaryName, 'Enter a valid name without numbers');
        isValid = false;
    }

    if (!primaryRelationship.value.trim()) {
        showError(primaryRelationship, 'Relationship is required');
        isValid = false;
    }

    const primaryPhoneValue = primaryPhone.value.trim();
    if (!primaryPhoneValue || primaryPhoneValue.length < 10 || primaryPhoneValue.length > 13 || !/^\d+$/.test(primaryPhoneValue)) {
        showError(primaryPhone, 'Enter a valid phone number (10-13 digits, numbers only)');
        isValid = false;
    }

    if (!primaryAddress.value.trim()) {
        showError(primaryAddress, 'Address is required');
        isValid = false;
    }

    // Validation rules for Secondary Contact
    if (!secondaryName.value.trim() || /\d/.test(secondaryName.value)) {
        showError(secondaryName, 'Enter a valid name without numbers');
        isValid = false;
    }

    if (!secondaryRelationship.value.trim()) {
        showError(secondaryRelationship, 'Relationship is required');
        isValid = false;
    }

    const secondaryPhoneValue = secondaryPhone.value.trim();
    if (!secondaryPhoneValue || secondaryPhoneValue.length < 10 || secondaryPhoneValue.length > 13 || !/^\d+$/.test(secondaryPhoneValue)) {
        showError(secondaryPhone, 'Enter a valid phone number (10-13 digits, numbers only)');
        isValid = false;
    }

    if (!secondaryAddress.value.trim()) {
        showError(secondaryAddress, 'Address is required');
        isValid = false;
    }

    return isValid;
}


// ===============================================================================
// ===============================================================================
// ===============================================================================
// Function to show error messages inside the correct div next to labels
function showError(element, message) {
    const errorContainer = element.previousElementSibling; // Access the div with label
    let errorElement = errorContainer.querySelector('.text-danger.text-size');

    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'text-danger text-size mohit_error_js_dynamic_validation';
        errorElement.style.fontSize = '10px';
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
        errorContainer.appendChild(errorElement);
    } else {
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
    }
}

// Function to clear all error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.text-danger.text-size.mohit_error_js_dynamic_validation');
    errorMessages.forEach((msg) => msg.remove());
}