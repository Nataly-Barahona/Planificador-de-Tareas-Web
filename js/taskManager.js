class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, status) {
        this.currentId++;

        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: 'PORHACER'
        });
        taskManager.addTask(
            name,
            description,
            dueDate,
            status
        );
        newTaskForm.reset();
    }

}