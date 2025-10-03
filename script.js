
    let tasks = [
      { id: 1, name: "Task 1", status: "pending" },
      { id: 2, name: "Task 2", status: "done" },
      { id: 3, name: "Task 3", status: "pending" }
    ];

    let currentEditId = null;
    let currentDeleteId = null;
 
    function renderTasks(filteredTasks = tasks) {
      const tbody = document.getElementById("taskTableBody");
      const noResults = document.getElementById("noResults");

      if (filteredTasks.length === 0) {
        tbody.innerHTML = "";
        noResults.classList.remove("d-none");
        return;
      }

      noResults.classList.add("d-none");

      tbody.innerHTML = filteredTasks.map(task => `
        <tr>
          <td><strong>#${task.id}</strong></td>
          <td>${task.name}</td>
          <td>
            <span>
              ${task.status}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-primary btn-sm me-2" onclick="editTask(${task.id})">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        </tr>
      `).join("");
    }
 
    function toggleAddForm() {
      const form = document.getElementById("addFormContainer");
      form.style.display = form.style.display === "none" ? "block" : "none";
    }
 
    function saveAdd() {
      const name = document.getElementById("addTaskName").value.trim();
      const status = document.getElementById("addTaskStatus").value;

      if (!name) {
        alert("Task name cannot be empty!");
        return;
      }

      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

      tasks.push({ id: newId, name, status });
      renderTasks();
 
      document.getElementById("addTaskName").value = "";
      document.getElementById("addTaskStatus").value = "pending";
      toggleAddForm();
    }
 
    function editTask(id) {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      currentEditId = id;
      document.getElementById("editTaskId").value = id;
      document.getElementById("editTaskName").value = task.name;
      document.getElementById("editTaskStatus").value = task.status;

      const modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
      modal.show();
    }
 
    function saveEdit() {
      const id = parseInt(document.getElementById("editTaskId").value);
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newName = document.getElementById("editTaskName").value.trim();
      const newStatus = document.getElementById("editTaskStatus").value;

      if (!newName) {
        alert("Task name cannot be empty!");
        return;
      }
      if (newStatus !== "pending" && newStatus !== "done") {
        alert("Status must be 'pending' or 'done'!");
        return;
      }

      task.name = newName;
      task.status = newStatus;
      renderTasks();

      const modal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
      modal.hide();
    }
 
    function deleteTask(id) {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      currentDeleteId = id;
      document.getElementById("deleteTaskName").textContent = task.name;

      const modal = new bootstrap.Modal(document.getElementById("deleteTaskModal"));
      modal.show();
    }
 
    function confirmDelete() {
      tasks = tasks.filter(t => t.id !== currentDeleteId);
      renderTasks();

      const modal = bootstrap.Modal.getInstance(document.getElementById("deleteTaskModal"));
      modal.hide();
    }
 
    document.getElementById("searchInput").addEventListener("input", function(e) {
      const term = e.target.value.toLowerCase();
      const filtered = tasks.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.status.toLowerCase().includes(term) ||
        t.id.toString().includes(term)
      );
      renderTasks(filtered);
    });

    renderTasks();