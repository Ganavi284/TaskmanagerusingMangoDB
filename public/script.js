const API_URL = "/tasks";
let currentEditId = null;

// Load tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  
  // Allow Enter key to submit form
  document.getElementById("title").addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  });
});

async function loadTasks() {
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("emptyState");
  const tasksContainer = document.getElementById("tasksContainer");
  const taskCount = document.getElementById("taskCount");

  loading.style.display = "block";
  emptyState.style.display = "none";
  tasksContainer.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load tasks");
    
    const tasks = await res.json();
    
    loading.style.display = "none";
    
    if (tasks.length === 0) {
      emptyState.style.display = "block";
      taskCount.textContent = "0 tasks";
    } else {
      taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
      
      tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksContainer.appendChild(taskCard);
      });
    }
  } catch (error) {
    loading.style.display = "none";
    showNotification("Error loading tasks: " + error.message, "error");
  }
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = `task-card ${task.status === "Completed" ? "completed" : ""}`;
  card.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${escapeHtml(task.title)}</h3>
    </div>
    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
    <div class="task-footer">
      <select onchange="updateStatus('${task._id}', this.value)" class="status-select">
        <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>⏳ Pending</option>
        <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>🔄 In Progress</option>
        <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>✅ Completed</option>
      </select>
      <div class="task-actions">
        <button class="btn btn-edit" onclick="openEditModal('${task._id}')">
          ✏️ Edit
        </button>
        <button class="btn btn-delete" onclick="deleteTask('${task._id}')">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;
  return card;
}

async function addTask() {
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showNotification("Title is required!", "error");
    titleInput.focus();
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });

    if (!res.ok) {
      const error = await res.json();
      showNotification(error.message || "Error creating task", "error");
      return;
    }

    // Clear form
    titleInput.value = "";
    descriptionInput.value = "";
    titleInput.focus();
    
    showNotification("Task created successfully!", "success");
    loadTasks();
  } catch (error) {
    showNotification("Error: " + error.message, "error");
  }
}

async function openEditModal(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to load task");
    
    const task = await res.json();
    currentEditId = id;
    
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description || "";
    
    const modal = document.getElementById("editModal");
    modal.classList.add("show");
    document.getElementById("editTitle").focus();
  } catch (error) {
    showNotification("Error loading task: " + error.message, "error");
  }
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.classList.remove("show");
  currentEditId = null;
  document.getElementById("editForm").reset();
}

async function saveTask() {
  if (!currentEditId) return;
  
  const title = document.getElementById("editTitle").value.trim();
  const description = document.getElementById("editDescription").value.trim();

  if (!title) {
    showNotification("Title is required!", "error");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });

    if (!res.ok) {
      const error = await res.json();
      showNotification(error.message || "Error updating task", "error");
      return;
    }

    closeEditModal();
    showNotification("Task updated successfully!", "success");
    loadTasks();
  } catch (error) {
    showNotification("Error: " + error.message, "error");
  }
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const error = await res.json();
      showNotification(error.message || "Error updating status", "error");
      loadTasks(); // Reload to revert status
      return;
    }

    loadTasks();
  } catch (error) {
    showNotification("Error: " + error.message, "error");
    loadTasks(); // Reload to revert status
  }
}

async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    
    if (!res.ok) {
      throw new Error("Failed to delete task");
    }

    showNotification("Task deleted successfully!", "success");
    loadTasks();
  } catch (error) {
    showNotification("Error deleting task: " + error.message, "error");
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = "info") {
  // Remove existing notification
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 2000;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.3s ease;
  `;

  if (type === "success") {
    notification.style.background = "#10b981";
  } else if (type === "error") {
    notification.style.background = "#ef4444";
  } else {
    notification.style.background = "#6366f1";
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Close modal when clicking outside
document.getElementById("editModal").addEventListener("click", (e) => {
  if (e.target.id === "editModal") {
    closeEditModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeEditModal();
  }
});
