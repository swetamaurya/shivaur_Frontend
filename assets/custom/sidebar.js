<<<<<<< HEAD
if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================

// $(document).ready(function () {
    const user_role_variable = localStorage.getItem('User_role'); // Use 'const' if user_role_variable value won't change

    // Load header
    $('#header-placeholder').load('header.html', function() {
        if (user_role_variable) {
            $('#role').text(user_role_variable);
=======
$(document).ready(function () {
    // Load header
    $('#header-placeholder').load('header.html', function() {
        // Fetch role from localStorage
        var userRole = localStorage.getItem('User_role');
        
        // Inject role into the header-role span
        if (userRole) {
            $('#role').text(userRole);
>>>>>>> d26da3fff18da4e43729e763ccb5d089cb5bb30a
        } else {
            $('#role').text('Guest');
        }
    });
<<<<<<< HEAD

    // Load sidebar based on user_role_variable
    if (user_role_variable && user_role_variable.toLowerCase() === "admin") {
        $('#sidebar-placeholder').load('admin-sidebar.html');
        console.log('Admin Logged In');
    } else if (user_role_variable && user_role_variable.toLowerCase() === "employee") {
        $('#sidebar-placeholder').load('employee-sidebar.html');
        console.log('Employee Logged In');
    } else if (user_role_variable && user_role_variable.toLowerCase() === "hr") {
        $('#sidebar-placeholder').load('hr-sidebar.html');
        console.log('HR Logged In');
    } else if (user_role_variable && user_role_variable.toLowerCase() === "manager") {
        $('#sidebar-placeholder').load('manager-sidebar.html');
        console.log('Manager Logged In');
    } else {
        console.log('Guest Logged In');
    }
// });
=======
});

const User_role = localStorage.getItem('User_role');
if(User_role == "Admin"){
    $('#sidebar-placeholder').load('admin-sidebar.html');
    console.log('Admin Logged In')
}
else if(User_role == "Employee"){
    $('#sidebar-placeholder').load('employee-sidebar.html');
    console.log('Employee Logged In')
}
else if(User_role == "HR"){
    $('#sidebar-placeholder').load('hr-sidebar.html');
    console.log('HR Logged In')
}
else if(User_role == "Manager"){
    $('#sidebar-placeholder').load('manager-sidebar.html');
}
>>>>>>> d26da3fff18da4e43729e763ccb5d089cb5bb30a
