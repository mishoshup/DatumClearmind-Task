# Simple Task Manager with External Data Source

This is a simple Task Manager web application built as part of the assessment for **DatumClearmind**. The application allows users to view and manage a list of tasks by fetching data from the **JSONPlaceholder API** (a fake online REST API for testing and prototyping).

## Features

- **Fetch tasks**: The app fetches tasks from the JSONPlaceholder API and displays them in a list format.
- **Task completion**: Users can mark tasks as completed. The action is simulated by sending a PUT request to the `/todos/{id}` endpoint, and the update is reflected in the UI.
- **Filtering**: Users can filter tasks to view "All Tasks," "Completed Tasks," or "Incomplete Tasks."
- **Task details**: Users can view details of a task by clicking the "Details" button.

### Requirements

1. **Integration with a REST API**:

   - Uses the `/todos` endpoint from JSONPlaceholder to fetch tasks.
   - The app allows users to view tasks and update their completion status by simulating a PUT request.

2. **Data Management**:

   - Users can mark tasks as "completed."
   - The app simulates an API update by logging the PUT request details in the console.
   - Filters tasks by their completion status.

3. **User Interface (Basic)**:

   - Tasks are displayed with a checkbox indicating whether they are completed.
   - A dropdown allows users to filter tasks based on their completion status.
   - A "Details" button opens a modal with more information about each task.

4. **Code Quality**:

   - Clean and readable JavaScript code.
   - Proper error handling when fetching data from the API.
   - The code utilizes modern JavaScript features (ES6+).

5. **Bonus Challenges (Optional)**:
   - **Refresh**: A button that allows users to refresh the task list.
   - **Task details**: When a task is clicked, a modal displays its details (ID, Title, Completed status, and User ID).
   - **Loading state**: A spinner is shown while data is being fetched.

---

## Files

- **index.html**: The main HTML structure of the app.
- **styles.css**: Basic styling for the task list and modal.
- **script.js**: JavaScript code for fetching tasks, handling task updates, filtering tasks, and showing task details.

---

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/mishoshup/DatumClearmind-Task.git
   ```

2. Navigate to the project directory:

   ```bash
   cd DatumClearmind-Task
   ```

3. Open the `index.html` file in your browser:

   ```bash
   open index.html
   ```

4. Alternatively, run a local server (if you have Node.js installed) using:
   ```bash
   npm install
   npm start
   ```

---

## Features in Action

### Task List with Filters

The main UI displays a list of tasks with checkboxes that indicate whether the task is completed. Users can use the dropdown to filter the tasks by their completion status.

### Task Completion

When a user clicks the checkbox, the task's completed status is updated. While it does not actually update the JSONPlaceholder API (since it's a mock API), the action is simulated, and the task's status is updated in the UI.

### Task Details Modal

Clicking on the "Details" button next to a task will open a modal displaying the task's details, including the task's ID, title, completion status, and user ID.

### Loading State

When the tasks are being fetched from the API, a spinner is displayed to indicate that the data is loading.

---

## Evaluation Criteria

The following aspects of the assessment are considered for evaluation:

1. **Correctness**: Does the application correctly fetch data and simulate updates to the task list? Does the filtering work as expected?
2. **Code Structure and Organization**: Is the code modular, well-structured, and easy to understand?
3. **API Integration**: Is the interaction with the JSONPlaceholder API implemented correctly?
4. **Data Handling**: Is the task data handled effectively on the client-side?
5. **User Interface**: Is the UI functional and intuitive?
6. **Error Handling**: Are network or API errors handled gracefully?
7. **JavaScript Proficiency**: Does the code demonstrate proficiency in modern JavaScript?

---

## Notes

- The task update process is simulated via logging the PUT request details to the console. The JSONPlaceholder API does not persist data, so updates will not be saved.
- The app uses **Bootstrap** for styling, so ensure that the necessary CSS and JS files are loaded correctly.
