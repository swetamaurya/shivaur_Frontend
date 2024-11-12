import {status_popup} from './globalFunctions1.js';
import {user_API} from './apis.js';

const token = localStorage.getItem('token');

// =======================================================
// =======================================================
// =======================================================

const registerForm = document.getElementById('postForm');

// Function to show error messages next to the label inside the div
function showError(element, message) {
  const errorContainer = element.previousElementSibling; // Access the div with label
  let errorElement = errorContainer.querySelector('.error-text');
  
  // If an error message is not already displayed, create a new one
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'error-text';
    errorElement.style.color = 'red';
    errorContainer.appendChild(errorElement);
  }
  
  // Set the error message
  errorElement.innerText = message;
}

// Function to remove previous error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-text');
  errorMessages.forEach((msg) => msg.remove());
}

function validationChecker() {
  // Clear any previous error messages
  clearErrors();
  
  // Get input values
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const mobile = document.getElementById('mobile');
  const password = document.getElementById('password');
  const role = document.getElementById('role');

  let isValid = true;

  // Name validation: no numbers allowed
  const nameValue = name.value.trim();
  if (/\d/.test(nameValue)) {
    showError(name, 'Enter valid name');
    isValid = false;
  }
  if (nameValue === '') {
    showError(name, 'This field is required');
    isValid = false;
  }

  // Email validation: required
  const emailValue = email.value.trim();
  if (emailValue === '') {
    showError(email, 'Fill this field');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    showError(email, 'Enter a valid email address');
    isValid = false;
  }

  // Mobile validation: max 13 digits, min 10 digits
  const mobileValue = mobile.value.trim();
  if (mobileValue === '') {
    showError(mobile, 'This field is required');
    isValid = false;
  } else if (mobileValue.length > 13 || mobileValue.length < 10) {
    showError(mobile, 'Enter valid number');
    isValid = false;
  } else if (!/^\d+$/.test(mobileValue)) {
    showError(mobile, 'Enter only numbers');
    isValid = false;
  }

  // Password validation: required
  if (password.value.trim() === '') {
    showError(password, 'This field is required');
    isValid = false;
  }

  // Role selection validation
  if (role.value === '') {
    showError(role, 'Please select a role');
    isValid = false;
  }

  return isValid;
}

// Form submit event listener
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Run validation
  if (!validationChecker()) {
    return false;
  }

  // Get form values after validation passes
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  const roles = document.getElementById('role').value;

  try {
    // Send data to the backend
    const response = await fetch(`${user_API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, mobile, password, roles }),
    });


    const c1 = (response.ok);
    try{
        status_popup( ((c1) ? "Account Created <br> Successfully" : "Please try again later"), (c1) );
        setTimeout(function(){
          window.location.href = 'index.html';
        },((Number(document.getElementById("b1b1").innerText)-1)*1000));
    } catch (error){
      status_popup( ("Please try again later"), (false) );
    }
  } catch (error) {
    status_popup( ("Please try again later"), (false) );
    // document.getElementById('response').innerText = 'Error connecting to the server.';
    console.error('Error:', error);
  }
});