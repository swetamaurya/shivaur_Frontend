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
        } else {
            $('#role').text('Guest');
        }
    });

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
