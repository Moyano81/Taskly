
// =====================================
// TASKLY - SISTEMA DE GESTIÓN DE TAREAS
// =====================================


// 1. CONECTAR JAVASCRIPT CON HTML

const botonCrear = document.getElementById("mi-boton");
const campoTarea = document.getElementById("titulo-tarea");
const botonGuardar = document.getElementById("guardar-tarea");
const listaTareas = document.getElementById("lista-tareas");
const buscador = document.getElementById("buscar-tarea");
const prioridadTarea = document.getElementById("prioridad-tarea");


// ESTADÍSTICAS

const totalElemento = document.getElementById("total-tareas");
const completadasElemento = document.getElementById("tareas-completadas");
const pendientesElemento = document.getElementById("tareas-pendientes");
const porcentajeElemento = document.getElementById("porcentaje-progreso");
const barraProgreso = document.getElementById("barra-progreso");
const contenedorProgreso = document.getElementById("contenedor-progreso");


// FILTROS

const botonesFiltros = document.querySelectorAll(".filter-btn");


// 2. CONFIGURACIÓN INICIAL

const CLAVE_ALMACENAMIENTO = "misTareas";

let tareas = [];

let filtroActual = "todas";
let busquedaActual = "";


// Generar identificadores únicos

function generarId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return String(Date.now() + Math.random());

}


// 3. RECUPERAR TAREAS GUARDADAS

function cargarTareas() {

    try {

        const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);

        if (!datosGuardados) {
            return [];
        }

        const datos = JSON.parse(datosGuardados);

        if (!Array.isArray(datos)) {
            console.warn("Los datos guardados no tienen un formato válido.");
            return [];
        }

        // Normalizar tareas antiguas y actuales

        return datos
            .filter(function(tarea) {
                return (
                    tarea !== null &&
                    typeof tarea === "object" &&
                    typeof tarea.texto === "string"
                );
            })
            .map(function(tarea) {

                const prioridadesValidas = ["alta", "media", "baja"];

                return {

                    id: tarea.id || generarId(),

                    texto: tarea.texto.trim(),

                    completada: tarea.completada === true,

                    prioridad: prioridadesValidas.includes(tarea.prioridad)
                        ? tarea.prioridad
                        : "media"

                };

            })
            .filter(function(tarea) {
                return tarea.texto !== "";
            });

    } catch (error) {

        console.error("Error al recuperar las tareas:", error);

        return [];

    }

}


// Cargar las tareas al iniciar

tareas = cargarTareas();


// 4. GUARDAR TAREAS EN LOCALSTORAGE

function guardarEnLocalStorage() {

    try {

        localStorage.setItem(
            CLAVE_ALMACENAMIENTO,
            JSON.stringify(tareas)
        );

        return true;

    } catch (error) {

        console.error("No se pudieron guardar las tareas:", error);

        alert(
            "No fue posible guardar los cambios. " +
            "Comprueba el almacenamiento de tu navegador."
        );

        return false;

    }

}


// 5. ACTUALIZAR ESTADÍSTICAS

function actualizarEstadisticas() {

    const total = tareas.length;

    const completadas = tareas.filter(function(tarea) {
        return tarea.completada;
    }).length;

    const pendientes = total - completadas;

    const porcentaje = total === 0
        ? 0
        : Math.round((completadas / total) * 100);


    totalElemento.textContent = total;

    completadasElemento.textContent = completadas;

    pendientesElemento.textContent = pendientes;

    porcentajeElemento.textContent = porcentaje + "%";

    barraProgreso.style.width = porcentaje + "%";

    contenedorProgreso.setAttribute(
        "aria-valuenow",
        porcentaje
    );

}


// 6. CREAR UNA TAREA VISUALMENTE

function crearElementoTarea(tarea) {

    const elemento = document.createElement("li");

    elemento.className = "task-item";

    elemento.dataset.id = tarea.id;


    if (tarea.completada) {
        elemento.classList.add("completada");
    }


    // TEXTO DE LA TAREA

    const texto = document.createElement("span");

    texto.className = "task-text";

    texto.textContent = tarea.texto;

    elemento.appendChild(texto);


    // ETIQUETA DE PRIORIDAD

    const etiquetaPrioridad = document.createElement("span");

    const prioridadValida = ["alta", "media", "baja"].includes(
        tarea.prioridad
    )
        ? tarea.prioridad
        : "media";

    etiquetaPrioridad.className =
        "priority-badge priority-" + prioridadValida;

    etiquetaPrioridad.textContent =
        "Prioridad " + prioridadValida;

    elemento.appendChild(etiquetaPrioridad);


    // CONTENEDOR DE BOTONES

    const acciones = document.createElement("div");

    acciones.className = "task-actions";


    // BOTÓN COMPLETAR

    const botonCompletar = document.createElement("button");

    botonCompletar.type = "button";

    botonCompletar.className = "btn-completar";

    botonCompletar.dataset.action = "completar";

    botonCompletar.textContent = tarea.completada
        ? "Deshacer"
        : "Completar";


    // BOTÓN EDITAR

    const botonEditar = document.createElement("button");

    botonEditar.type = "button";

    botonEditar.className = "btn-editar";

    botonEditar.dataset.action = "editar";

    botonEditar.textContent = "Editar";


    // BOTÓN ELIMINAR

    const botonEliminar = document.createElement("button");

    botonEliminar.type = "button";

    botonEliminar.className = "btn-eliminar";

    botonEliminar.dataset.action = "eliminar";

    botonEliminar.textContent = "Eliminar";


    // AGREGAR BOTONES

    acciones.appendChild(botonCompletar);

    acciones.appendChild(botonEditar);

    acciones.appendChild(botonEliminar);

    elemento.appendChild(acciones);


    return elemento;

}


// 7. MOSTRAR LAS TAREAS Y APLICAR FILTROS

function renderizarTareas() {

    listaTareas.innerHTML = "";


    // FILTRAR TAREAS

    const tareasFiltradas = tareas.filter(function(tarea) {

        const coincideBusqueda = tarea.texto
            .toLocaleLowerCase()
            .includes(busquedaActual.toLocaleLowerCase());

        const coincideFiltro =
            filtroActual === "todas" ||
            (
                filtroActual === "pendientes" &&
                !tarea.completada
            ) ||
            (
                filtroActual === "completadas" &&
                tarea.completada
            );

        return coincideBusqueda && coincideFiltro;

    });


    // MENSAJE CUANDO NO HAY RESULTADOS

    if (tareasFiltradas.length === 0) {

        const mensaje = document.createElement("li");

        mensaje.className = "empty-state";


        if (busquedaActual !== "") {

            mensaje.textContent =
                "No encontramos tareas con esa búsqueda.";

        } else if (filtroActual === "pendientes") {

            mensaje.textContent =
                "¡No tienes tareas pendientes!";

        } else if (filtroActual === "completadas") {

            mensaje.textContent =
                "Todavía no has completado tareas.";

        } else {

            mensaje.textContent =
                "Todavía no tienes tareas. ¡Crea la primera!";

        }


        listaTareas.appendChild(mensaje);

        return;

    }


    // DIBUJAR LAS TAREAS

    tareasFiltradas.forEach(function(tarea) {

        const elemento = crearElementoTarea(tarea);

        listaTareas.appendChild(elemento);

    });

}


// 8. AGREGAR UNA TAREA

function agregarTarea() {

    const texto = campoTarea.value.trim();


    // VALIDAR TEXTO

    if (texto === "") {

        alert("Escribe una tarea antes de guardarla.");

        campoTarea.focus();

        return;

    }


    // CREAR OBJETO DE TAREA

    const nuevaTarea = {

        id: generarId(),

        texto: texto,

        completada: false,

        prioridad: ["alta", "media", "baja"].includes(
            prioridadTarea.value
        )
            ? prioridadTarea.value
            : "media"

    };


    // AGREGAR AL ARRAY

    tareas.push(nuevaTarea);


    // GUARDAR Y ACTUALIZAR

    if (!guardarEnLocalStorage()) {

        tareas.pop();

        return;

    }

    actualizarEstadisticas();

    renderizarTareas();


    // LIMPIAR CAMPO

    campoTarea.value = "";

    prioridadTarea.value = "media";

    campoTarea.focus();

}


// 9. GESTIONAR LOS BOTONES DE CADA TAREA

listaTareas.addEventListener("click", function(evento) {

    const boton = evento.target.closest("button[data-action]");


    if (!boton || !listaTareas.contains(boton)) {
        return;
    }


    const elemento = boton.closest("li[data-id]");


    if (!elemento) {
        return;
    }


    const id = elemento.dataset.id;


    const indice = tareas.findIndex(function(item) {
        return item.id === id;
    });


    if (indice === -1) {
        return;
    }


    const tarea = tareas[indice];

    const accion = boton.dataset.action;


    // COMPLETAR TAREA

    if (accion === "completar") {

        tarea.completada = !tarea.completada;

    }


    // EDITAR TAREA

    else if (accion === "editar") {

        const nuevoTexto = prompt(
            "Escribe el nuevo nombre de la tarea:",
            tarea.texto
        );


        if (nuevoTexto === null) {
            return;
        }


        if (nuevoTexto.trim() === "") {

            alert("El nombre de la tarea no puede estar vacío.");

            return;

        }


        tarea.texto = nuevoTexto.trim();

    }


    // ELIMINAR TAREA

    else if (accion === "eliminar") {

        const confirmar = confirm(
            "¿Quieres eliminar esta tarea?"
        );


        if (!confirmar) {
            return;
        }


        tareas.splice(indice, 1);

    }


    else {
        return;
    }


    // GUARDAR CAMBIOS

    if (!guardarEnLocalStorage()) {

        tareas = cargarTareas();

    }


    actualizarEstadisticas();

    renderizarTareas();

});


// 10. FUNCIONAMIENTO DE LOS FILTROS

botonesFiltros.forEach(function(boton) {

    boton.addEventListener("click", function() {

        filtroActual = boton.dataset.filter;


        // ACTUALIZAR BOTÓN ACTIVO

        botonesFiltros.forEach(function(elemento) {

            elemento.classList.remove("activo");

        });


        boton.classList.add("activo");


        renderizarTareas();

    });

});


// 11. FUNCIONAMIENTO DEL BUSCADOR

buscador.addEventListener("input", function() {

    busquedaActual = buscador.value.trim();

    renderizarTareas();

});


// 12. EVENTOS PARA CREAR TAREAS

botonGuardar.addEventListener("click", agregarTarea);


botonCrear.addEventListener("click", function() {

    campoTarea.focus();

    document.querySelector(".task-form").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


campoTarea.addEventListener("keydown", function(evento) {

    if (evento.key === "Enter") {

        agregarTarea();

    }

});


// 13. INICIAR LA APLICACIÓN

guardarEnLocalStorage();

actualizarEstadisticas();

renderizarTareas();
