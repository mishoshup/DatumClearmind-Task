/* global bootstrap */

class TaskManager {
  constructor() {
    this.tasks = [];
    this.filter = "all";

    // DOM Elements
    this.taskList = document.getElementById("taskList");
    this.filterSelect = document.getElementById("filterSelect");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.loadingSpinner = document.getElementById("loadingSpinner");

    // Event Listeners
    this.filterSelect.addEventListener("change", (e) =>
      this.handleFilterChange(e),
    );
    this.refreshBtn.addEventListener("click", () => this.fetchTasks());

    // Initial fetch
    this.fetchTasks();
  }

  // Method for loading task from JSON
  async fetchTasks() {
    try {
      this.showLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
      );
      if (!response.ok) throw new Error("Network response was not ok");

      this.tasks = await response.json();
      this.renderTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      this.taskList.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load tasks. Please try again later.
                </div>
            `;
    } finally {
      // Ensure loading state is cleared regardless of success or failure
      this.showLoading(false);
    }
  }

  showLoading(isLoading) {
    // Toggle visibility classes based on loading state
    this.loadingSpinner.classList.toggle("d-none", !isLoading);
    this.taskList.classList.toggle("d-none", isLoading);
  }

  handleFilterChange(event) {
    this.filter = event.target.value;
    this.renderTasks();
  }

  // Changed simulateUpdateTask to async to handle actual API request
  async simulateUpdateTask(taskId, completed) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const updateTaskAPI = `https://jsonplaceholder.typicode.com/todos/${taskId}`;
      const requestDetails = {
        method: "PATCH",
        body: JSON.stringify({
          completed: completed, // Only send the changed property
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log("Simulated API Update:", updateTaskAPI, requestDetails);

      // Update local state and UI immediately before awaiting API call
      task.completed = completed;
      this.renderTasks();

      try {
        // Attempt to update the task via API call using PATCH
        const response = await fetch(updateTaskAPI, requestDetails);
        if (!response.ok) throw new Error("Failed to update task");
        // Note: No need to update state again since JSONPlaceholder doesn't persist changes
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  }

  renderTasks() {
    // Create a copy of tasks array to avoid modifying original data
    let filteredTasks = [...this.tasks];

    // Filter tasks based on current filter selection
    switch (this.filter) {
      case "completed":
        filteredTasks = filteredTasks.filter((task) => task.completed);
        break;
      case "incomplete":
        filteredTasks = filteredTasks.filter((task) => !task.completed);
        break;
    }

    // Generate HTML for each task and join into a single string
    this.taskList.innerHTML = filteredTasks
      .map(
        (task) => `
                <div class="list-group-item task-item d-flex justify-content-between align-items-center">
                    <div>
                        <input 
                            type="checkbox" 
                            class="form-check-input me-2" 
                            ${task.completed ? "checked" : ""} 
                            onchange="taskManager.simulateUpdateTask(${task.id}, this.checked)"
                        >
                        <span class="${task.completed ? "completed" : ""}">
                            ${task.title}
                        </span>
                    </div>
                    <button 
                        class="btn btn-sm btn-primary" 
                        onclick="taskManager.showTaskDetails(${task.id})"
                    >
                        Details
                    </button>
                </div>
            `,
      )
      .join("");
  }

  // Function for showing task details
  showTaskDetails(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const modalBody = document.getElementById("taskDetailsBody");
      // Populate modal with task details in a list format
      modalBody.innerHTML = `
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>ID:</strong> ${task.id}</li>
          <li class="list-group-item"><strong>Title:</strong> ${task.title}</li>
          <li class="list-group-item"><strong>Completed:</strong> ${task.completed ? "Yes" : "No"}</li>
          <li class="list-group-item"><strong>User ID:</strong> ${task.userId}</li>
        </ul>
      `;

      // Show Bootstrap modal using JavaScript API
      const modal = new bootstrap.Modal(
        document.getElementById("taskDetailsModal"),
      );
      modal.show();
    }
  }
}

// Initialize Task Manager
const taskManager = new TaskManager();
// Expose taskManager globally for inline event handlers
window.taskManager = taskManager;
