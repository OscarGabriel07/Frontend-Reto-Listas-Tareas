/**
 * Esta función carga todas las listas de tareas en la página principal
 */
const getAll = async () => {
    let res = await fetch("http://localhost:8080/listing");
    let data = await res.json();

    const containerLists = document.querySelector(".container-lists");
    const fragment = document.createDocumentFragment();

    try {
        data.forEach((element) => {
            const containerListOfTasksHeader = document.createElement('div');
            containerListOfTasksHeader.className = "list-of-tasks-header";
            const labelList = document.createElement('label');
            labelList.textContent = element.name.toUpperCase();
            labelList.className = "name-list"
            const inputDeleteList = document.createElement('input');
            inputDeleteList.id = element.id;
            inputDeleteList.type = "button";
            inputDeleteList.className = "btn-delete-list";
            inputDeleteList.value = "Eliminar";
            const br1 = document.createElement('br');
            const br2 = document.createElement('br');
            const inputCreateTask = document.createElement('input');
            inputCreateTask.type = "text";
            inputCreateTask.className = "input-create-task";
            inputCreateTask.placeholder = "¿Qué piensas hacer?";
            const botonCreateTask = document.createElement('input');
            botonCreateTask.type = "button";
            botonCreateTask.className = "btn-create-task";
            botonCreateTask.value = "Crear Tarea";
            botonCreateTask.dataset.id = element.id;
            botonCreateTask.id = element.id + "-btn-update-task";
            inputCreateTask.id = element.id + "-" + botonCreateTask.className;
            containerListOfTasksHeader.appendChild(labelList);
            containerListOfTasksHeader.appendChild(inputDeleteList);
            containerListOfTasksHeader.appendChild(br1);
            containerListOfTasksHeader.appendChild(br2);
            containerListOfTasksHeader.appendChild(inputCreateTask);
            containerListOfTasksHeader.appendChild(botonCreateTask);
            fragment.appendChild(containerListOfTasksHeader);

            const tableTasks = document.createElement('table');
            tableTasks.className = "table-tasks table";
            const thead = document.createElement('thead');
            thead.className = "thead-dark";
            const trHead = document.createElement('tr');
            const thId = document.createElement('th');
            thId.scope = "col";
            thId.textContent = "ID";
            const thTask = document.createElement('th');
            thTask.scope = "col";
            thTask.textContent = "Tarea";
            const thCompletado = document.createElement('th');
            thCompletado.scope = "col";
            thCompletado.textContent = "¿Completado?";
            const thAcciones = document.createElement('th');
            thAcciones.scope = "col";
            thAcciones.textContent = "Acciones";
            trHead.appendChild(thId);
            trHead.appendChild(thTask);
            trHead.appendChild(thCompletado);
            trHead.appendChild(thAcciones);
            thead.appendChild(trHead);
            tableTasks.appendChild(thead);

            const tbody = document.createElement('tbody');

            for (let i = 0; i < element.tasks.length; i++) {
                const trBody = document.createElement('tr');
                const tdId = document.createElement('td');
                tdId.className = "id-task"
                tdId.id = element.tasks[i].id + "-td-id";
                tdId.textContent = element.tasks[i].id;
                const tdDescription = document.createElement('td');
                tdDescription.className = "description-task"
                tdDescription.id = element.tasks[i].id + "-td-description";
                tdDescription.textContent = element.tasks[i].description;
                const tdCompleted = document.createElement('td');
                const inputCheckBox = document.createElement('input');
                inputCheckBox.type = "checkbox";
                inputCheckBox.className = "check-completed";
                inputCheckBox.checked = element.tasks[i].completed;
                inputCheckBox.dataset.idTask = element.tasks[i].id;
                tdCompleted.appendChild(inputCheckBox);
                const tdAcciones = document.createElement('td');
                const buttonEdit = document.createElement('input');
                buttonEdit.type = "button";
                buttonEdit.value = "Editar";
                buttonEdit.className = "btn-edit-task";
                buttonEdit.dataset.idList = element.id;
                buttonEdit.dataset.description = element.tasks[i].description;
                buttonEdit.dataset.id = element.tasks[i].id;
                buttonEdit.dataset.completed = element.tasks[i].completed;
                buttonEdit.id = element.tasks[i].id + "-td-button-edit";
                const buttonDelete = document.createElement('input');
                buttonDelete.type = "button";
                buttonDelete.value = "Eliminar";
                buttonDelete.className = "btn-delete-task";
                buttonDelete.dataset.idList = element.id;
                buttonDelete.dataset.idTask = element.tasks[i].id;
                tdAcciones.appendChild(buttonEdit);
                tdAcciones.appendChild(buttonDelete);
                trBody.appendChild(tdId);
                trBody.appendChild(tdDescription);
                trBody.appendChild(tdCompleted);
                trBody.appendChild(tdAcciones);
                tbody.appendChild(trBody);
                tableTasks.appendChild(tbody);
            }

            fragment.appendChild(tableTasks);

            const br3 = document.createElement('br');
            const br4 = document.createElement('br');
            const hr1 = document.createElement('hr');
            hr1.className = "line-horizontal";

            fragment.appendChild(br3);
            fragment.appendChild(br4);
            fragment.appendChild(hr1);

        });

        containerLists.appendChild(fragment);

    } catch (error) {

    }
}

/**
 * Esta función crea una nueva lista
 */
const createNewList = () => {
    const buttonNewList = document.querySelector(".btn-create-list");
    const inputNewList = document.querySelector(".input-new-list");
    buttonNewList.addEventListener("click", async () => {
        if (inputNewList.value !== "") {

            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: inputNewList.value
                    })
                }
                let res = await fetch("http://localhost:8080/listing", options);
                let json = await res.json();

                location.reload();
            } catch (error) {

            }
        } else {
            alert("¡Por favor ingrese el nombre de la nueva lista que desea crear!");
        }
    });


};

/**
 * Esta función se crea para la delegación del evento click del DOM
 */
const eventsButtons = () => {

    document.addEventListener("click", async e => {

        /**
         * Función para el evento de eliminar una lista
         */
        if (e.target.className === "btn-delete-list") {
            let isDelete = confirm("¿Estás seguro de eliminar la lista?");

            if (isDelete) {
                try {
                    let options = {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        }
                    }
                    let res = await fetch(`http://localhost:8080/listing/${e.target.id}`, options);
                    location.reload();
                    let json = await res.json();

                } catch (error) {}
            }
        }

        /**
         * Función para el evento de crear una nueva tarea y actualizar una tarea
         */
        if (e.target.className === "btn-create-task") {
            let idInputTask = e.target.dataset.id + "-" + e.target.className;
            const inputCreateTask = document.getElementById(idInputTask);

            if (e.target.value === "Crear Tarea") {
                if (inputCreateTask.value !== "") {
                    try {
                        let options = {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                                lista: {
                                    id: e.target.dataset.id
                                },
                                description: inputCreateTask.value
                            })
                        }
                        let res = await fetch("http://localhost:8080/task", options);
                        let json = await res.json();

                        location.reload();
                    } catch (error) {

                    }
                } else {
                    alert("¡Por favor ingrese la descripción de la tarea que desea crear!");
                }

            } else {
                if (inputCreateTask.value !== "") {
                    try {
                        let options = {
                            method: "PUT",
                            headers: {
                                "Content-type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                                description: inputCreateTask.value,
                                completed: inputCreateTask.dataset.completed,
                                lista: {
                                    id: e.target.dataset.id
                                }
                            })
                        }
                        let res = await fetch(`http://localhost:8080/task/${inputCreateTask.dataset.idTask}`, options);
                        let json = await res.json();
                        location.reload();
                    } catch (error) {

                    }
                } else {
                    alert("¡Por favor ingrese la descripción de la tarea que está editando!");
                }
            }
        }

        /**
         * Función para editar una tarea
         */
        if (e.target.className === "btn-edit-task") {
            let idInputTaskEdit = e.target.dataset.idList + "-" + "btn-create-task";
            const inputTaskEdit = document.getElementById(idInputTaskEdit);
            inputTaskEdit.value = e.target.dataset.description;
            inputTaskEdit.dataset.idTask = e.target.dataset.id;
            inputTaskEdit.dataset.completed = e.target.dataset.completed;

            let idButtonUpdateTask = e.target.dataset.idList + "-btn-update-task";
            const buttonUpdateTask = document.getElementById(idButtonUpdateTask);
            buttonUpdateTask.value = "Actualizar";
        }

        /**
         * Función para eliminar una tarea
         */
        if (e.target.className === "btn-delete-task") {
            let isDeleteTask = confirm("¿Estás seguro de eliminar la tarea?");

            if (isDeleteTask) {
                try {
                    let options = {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        }
                    }
                    let res = await fetch(`http://localhost:8080/task/${e.target.dataset.idTask}`, options);
                    location.reload();
                    let json = await res.json();

                } catch (error) {}
            }
        }

        /**
         * Evento para el manejo del check de la tarea completada
         */
        if (e.target.className === "check-completed") {

            let idTdId = e.target.dataset.idTask + "-td-id";
            const tdIdTask = document.getElementById(idTdId);
            let idTdDescription = e.target.dataset.idTask + "-td-description";
            const tdDescriptionTask = document.getElementById(idTdDescription);
            let idTdButtonEdit = e.target.dataset.idTask + "-td-button-edit";
            const tdButtonEdit = document.getElementById(idTdButtonEdit);

            if (e.target.checked) {
                tdIdTask.style = "text-decoration:line-through; color: red;";
                tdDescriptionTask.style = "text-decoration:line-through; color: red;";
                tdButtonEdit.disabled = true;
            } else {
                tdIdTask.style = "text-decoration:none;";
                tdDescriptionTask.style = "text-decoration:none;";
                tdButtonEdit.disabled = false;
            }

        }

    })
}

document.addEventListener("DOMContentLoaded", getAll);
createNewList();
eventsButtons();