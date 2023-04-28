var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {

    event.preventDefault();

  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.textContent = "This is a new task.";
  tasksToDoEl.appendChild(listItemEl);
}

buttonEl.addEventListener("click", createTaskHandler); 
  var listItemEl = document.createElement("li"); //create a new task item
  listItemEl.className = "task-item"; //style the new task item
  listItemEl.textContent = "This is a new task."; //add the text
  tasksToDoEl.appendChild(listItemEl); //append the element to the task list

formEl.addEventListener("submit", createTaskHandler);
