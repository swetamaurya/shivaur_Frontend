$(document).ready(function () {
    // Load header
    $('#header-placeholder').load('header.html', function() {
        // Fetch role from localStorage
        var userRole = localStorage.getItem('User_role');
        
        // Inject role into the header-role span
        if (userRole) {
            $('#role').text(userRole);
        } else {
            $('#role').text('Guest');
        }
    });
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