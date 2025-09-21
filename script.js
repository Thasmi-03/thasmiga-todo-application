// DOM Elements
const taskInput = document.getElementById("task-input"); // get input box
const addTaskBtn = document.getElementById("add-task"); // get add button
const todosList = document.getElementById("todos-list"); // get list area
const itemsLeft = document.getElementById("items-left"); // get items count text
const clearCompletedBtn = document.getElementById("clear-completed"); // get clear button
const emptyState = document.querySelector(".empty-state"); // get empty state div
const dateElement = document.getElementById("date"); // get date element
const filters = document.querySelectorAll(".filter"); // get filter buttons

let todos = []; // store all tasks
let currentFilter = "all"; // current filter (all/active/completed)

addTaskBtn.addEventListener("click", () => { // when add button clicked
  addTodo(taskInput.value); // add new todo
});

taskInput.addEventListener("keydown", (e) => { // when typing in input
  if (e.key === "Enter") addTodo(taskInput.value); // add if Enter pressed
});

clearCompletedBtn.addEventListener("click", clearCompleted); // clear completed tasks

function addTodo(text) { // function to add todo
  if (text.trim() === "") return; // ignore empty text

  const todo = { // create todo object
    id: Date.now(), // unique id
    text, // todo text
    completed: false, // not done yet
  };

  todos.push(todo); // add to list
  saveTodos(); // save in storage
  renderTodos(); // show on page
  taskInput.value = ""; // clear input
}

function saveTodos() { // save tasks
  localStorage.setItem("todos", JSON.stringify(todos)); // save in browser storage
  updateItemsCount(); // update left items
  checkEmptyState(); // show/hide empty state
}

function updateItemsCount() { // count left tasks
  const uncompletedTodos = todos.filter((todo) => !todo.completed); // filter not done
  itemsLeft.textContent = `${uncompletedTodos?.length} item${ // show number
    uncompletedTodos?.length !== 1 ? "s" : "" // add 's' if more than 1
  } left`;
}

function checkEmptyState() { // check empty list
  const filteredTodos = filterTodos(currentFilter); // get current filter tasks
  if (filteredTodos?.length === 0) emptyState.classList.remove("hidden"); // show empty
  else emptyState.classList.add("hidden"); // hide empty
}

function filterTodos(filter) { // filter tasks
  switch (filter) {
    case "active": return todos.filter((todo) => !todo.completed); // only active
    case "completed": return todos.filter((todo) => todo.completed); // only completed
    default: return todos; // all
  }
}

function renderTodos() { // display tasks
  todosList.innerHTML = ""; // clear list
  const filteredTodos = filterTodos(currentFilter); // filter tasks

  filteredTodos.forEach((todo) => { // loop tasks
    const todoItem = document.createElement("li"); // create list item
    todoItem.classList.add("todo-item"); // add class
    if (todo.completed) todoItem.classList.add("completed"); // mark done

    const checkboxContainer = document.createElement("label"); // label for checkbox
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input"); // create checkbox
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed; // tick if done
    checkbox.addEventListener("change", () => toggleTodo(todo.id)); // toggle on change

    const checkmark = document.createElement("span"); // custom checkmark
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox); // put checkbox in label
    checkboxContainer.appendChild(checkmark);

    const todoText = document.createElement("span"); // task text
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    const deleteBtn = document.createElement("button"); // delete button
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>'; // cross icon
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id)); // delete on click

    todoItem.appendChild(checkboxContainer); // add checkbox
    todoItem.appendChild(todoText); // add text
    todoItem.appendChild(deleteBtn); // add delete
    todosList.appendChild(todoItem); // add to list
  });
}

function clearCompleted() { // remove completed tasks
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) { // toggle task status
  todos = todos.map((todo) => {
    if (todo.id === id) return { ...todo, completed: !todo.completed }; // flip status
    return todo;
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) { // delete one task
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function loadTodos() { // load from storage
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) todos = JSON.parse(storedTodos);
  renderTodos();
}

filters.forEach((filter) => { // for each filter button
  filter.addEventListener("click", () => { // when clicked
    setActiveFilter(filter.getAttribute("data-filter")); // set filter
  });
});

function setActiveFilter(filter) { // change filter
  currentFilter = filter;
  filters.forEach((item) => {
    if (item.getAttribute("data-filter") === filter) item.classList.add("active");
    else item.classList.remove("active");
  });
  renderTodos();
}

function setDate() { // show today’s date
  const options = { weekday: "long", month: "short", day: "numeric" };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

window.addEventListener("DOMContentLoaded", () => { // when page loads
  loadTodos(); // load saved tasks
  updateItemsCount(); // update count
  setDate(); // show date
});
