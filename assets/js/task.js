(function ($) {
  $(document).ready(function () {
    var notificationTimeout;
    var updateNotification = function (task, notificationText, newClass) {
      var notificationPopup = $(".notification-popup ");
      notificationPopup.find(".task").text(task);
      notificationPopup.find(".notification-text").text(notificationText);
      notificationPopup.removeClass("hide success");
      if (newClass) notificationPopup.addClass(newClass);
      if (notificationTimeout) clearTimeout(notificationTimeout);
      notificationTimeout = setTimeout(function () {
        notificationPopup.addClass("hide");
      },3000);
    };
    var addTask = function () {
      var newTask = $("#new-task").val();
      if (newTask === "") {
        $("#new-task").addClass("error");
        $(".new-task-wrapper .error-message").removeClass("hidden");
      } else {
        var todoListScrollHeight = $(".task-list-body").prop("scrollHeight");
        var newTemplate = $(taskTemplate).clone();
        newTemplate.find(".task-label").text(newTask);
        newTemplate.addClass("new");
        newTemplate.removeClass("completed");
        $("#task-list").append(newTemplate);
        $("#new-task").val("");
        $("#mark-all-finished").removeClass("move-up");
        $("#mark-all-incomplete").addClass("move-down");
        updateNotification(newTask, "added to list");
        $(".task-list-body").animate({ scrollTop: todoListScrollHeight }, 1000);
      }
    };
    var closeNewTaskPanel = function () {
      $(".add-task-btn").toggleClass("visible");
      $(".new-task-wrapper").toggleClass("visible");
      if ($("#new-task").hasClass("error")) {
        $("#new-task").removeClass("error");
        $(".new-task-wrapper .error-message").addClass("hidden");
      }
    };
    var taskTemplate =
      '<li class="task"><div class="task-container"><span class="task-action-btn task-check"><span class="action-circle large complete-btn" title="Mark Complete"><i class="material-icons">check</i></span></span><span class="task-label" contenteditable="true"></span><span class="task-action-btn task-btn-right"><span class="action-circle large" title="Assign"><i class="material-icons">person_add</i></span> <span class="action-circle large delete-btn" title="Delete Task"><i class="material-icons">delete</i></span></span></div></li>';
    $(".add-task-btn").click(function () {
      var newTaskWrapperOffset = $(".new-task-wrapper").offset().top;
      $(this).toggleClass("visible");
      $(".new-task-wrapper").toggleClass("visible");
      $("#new-task").focus();
      $("body").animate({ scrollTop: newTaskWrapperOffset }, 1000);
    });
    $("#task-list").on("click", ".task-action-btn .delete-btn", function () {
      var task = $(this).closest(".task");
      var taskText = task.find(".task-label").text();
      task.remove();
      updateNotification(taskText, " has been deleted.");
    });
    $("#task-list").on("click", ".task-action-btn .complete-btn", function () {
      var task = $(this).closest(".task");
      var taskText = task.find(".task-label").text();
      var newTitle = task.hasClass("completed")
        ? "Mark Complete"
        : "Mark Incomplete";
      $(this).attr("title", newTitle);
      task.hasClass("completed")
        ? updateNotification(taskText, "marked as Incomplete.")
        : updateNotification(taskText, " marked as complete.", "success");
      task.toggleClass("completed");
    });
    $("#new-task").keydown(function (event) {
      var keyCode = event.keyCode;
      var enterKeyCode = 13;
      var escapeKeyCode = 27;
      if ($("#new-task").hasClass("error")) {
        $("#new-task").removeClass("error");
        $(".new-task-wrapper .error-message").addClass("hidden");
      }
      if (keyCode == enterKeyCode) {
        event.preventDefault();
        addTask();
      } else if (keyCode == escapeKeyCode) closeNewTaskPanel();
    });
    $("#add-task").click(addTask);
    $("#close-task-panel").click(closeNewTaskPanel);
    $("#mark-all-finished").click(function () {
      $("#task-list .task").addClass("completed");
      $("#mark-all-incomplete").removeClass("move-down");
      $(this).addClass("move-up");
      updateNotification("All tasks", "marked as complete.", "success");
    });
    $("#mark-all-incomplete").click(function () {
      $("#task-list .task").removeClass("completed");
      $(this).addClass("move-down");
      $("#mark-all-finished").removeClass("move-up");
      updateNotification("All tasks", "marked as Incomplete.");
    });
  });
})(jQuery);
