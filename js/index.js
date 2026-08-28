const taskForm = document.querySelector("#taskForm");
const nombreInput = document.querySelector("#nombre");
const descripcionInput = document.querySelector("#descripcion");
const fechaEntregaInput = document.querySelector("#fechaEntrega");
const estadoSelect = document.querySelector("#estadoSelect");
const mensajeError = document.querySelector("#mensajeError");
const prioritySelect = document.querySelector("#prioritySelect");

const taskManager = new TaskManager();

const newTaskForm = document.querySelector('#newTaskForm'); 
newTaskForm.addEventListener('submit', function(event) { 
event.preventDefault();

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const fechaEntrega = fechaEntregaInput.value;
    const prioridad = prioritySelect.value;
    const estado = estadoSelect.value;

    let formularioValido = true;

    if (nombre === "") formularioValido = false;
    if (descripcion === "") formularioValido = false;
    if (fechaEntrega === "") formularioValido = false;
    if (prioridad === "") formularioValido = false;
    if (estado === "") formularioValido = false;

    if (!formularioValido) {
        mensajeError.classList.remove("d-none");

        Swal.fire({
            title: "Error",
            text: "Por favor, completa todos los campos.",
            icon: "error"
        });

        return;
    }

    mensajeError.classList.add("d-none");

    taskManager.addTask(
        nombre,
        descripcion,
        fechaEntrega,
        estado
    );

    console.log(taskManager.tasks);

    taskForm.reset();

    Swal.fire({
        title: "¡Tarea guardada!",
        text: "La tarea se guardó correctamente.",
        icon: "success",
        draggable: true
    });
});

const boton = document.getElementById("btn-completar");

if (boton) {
    boton.addEventListener("click", () => {

        boton.classList.toggle("completado");

        if (boton.classList.contains("completado")) {
            boton.innerText = "Descompletar ❌";
        } else {
            boton.innerText = "Completado";
        }
    });
}

