// DOM Elements -
const toggleThemeBtn = document.getElementById("theme-toggle");
const formEl = document.getElementById("todo-form"); 
const inputEl = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const filtersBtnsParentEl = document.querySelector(".filters");
const clearBtn = document.getElementById("clear-completed-btn");
const tasksLeftEl = document.getElementById("items-left");
const emptyStateEl = document.getElementById("no-tasks-state");
const taskListEl = document.getElementById("todo-list");
const taskItemTemplate = document.getElementById("task-item-template");

// Initial State
let tasks = JSON.parse(localStorage.getItem("myTodoTasks")) ?? [];
let isThemeDark = JSON.parse(localStorage.getItem("isThemeDark")) ?? false;
let currentFilter = "all";

switchTheme();
applyCurrentFilter();

// Switch Theme 
function switchTheme() {
   // switch to dark
   if (isThemeDark) {
      document.body.classList.add("dark-theme"); 
      toggleThemeBtn.querySelector("i").className = "fa-solid fa-sun";
   }
   // switch to light
   else {
      document.body.classList.remove("dark-theme"); 
      toggleThemeBtn.querySelector("i").className = "fa-solid fa-moon"
   }

   localStorage.setItem("isThemeDark", isThemeDark);
}

// Add Task 
function addTask(event) {
   // grab & validate input
   event.preventDefault();
   const inputText = inputEl.value.trim();
   if (inputText === "") return;

   // save the task to central source
   tasks.push({ 
      id: Date.now(), 
      text: inputText, 
      completed: false 
   });
   localStorage.setItem("myTodoTasks", JSON.stringify(tasks));

   applyCurrentFilter();

   // cleanup
   inputEl.value = "";
}

// Filter Tasks (all, active, completed)
function applyCurrentFilter() {
   let filteredTasks = [];

   if (currentFilter === "all") filteredTasks = tasks;
   else if (currentFilter === "active") filteredTasks = tasks.filter((item) => !item.completed);
   else filteredTasks = tasks.filter((item) => item.completed);
   
   renderTasks(filteredTasks);
}

function handleFilterBtns(event) {
   if (!event.target.classList.contains("filter-btn")) return;
  
   // get the filter option & filtered tasks, render it
   currentFilter = event.target.dataset.filter;
   applyCurrentFilter();

   // update active styling
   Array.from(filtersBtnsParentEl.children).forEach(btn => btn.classList.remove("active"));
   event.target.classList.add("active");
}

// Clear Completed Tasks
function clearCompletedTasks() {
   tasks = tasks.filter(item => !item.completed);
   localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
   applyCurrentFilter();
}


// Render Tasks 
function renderTasks(tasksToRender) {
   // handle list
   const fragment = document.createDocumentFragment();

   tasksToRender.forEach((item) => {
      const templateContent = taskItemTemplate.content.cloneNode(true);
      const li = templateContent.querySelector(".todo-item");

      li.dataset.id = item.id;                                   // id on the li
      li.querySelector(".todo-text").textContent = item.text;
      if (item.completed) li.classList.add("completed-state");

      fragment.append(templateContent);

   });

   taskListEl.innerHTML = "";
   taskListEl.append(fragment);

   // handle empty state
   let emptyMssg = "";

   if (currentFilter === "completed") emptyMssg = "No completed task"
   else if (currentFilter === "active") emptyMssg = "No active task"
   else emptyMssg = "No tasks yet";
   
   emptyStateEl.querySelector("h3").textContent = emptyMssg

   if (tasksToRender.length === 0) {
      emptyStateEl.classList.remove("hidden-layout");
   } else {
      emptyStateEl.classList.add("hidden-layout");
   }

   // handle task counter
   const tasksLeftCount = tasks.filter(item => !item.completed).length;
   tasksLeftEl.textContent = tasksLeftCount;
}

// Task Actions (done, delete, edit)
function handleActionBtns(event) {
   if (!event.target.closest(".action-btn")) return; // if neither the button nor the icon was clicked return

   // Get the task & action to perform
   const actionBtn = event.target.closest(".action-btn"); 
   const taskItem = actionBtn.closest(".todo-item");
   const taskId = Number(taskItem.dataset.id);
   const textEl = taskItem.querySelector(".todo-text");

   // 1. Done Action
   if (actionBtn.classList.contains("done-btn")) {
      tasks = tasks.map((item) => {
         if (item.id === taskId) item.completed = !item.completed;
         return item;
      });
      localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
      applyCurrentFilter();
   }

   // 2. Delete Action
   else if (actionBtn.classList.contains("delete-btn")) {
      tasks = tasks.filter((item) => item.id !== taskId);
      localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
      applyCurrentFilter();
   }

   // 3. Edit Action
   else {
      // Exit editing mode
      if (taskItem.classList.contains("is-editing")) {
         const newText = textEl.querySelector(".edit-input").value.trim();
         if (newText === "") return;
        
         tasks = tasks.map(item => {
            if (item.id === taskId) item.text = newText;
            return item;
         })
         taskItem.classList.remove("is-editing");

         localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
         applyCurrentFilter();
      }

      // Enter editing mode
      else { 
         taskItem.classList.add("is-editing");

         const editInput = document.createElement("input");
         editInput.type = "text";
         editInput.className = "edit-input";
         editInput.value = textEl.textContent;   // .value is safe, no HTML parsing

         textEl.textContent = "";
         textEl.append(editInput);

         actionBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
         editInput.focus();

         editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
               e.preventDefault();
               actionBtn.click();
            }
         });
      }
   }
}

// Event Listners
toggleThemeBtn.addEventListener("click", () => { 
   // toggle theme
   isThemeDark = !isThemeDark; 
   switchTheme(); 
});
formEl.addEventListener("submit", addTask);
filtersBtnsParentEl.addEventListener("click", handleFilterBtns);
clearBtn.addEventListener("click", clearCompletedTasks);
taskListEl.addEventListener("click", handleActionBtns);
