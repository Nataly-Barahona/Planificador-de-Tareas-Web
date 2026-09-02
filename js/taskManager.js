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