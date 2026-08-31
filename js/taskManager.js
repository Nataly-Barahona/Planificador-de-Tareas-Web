class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, status) {
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
            status: "PORHACER",
            createdAt: createdAt
        };

        this.tasks.push(task);

        return task;
    }
}