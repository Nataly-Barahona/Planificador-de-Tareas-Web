class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, status, priority) {
        this.currentId++;

        const creationDate = new Date();
        const createdAt = [
            creationDate.getFullYear(),
            String(creationDate.getMonth() + 1).padStart(2, "0"),
            String(creationDate.getDate()).padStart(2, "0")
        ].join("-");

        const task = {
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: status || "POR HACER",
            priority: priority,
            createdAt: createdAt
        };

        this.tasks.push(task);
        this.save();
        return task;
    }
    deleteTask(taskId) {
        const newTasks = [];
        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }
        this.tasks = newTasks;
        this.save();
    }
    getTaskById(taskId) {
        let foundTask;
        for (let task of this.tasks) {
            if (task.id === taskId) {
                foundTask = task;
            }
        }
        return foundTask;
    }

    createTaskHtml(id, name, description, dueDate, status, priority) {
        const html = `
            <div class="col-md-6 col-xl-4 task-column">
                <article class="card task-card h-100 shadow-sm" data-task-id="${id}" data-due-date="${dueDate}">
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title h5">${name}</h3>
                        <p class="card-text flex-grow-1">${description}</p>
                        <dl class="task-details mb-3">
                            <div>
                                <dt>Fecha de entrega</dt>
                                <dd class="task-due-date">${dueDate}</dd>
                            </div>
                            <div>
                                <dt>Estado</dt>
                                <dd><span class="badge status-badge bg-warning text-dark">${status}</span></dd>
                            </div>
                        </dl>
                        <button type="button" class="btn btn-outline-success btn-completar mb-2" aria-pressed="false">
                            <i class="icon ion-md-checkmark" aria-hidden="true"></i>
                            Marcar como completada
                        </button>
                        <button type="button" class="delete-button btn btn-danger btn-sm">
                            <i class="icon ion-md-trash" aria-hidden="true"></i>
                            Eliminar
                        </button>
                    </div>
                </article>
            </div>
        `;
        return html;
    }

    render() {
        let tasksHtmlList = [];
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            const taskHtml = this.createTaskHtml(
                task.id,
                task.name,
                task.description,
                task.dueDate,
                task.status
            );
            tasksHtmlList.push(taskHtml);
        }
        const tasksHtml = tasksHtmlList.join('\n');
        const tasksList = document.querySelector('#tasksList');
        if (tasksList) {
            tasksList.innerHTML = tasksHtml;
        }
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        localStorage.setItem("currentId", String(this.currentId));
    }

    load() {
        const tasksJson = localStorage.getItem("tasks");
        if (tasksJson) {
            this.tasks = JSON.parse(tasksJson);
        }

        const currentIdJson = localStorage.getItem("currentId");
        if (currentIdJson) {
            this.currentId = Number(currentIdJson);
        }
    }
}