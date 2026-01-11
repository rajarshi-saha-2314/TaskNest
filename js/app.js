const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const app = document.querySelector(".app");

/* ================= DARK MODE ================= */

const toggleDiv = document.createElement("div");
toggleDiv.className = "toggle";
const toggleBtn = document.createElement("button");
toggleDiv.appendChild(toggleBtn);
app.insertBefore(toggleDiv, document.querySelector(".input-box"));

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️ Light Mode";
} else {
  toggleBtn.textContent = "🌙 Dark Mode";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark") ? "enabled" : "disabled"
  );
  toggleBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

/* ================= COUNTER ================= */

const counter = document.createElement("div");
counter.className = "counter";
app.insertBefore(counter, document.querySelector(".input-box"));

/* ================= EVENTS ================= */

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

document.addEventListener("DOMContentLoaded", loadTasks);

/* ================= TASK FUNCTIONS ================= */

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  createTask(text, false);
  saveTasks();
  updateCounter();

  taskInput.value = "";
}

function createTask(text, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;

  const actions = document.createElement("div");
  actions.className = "actions";

  /* ✅ COMPLETE */
  const checkIcon = document.createElement("img");
  checkIcon.src = "assets/icons/check.png";
  checkIcon.alt = "Complete";

  checkIcon.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
    updateCounter();
  });

  /* ✏️ EDIT */
  const editIcon = document.createElement("img");
  editIcon.src = "assets/icons/edit.png";
  editIcon.alt = "Edit";

  editIcon.addEventListener("click", () => {
    startEdit(li, span);
  });

  /* 🗑 DELETE */
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "assets/icons/delete.png";
  deleteIcon.alt = "Delete";

  deleteIcon.addEventListener("click", () => {
    li.classList.add("removing");
    setTimeout(() => {
      li.remove();
      saveTasks();
      updateCounter();
    }, 300);
  });

  actions.append(checkIcon, editIcon, deleteIcon);
  li.append(span, actions);
  taskList.appendChild(li);
}

/* ================= EDIT LOGIC ================= */

function startEdit(li, span) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "edit-input";

  li.replaceChild(input, span);
  input.focus();

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") finishEdit(li, input);
  });

  input.addEventListener("blur", () => {
    finishEdit(li, input);
  });
}

function finishEdit(li, input) {
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = input.value.trim() || "Untitled task";

  li.replaceChild(span, input);
  saveTasks();
}

/* ================= LOCAL STORAGE ================= */

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTask(task.text, task.completed));
  updateCounter();
}

/* ================= COUNTER ================= */

function updateCounter() {
  const total = document.querySelectorAll("li").length;
  const completed = document.querySelectorAll("li.completed").length;
  const pending = total - completed;

  counter.textContent = `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}
