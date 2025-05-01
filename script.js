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
      this.showLoading(false);
    }
  }

  showLoading(isLoading) {
    this.loadingSpinner.classList.toggle("d-none", !isLoading);
    this.taskList.classList.toggle("d-none", isLoading);
  }

  handleFilterChange(event) {
    this.filter = event.target.value;
    this.renderTasks();
  }

  simulateUpdateTask(taskId, completed) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      // Simulate PUT request
      const requestDetails = {
        method: "PUT",
        url: `https://jsonplaceholder.typicode.com/todos/${taskId}`,
        body: JSON.stringify({
          ...task,
          completed: completed,
        }),
      };

      console.log("Simulated API Update:", requestDetails);

      // Update local data
      task.completed = completed;
      this.renderTasks();
    }
  }

  renderTasks() {
    let filteredTasks = [...this.tasks];

    switch (this.filter) {
      case "completed":
        filteredTasks = filteredTasks.filter((task) => task.completed);
        break;
      case "incomplete":
        filteredTasks = filteredTasks.filter((task) => !task.completed);
        break;
    }

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

  showTaskDetails(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      alert(`
                Task Details:
                ID: ${task.id}
                Title: ${task.title}
                Completed: ${task.completed ? "Yes" : "No"}
                User ID: ${task.userId}
            `);
    }
  }
}

// Initialize Task Manager
const taskManager = new TaskManager();
window.taskManager = taskManager;
