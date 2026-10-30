const boton = document.getElementById("mi-boton");
boton.addEventListener("click", function() {
    alert("¡Vamos a crear tu primera tarea!");
});

const campoTarea = document.getElementById("titulo-tarea");
const botonGuardar = document.getElementById("guardar-tarea");
const listaTareas = document.getElementById("lista-tareas");

botonGuardar.addEventListener("click", function() {
    const textoTarea = campoTarea.value;
    if (textoTarea.trim() === "") {
    alert("Escribe una tarea antes de guardar");
    return;
}

    const nuevaTarea = document.createElement("li");

    const TextoElemento = document.createElement("span")
    TextoElemento.textContent = textoTarea; 
    nuevaTarea.appendChild(TextoElemento);


    const botonCompletar = document.createElement("button")
    botonCompletar.textContent= "Completada";
    botonCompletar.addEventListener("click", function() {
        nuevaTarea.classList.toggle("completada")
    });
    nuevaTarea.appendChild(botonCompletar);


    // boton editar
    const botonEditar = document.createElement("button")
    botonEditar.textContent = "Editar";
   botonEditar.addEventListener("click", function() {
    const nuevoTexto = prompt("Escribe el nuevo nombre de la tarea");
    if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
    TextoElemento.textContent = nuevoTexto;
}
});

    nuevaTarea.appendChild(botonEditar);


    


    // boton eliminar 
    const botonEliminar = document.createElement("button")
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function() {
        nuevaTarea.remove()
    });
    nuevaTarea.appendChild(botonEliminar);
   



    listaTareas.appendChild(nuevaTarea);

    campoTarea.value = "";
});

const tarea = [push()]
localStorage.setItem("tareas", JSON.stringify(tarea))
localStorage.getItem("tareas")
console.log(localStorage.getItem("tareas"))
