// DOM Elements
const taskInput = document.getElementById("task-input"); // input box for new todo
const addTaskBtn = document.getElementById("add-task"); // add button
const todosList = document.getElementById("todos-list"); // ul list of todos
const itemsLeft = document.getElementById("items-left"); // count of items left
const clearCompletedBtn = document.getElementById("clear-completed"); // clear completed button
const emptyState = document.querySelector(".empty-state"); // empty message
const dateElement = document.getElementById("data"); // date display
const filters = document.querySelectorAll(".filter"); // filter buttons

let todos = []; // stores list of todos (id, text, completed)
let currentFilter = "all"; // default filter is all

addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
}); // add todo when button clicked
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
}); // add todo when press Enter
clearCompletedBtn.addEventListener("click", clearCompleted); // clear completed todos

function addTodo(text) {
  if (text.trim() === "") return; // skip empty

  const todo = { id: Date.now(), text, completed: false }; // create todo object
  todos.push(todo); // add to array
  saveTodos(); // save to localStorage
  renderTodos(); // re-render
  taskInput.value = ""; // clear input
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos)); // save in localStorage
  updateItemsCount(); // update items left count
  checkEmptyState(); // check empty state
}

function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed); // filter active todos
  itemsLeft.textContent = `${uncompletedTodos.length} item${
    uncompletedTodos.length !== 1 ? "s" : ""
  } left`; // show count
}

function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter); // filter current todos
  if (filteredTodos.length === 0)
    emptyState.classList.remove("hidden"); // show empty msg
  else emptyState.classList.add("hidden"); // hide empty msg
}

function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed); // only active
    case "completed":
      return todos.filter((todo) => todo.completed); // only completed
    default:
      return todos; // all
  }
}

function renderTodos() {
  todosList.innerHTML = ""; // clear list
  const filteredTodos = filterTodos(currentFilter); // get filtered todos

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li"); // create li
    todoItem.classList.add("todo-item"); // add class
    if (todo.completed) todoItem.classList.add("completed"); // mark completed

    const checkbox = document.createElement("input"); // create checkbox
    checkbox.type = "checkbox"; // type checkbox
    checkbox.checked = todo.completed; // checked if completed
    checkbox.addEventListener("change", () => toggleTodo(todo.id)); // toggle on change

    const todoText = document.createElement("span"); // create span
    todoText.textContent = todo.text; // set text

    const deleteBtn = document.createElement("button"); // delete button
    deleteBtn.textContent = "×"; // set text
    deleteBtn.classList.add("delete-btn"); // add class
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id)); // delete on click

    todoItem.appendChild(checkbox); // add checkbox
    todoItem.appendChild(todoText); // add text
    todoItem.appendChild(deleteBtn); // add delete
    todosList.appendChild(todoItem); // append to list
  });
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed); // remove completed
  saveTodos(); // save
  renderTodos(); // re-render
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ); // toggle done
  saveTodos(); // save
  renderTodos(); // re-render
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id); // remove by id
  saveTodos(); // save
  renderTodos(); // re-render
}

function loadTodos() {
  const storedTodos = localStorage.getItem("todos"); // get from storage
  if (storedTodos) todos = JSON.parse(storedTodos); // parse
  renderTodos(); // re-render
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  }); // switch filter
});

function setActiveFilter(selectedFilter) {
  currentFilter = selectedFilter; // set current
  filters.forEach((item) => {
    item.getAttribute("data-filter") === selectedFilter
      ? item.classList.add("active")
      : item.classList.remove("active");
  }); // update ui
  renderTodos(); // re-render
}

function setData() {
  const options = { weekday: "long", month: "short", day: "numeric" }; // format
  const today = new Date(); // current date
  dateElement.textContent = today.toLocaleDateString("en-US", options); // display date
}

window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateItemsCount();
  setData();
}); // init app
