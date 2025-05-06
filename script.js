/* global bootstrap */

class TaskManager {
  constructor() {
    // Initialize task state and filter mode ("all", "completed", "incomplete")
    this.tasks = [];
    this.filter = "all";

    // Initialize the taskMap, initially empty
    this.taskMap = {};

    // Cache commonly used DOM elements for performance and clarity
    this.taskList = document.getElementById("taskList");
    this.filterSelect = document.getElementById("filterSelect");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.loadingSpinner = document.getElementById("loadingSpinner");

    // Bind event listeners to relevant controls

    // Dropdown to filter tasks by status (all/completed/incomplete)
    this.filterSelect.addEventListener("change", (e) =>
      this.handleFilterChange(e),
    );

    // Button to manually refresh/fetch tasks again from API
    this.refreshBtn.addEventListener("click", () => this.fetchTasks());

    // Event delegation for task checkbox toggles
    // This allows us to listen for changes on any future dynamically rendered checkbox
    this.taskList.addEventListener("change", (e) => {
      const checkbox = e.target.closest(".task-checkbox");
      if (checkbox) {
        const taskId = Number(checkbox.dataset.taskId);
        this.simulateUpdateTask(taskId, checkbox.checked);
      }
    });

    // Event delegation for "Details" button clicks inside each task item
    this.taskList.addEventListener("click", (e) => {
      const detailsBtn = e.target.closest(".task-details-btn");
      if (detailsBtn) {
        const taskId = Number(detailsBtn.dataset.taskId);
        this.showTaskDetails(taskId);
      }
    });

    // Fetch initial task data on page load
    this.fetchTasks();
  }

  /**
   * Fetches task data from the JSONPlaceholder API and stores it in local state.
   * Also handles loading state and error reporting to the user.
   */
  async fetchTasks() {
    try {
      this.showLoading(true);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
      );
      if (!response.ok) throw new Error("Network response was not ok");

      // Update internal task list with data from API
      this.tasks = await response.json();

      // Update the taskMap when tasks are fetched
      this.taskMap = this.tasks.reduce((map, task) => {
        map[task.id] = task;
        return map;
      }, {});

      // Render tasks to the UI based on current filter
      this.renderTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      this.taskList.innerHTML = `
        <div class="alert alert-danger">
          Failed to load tasks. Please try again later.
        </div>
      `;
    } finally {
      // Always stop showing the spinner after request completes
      this.showLoading(false);
    }
  }

  /**
   * Toggles loading spinner and hides/shows task list accordingly.
   * Helps indicate to the user when data is being loaded.
   * @param {boolean} isLoading
   */
  showLoading(isLoading) {
    this.loadingSpinner.classList.toggle("d-none", !isLoading);
    this.taskList.classList.toggle("d-none", isLoading);
  }

  /**
   * Updates the internal filter state when the dropdown changes,
   * then re-renders tasks accordingly.
   * @param {Event} event
   */
  handleFilterChange(event) {
    this.filter = event.target.value;
    this.renderTasks();
  }

  /**
   * Simulates updating a task's `completed` status both in UI and by sending a PATCH request.
   * This is an "optimistic update" — we update the UI immediately, even before API confirms success.
   * @param {number} taskId - ID of the task to update
   * @param {boolean} completed - New completed state
   */
  async simulateUpdateTask(taskId, completed) {
    const task = this.taskMap[taskId];
    if (task) {
      const updateTaskAPI = `https://jsonplaceholder.typicode.com/todos/${taskId}`;
      const requestDetails = {
        method: "PATCH",
        body: JSON.stringify({ completed }),
        headers: { "Content-Type": "application/json" },
      };

      // Log simulated API request (since JSONPlaceholder won’t actually save it)
      console.log("Simulated API Update:", updateTaskAPI, requestDetails);

      // Optimistic UI update: assume success and update UI immediately
      // This is to improve perceived performance
      // We update the UI first, and if the API fails, we revert the change
      const originalUIState = task.completed;
      task.completed = completed;
      this.renderTasks();

      try {
        const response = await fetch(updateTaskAPI, requestDetails);
        if (!response.ok) throw new Error("Failed to update task");
      } catch (error) {
        console.error("Error updating task:", error);
        // Revert UI state if API call fails
        task.completed = originalUIState;
        this.renderTasks();
      }
    }
  }

  /**
   * Renders the list of tasks in the DOM, based on the current filter state.
   * It generates HTML dynamically and injects it into the task list container.
   */
  renderTasks() {
    let filteredTasks = [...this.tasks];

    // Apply current filter to the task list
    switch (this.filter) {
      case "completed":
        filteredTasks = filteredTasks.filter((task) => task.completed);
        break;
      case "incomplete":
        filteredTasks = filteredTasks.filter((task) => !task.completed);
        break;
      case "all":
        // No filtering needed
        break;
      default:
        console.warn("Unknown filter type:", this.filter);
        // Default case: no filter applied
        // filteredTasks already contains all tasks
        break;
    }

    // Build the HTML output for each task dynamically
    this.taskList.innerHTML = filteredTasks
      .map(
        (task) => `
          <div class="list-group-item task-item d-flex justify-content-between align-items-center">
            <div class="d-flex gap-2 align-items-center">
              <input 
                type="checkbox" 
                class="form-check-input task-checkbox"
                data-task-id="${task.id}"
                ${task.completed ? "checked" : ""}
              >
              <label class="form-check-label ${task.completed ? "completed" : ""}">
                ${task.title}
              </label>
            </div>
            <button 
              class="btn btn-sm btn-outline-primary task-details-btn" 
              data-task-id="${task.id}"
            >
              Details
            </button>
          </div>
        `,
      )
      .join("");
  }

  /**
   * Opens a Bootstrap modal displaying full task details.
   * Useful for debugging or showing extended info.
   * @param {number} taskId
   */
  showTaskDetails(taskId) {
    // Find the task by ID in the map
    // This is more efficient than searching through the array
    // especially for larger datasets
    const task = this.taskMap[taskId];

    // If task is found, populate the modal with its details
    if (task) {
      const modalBody = document.getElementById("taskDetailsBody");

      modalBody.innerHTML = `
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>ID:</strong> ${task.id}</li>
          <li class="list-group-item"><strong>Title:</strong> ${task.title}</li>
          <li class="list-group-item"><strong>Completed:</strong> ${
            task.completed ? "Yes" : "No"
          }</li>
          <li class="list-group-item"><strong>User ID:</strong> ${
            task.userId
          }</li>
        </ul>
      `;

      // Bootstrap 5 modal API
      const modal = new bootstrap.Modal(
        document.getElementById("taskDetailsModal"),
      );
      modal.show();
    }
  }
}

// Initialize the app
const taskManager = new TaskManager();
// Expose taskManager globally for inline event handlers
window.taskManager = taskManager;
