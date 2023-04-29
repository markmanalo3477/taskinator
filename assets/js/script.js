var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");


var taskFormHandler = function(event) {
  // stops the browser from reloading the page upon a form submission
  event.preventDefault();
  
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  var listItemEl = document.createElement("li"); //create a new task item
  listItemEl.className = "task-item"; //style the new task item
  listItemEl.textContent = taskNameInput; //add the text
//  tasksToDoEl.appendChild(listItemEl); //append the element to the task list  --this was duplication of items
  
  var isEdit = formEl.hasAttribute("data-task-id");
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create new object as normal and pass to createTaskEl function  
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    }

    createTaskEl(taskDataObj);
  }

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  // clear the form input boxes after you click Add Task
  formEl.reset();
};

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item"; 

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  listItemEl.setAttribute("draggable", "true");

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  // give it a class name
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

  listItemEl.appendChild(taskInfoEl);

  // create buttons that correspond to the current task id
  var taskActionsEl = createTaskActions(taskIdCounter); 
  listItemEl.appendChild(taskActionsEl); 

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  // increase task counter for next unique id
  taskIdCounter++;
};

 // create edit and delete buttons, and to-do dropdown for each task
var createTaskActions = function(taskId) {

  // create a new div element that will be a container for the other elements
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  
  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  // create <select> drop-down element
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  // fill options for drop-down box
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i=0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionContainerEl;
};



// function for delete button
var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    // get the element's task id
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function(taskId) {
  console.log("editing task #" + taskId);

  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  // after Edit is clicked, task's name and type will appear in the form inputs
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;  
  // changes button label to Save Task after Edit button is clicked
  document.querySelector("#save-task").textContent = "Save Task"; 
  // adds the taskId to a data-task-id attribute on the form
  formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  
  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function(event) {
 // get the task item's id
 var taskId = event.target.getAttribute("data-task-id");

 // get the currently selected option's value and convert to lowercase
 var statusValue = event.target.value.toLowerCase();

 // find the parent task item element based on the id
 var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

 if (statusValue === "to do") {
   tasksToDoEl.appendChild(taskSelected);
 }
 else if (statusValue === "in progress") {
   tasksInProgressEl.appendChild(taskSelected);
 }
 else if (statusValue === "completed") {
   tasksCompletedEl.appendChild(taskSelected);
 }
};

var dragTaskHandler = function(event) {
  var taskId = event.target.getAttribute("data-task-id");
  event.dataTransfer.setData("text/plain", taskId);
  var getId = event.dataTransfer.getData("text/plain");
  console.log("getId:", getId, typeof getId);
}

var dropZoneDragHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) { // if target is within the task list, return the DOM element which is truthy
    // prevent default keep drag item in 1 place and allow dragged event to be dropped in a new location
    event.preventDefault();
    // change style when you drag from one container to the next
    taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
  }  
};

var dropTaskHandler = function(event) {
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']");
  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;

  // set status of task based on dropZone id 
  var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
  // reassign the task
  if (statusType === "tasks-to-do") {
    statusSelectEl.selectedIndex = 0;
  }
  else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  }
  else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }

  // remove style change when the new item is dropped
  dropZoneEl.removeAttribute("style");

  // append the item to its new parent element
  dropZoneEl.appendChild(draggableElement);
};

var dragLeaveHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    taskListEl.removeAttribute("style");
  }
}

// eventListeners:
formEl.addEventListener("submit", taskFormHandler); // add or save a task
pageContentEl.addEventListener("change", taskStatusChangeHandler); // edit task status
pageContentEl.addEventListener("click", taskButtonHandler); // delete button
pageContentEl.addEventListener("dragstart", dragTaskHandler); // drag task to different section
pageContentEl.addEventListener("dragover", dropZoneDragHandler); // dragover between sections
pageContentEl.addEventListener("drop", dropTaskHandler); // drop the task in the new container
pageContentEl.addEventListener("dragleave", dragLeaveHandler); // revert container to old style after item is dropped elsewhere

