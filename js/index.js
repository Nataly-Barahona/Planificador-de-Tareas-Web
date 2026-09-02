const newTaskForm = document.querySelector("#newTaskForm");
const newTaskNameInput = document.querySelector("#newTaskNameInput");
const newTaskDescriptionInput = document.querySelector("#newTaskDescriptionInput");
const newTaskDueDateInput = document.querySelector("#newTaskDueDateInput");
const newTaskStatusInput = document.querySelector("#newTaskStatusInput");
const mensajeError = document.querySelector("#mensajeError");
const mensajeExito = document.querySelector("#mensajeExito");
const taskContainer = document.querySelector("#contenedorTareas");
const taskCountBadge = document.querySelector("#taskCountBadge");
const taskFilterButtons = document.querySelectorAll(".task-filter");
const plannerView = document.querySelector("#plannerView");
const calendarView = document.querySelector("#calendarView");
const newTaskNavLink = document.querySelector("#newTaskNavLink");
const taskListNavLink = document.querySelector("#taskListNavLink");
const calendarNavLink = document.querySelector("#calendarNavLink");
const previousMonthButton = document.querySelector("#previousMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const todayButton = document.querySelector("#todayButton");
const currentMonthLabel = document.querySelector("#currentMonthLabel");
const calendarGrid = document.querySelector("#calendarGrid");
const selectedDateLabel = document.querySelector("#selectedDateLabel");
const calendarTaskList = document.querySelector("#calendarTaskList");
const newTaskPriorityInput = document.querySelector("#newTaskPriorityInput");

const taskManager = new TaskManager();
taskManager.load();
const currentDate = new Date();
let visibleMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let selectedDateKey = getLocalDateKey(currentDate);
let currentTaskFilter = "all";


const menuToggle = document.querySelector("#menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar-open");
});



console.log(taskManager.tasks);

registerExampleTasks();

function validFormFieldInput(data) {
    if (!data) {
        return false;
    }

    const nameIsValid =
        typeof data.name === "string" &&
        data.name.trim() !== "";

    const descriptionIsValid =
        typeof data.description === "string" &&
        data.description.trim() !== "";

    const dueDateIsValid =
        typeof data.dueDate === "string" &&
        data.dueDate !== "" &&
        !Number.isNaN(Date.parse(`${data.dueDate}T00:00:00`));

    const statusIsValid =
        typeof data.status === "string" &&
        data.status !== "";

    const priorityIsValid =
        typeof data.priority === "string" &&
        data.priority !== "";

    return (
        nameIsValid &&
        descriptionIsValid &&
        dueDateIsValid &&
        statusIsValid &&
        priorityIsValid
    );
}

function getLocalDateKey(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}

function getDateFromKey(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatFullDate(dateKey) {
    return new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(getDateFromKey(dateKey));
}

function formatDueDate(dateKey) {
    return new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(getDateFromKey(dateKey));
}

function setActiveNavigation(activeLink) {
    [newTaskNavLink, taskListNavLink, calendarNavLink].forEach(function (link) {
        const isActive = link === activeLink;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function showPlannerSection(targetSelector, activeLink) {
    calendarView.classList.add("d-none");
    plannerView.classList.remove("d-none");
    setActiveNavigation(activeLink);

    const target = document.querySelector(targetSelector);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showCalendarView() {
    plannerView.classList.add("d-none");
    calendarView.classList.remove("d-none");
    setActiveNavigation(calendarNavLink);
    renderCalendar();
    calendarView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createCalendarDay(day, dateKey) {
    const dayTasks = taskManager.tasks.filter(function (task) {
        return task.dueDate === dateKey;
    });
    const dayButton = document.createElement("button");
    const dayNumber = document.createElement("span");

    dayButton.type = "button";
    dayButton.className = "calendar-day";
    dayButton.dataset.date = dateKey;
    dayButton.setAttribute("role", "gridcell");
    dayButton.setAttribute(
        "aria-label",
        `${formatFullDate(dateKey)}. ${dayTasks.length} ${dayTasks.length === 1 ? "tarea" : "tareas"}.`
    );

    dayNumber.className = "calendar-day__number";
    dayNumber.textContent = String(day);
    dayButton.append(dayNumber);

    if (dateKey === getLocalDateKey(new Date())) {
        dayButton.classList.add("is-today");
    }

    if (dateKey === selectedDateKey) {
        dayButton.classList.add("is-selected");
        dayButton.setAttribute("aria-selected", "true");
    }

    if (dayTasks.length > 0) {
        const taskCount = document.createElement("span");
        taskCount.className = "calendar-day__count";
        taskCount.textContent = `${dayTasks.length} ${dayTasks.length === 1 ? "tarea" : "tareas"}`;
        dayButton.classList.add("has-tasks");
        dayButton.append(taskCount);
    }

    dayButton.addEventListener("click", function () {
        selectedDateKey = dateKey;
        renderCalendar();
    });

    return dayButton;
}

function renderTasksForSelectedDate() {
    const tasksForDate = taskManager.tasks.filter(function (task) {
        return task.dueDate === selectedDateKey;
    });

    selectedDateLabel.textContent = formatFullDate(selectedDateKey);
    calendarTaskList.replaceChildren();

    if (tasksForDate.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "calendar-empty-state";
        emptyState.textContent = "No se crearon tareas durante este día.";
        calendarTaskList.append(emptyState);
        return;
    }

    tasksForDate.forEach(function (task) {
        const taskItem = document.createElement("article");
        const taskTitle = document.createElement("h3");
        const taskDescription = document.createElement("p");
        const taskMeta = document.createElement("div");
        const dueDateBadge = document.createElement("span");
        const statusBadge = document.createElement("span");

        taskItem.className = "calendar-task-item";
        taskTitle.textContent = task.name;
        taskDescription.textContent = task.description;
        taskMeta.className = "calendar-task-item__meta";
        dueDateBadge.className = "badge text-bg-light";
        dueDateBadge.textContent = `Creada: ${formatDueDate(task.createdAt)}`;
        statusBadge.className = "badge bg-warning text-dark";
        statusBadge.textContent = task.status === "PORHACER" ? "Por hacer" : task.status;

        taskMeta.append(dueDateBadge, statusBadge);
        taskItem.append(taskTitle, taskDescription, taskMeta);
        calendarTaskList.append(taskItem);
    });
}

function renderCalendar() {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    currentMonthLabel.textContent = new Intl.DateTimeFormat("es-CO", {
        month: "long",
        year: "numeric"
    }).format(visibleMonth);

    calendarGrid.replaceChildren();

    for (let blankIndex = 0; blankIndex < firstWeekday; blankIndex++) {
        const emptyDay = document.createElement("span");
        emptyDay.className = "calendar-day--empty";
        emptyDay.setAttribute("aria-hidden", "true");
        calendarGrid.append(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        calendarGrid.append(createCalendarDay(day, getLocalDateKey(date)));
    }

    renderTasksForSelectedDate();
}

function changeVisibleMonth(offset) {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);

    const today = new Date();
    const visibleMonthIsCurrent = visibleMonth.getFullYear() === today.getFullYear()
        && visibleMonth.getMonth() === today.getMonth();
    selectedDateKey = visibleMonthIsCurrent
        ? getLocalDateKey(today)
        : getLocalDateKey(visibleMonth);

    renderCalendar();
}

function registerExampleTasks() {
    taskContainer.querySelectorAll(".task-card").forEach(function (taskCard) {
        const task = taskManager.addTask(
            taskCard.querySelector(".card-title").textContent.trim(),
            taskCard.querySelector(".card-text").textContent.trim(),
            taskCard.dataset.dueDate,
            "PORHACER"
        );

        taskCard.dataset.taskId = String(task.id);
    });

    updateTaskCount();
    console.log(taskManager.tasks);
}
function createTaskCard(task) {
    const taskColumn = document.createElement("div");
    taskColumn.className = "col-md-6 col-xl-4 task-column";
    taskColumn.innerHTML = `
        <article class="card task-card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
                <h3 class="card-title h5"></h3>
                <p class="card-text flex-grow-1"></p>
                <dl class="task-details mb-3">
                    <div>
                        <dt>Fecha de entrega</dt>
                        <dd class="task-due-date"></dd>
                    </div>
                    <div>
                        <dt>Estado</dt>
                        <dd><span class="badge status-badge bg-warning text-dark">Pendiente</span></dd>
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
    `;

    const taskCard = taskColumn.querySelector(".task-card");
    taskCard.dataset.taskId = String(task.id);
    taskCard.dataset.dueDate = task.dueDate;
    taskCard.querySelector(".card-title").textContent = task.name;
    taskCard.querySelector(".card-text").textContent = task.description;
    taskCard.querySelector(".task-due-date").textContent = formatDueDate(task.dueDate);

    return taskColumn;
}

function updateTaskCount() {
    const totalTasks = taskManager.tasks.length;
    taskCountBadge.textContent = `${totalTasks} ${totalTasks === 1 ? "tarea" : "tareas"}`;
}

function applyTaskFilter() {
    taskContainer.querySelectorAll(".task-column").forEach(function (taskColumn) {
        const isCompleted = taskColumn.querySelector(".task-card").classList.contains("task-completed");
        const shouldShow = currentTaskFilter === "all"
            || (currentTaskFilter === "completed" && isCompleted)
            || (currentTaskFilter === "pending" && !isCompleted);

        taskColumn.classList.toggle("d-none", !shouldShow);
    });
}

function updateTaskCardStatus(button) {
    const taskCard = button.closest(".task-card");
    const statusBadge = taskCard.querySelector(".status-badge");
    const isCompleted = taskCard.classList.toggle("task-completed");
    const taskId = Number(taskCard.dataset.taskId);
    const task = taskManager.tasks.find(function (storedTask) {
        return storedTask.id === taskId;
    });

    button.setAttribute("aria-pressed", String(isCompleted));
    button.classList.toggle("btn-outline-success", !isCompleted);
    button.classList.toggle("btn-outline-secondary", isCompleted);

    statusBadge.classList.toggle("bg-warning", !isCompleted);
    statusBadge.classList.toggle("text-dark", !isCompleted);
    statusBadge.classList.toggle("bg-success", isCompleted);

    if (isCompleted) {
        statusBadge.textContent = "Completada";
        button.innerHTML = '<i class="icon ion-md-undo" aria-hidden="true"></i> Marcar como pendiente';
    } else {
        statusBadge.textContent = "Pendiente";
        button.innerHTML = '<i class="icon ion-md-checkmark" aria-hidden="true"></i> Marcar como completada';
    }

    if (task) {
        task.status = isCompleted ? "COMPLETADA" : "PORHACER";
    }

    applyTaskFilter();
    renderCalendar();
}

newTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Activar las alertas individuales de Bootstrap
    newTaskForm.classList.add("was-validated");

    const formData = {
        name: newTaskNameInput.value.trim(),
        description: newTaskDescriptionInput.value.trim(),
        dueDate: newTaskDueDateInput.value,
        status: newTaskStatusInput.value,
        priority: newTaskPriorityInput.value
    };

    console.log("Datos del formulario:", formData);

    if (!validFormFieldInput(formData)) {
        mensajeError.classList.add("d-none");
        mensajeExito.classList.add("d-none");
        return;
    }

    const newTask = taskManager.addTask(
        formData.name,
        formData.description,
        formData.dueDate,
        formData.status
    );

    taskContainer.append(createTaskCard(newTask));

    updateTaskCount();
    applyTaskFilter();

    console.log(taskManager.tasks);

    newTaskForm.reset();

    newTaskForm.classList.remove("was-validated");

    mensajeExito.classList.remove("d-none");

    const newTaskDueDate = getDateFromKey(newTask.dueDate);

    visibleMonth = new Date(
        newTaskDueDate.getFullYear(),
        newTaskDueDate.getMonth(),
        1
    );

    selectedDateKey = newTask.dueDate;

    renderCalendar();
});

taskContainer.addEventListener("click", function (event) {
    const completeButton = event.target.closest(".btn-completar");

    if (completeButton) {
        updateTaskCardStatus(completeButton);
        return;
    }
    if (event.target.classList.contains("delete-button")) {
        const parentTask = event.target.closest(".task-card");
        const taskId = Number(parentTask.dataset.taskId);

        taskManager.deleteTask(taskId);
        taskManager.save(); 
        taskManager.render(); 
        
        parentTask.closest(".task-column").remove();
        updateTaskCount();
        renderCalendar();
    }
});

taskFilterButtons.forEach(function (filterButton) {
    filterButton.addEventListener("click", function () {
        currentTaskFilter = filterButton.dataset.filter;

        taskFilterButtons.forEach(function (button) {
            const isActive = button === filterButton;
            button.classList.toggle("btn-primary", isActive);
            button.classList.toggle("btn-outline-primary", !isActive);
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        applyTaskFilter();
    });
});

newTaskNavLink.addEventListener("click", function (event) {
    event.preventDefault();
    showPlannerSection("#newTaskForm", newTaskNavLink);
});

taskListNavLink.addEventListener("click", function (event) {
    event.preventDefault();
    showPlannerSection("#taskList", taskListNavLink);
});

calendarNavLink.addEventListener("click", function (event) {
    event.preventDefault();
    showCalendarView();
});

previousMonthButton.addEventListener("click", function () {
    changeVisibleMonth(-1);
});

nextMonthButton.addEventListener("click", function () {
    changeVisibleMonth(1);
});

todayButton.addEventListener("click", function () {
    const today = new Date();
    visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedDateKey = getLocalDateKey(today);
    renderCalendar();
});

renderCalendar();
