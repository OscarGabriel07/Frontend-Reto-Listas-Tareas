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
            labelList.textContent = element.name;
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
            inputCreateTask.id = element.id + "-" + botonCreateTask.className;
            containerListOfTasksHeader.appendChild(labelList);
            containerListOfTasksHeader.appendChild(inputDeleteList);
            containerListOfTasksHeader.appendChild(br1);
            containerListOfTasksHeader.appendChild(br2);
            containerListOfTasksHeader.appendChild(inputCreateTask);
            containerListOfTasksHeader.appendChild(botonCreateTask);
            fragment.appendChild(containerListOfTasksHeader);

            const tableTasks = document.createElement('table');
            tableTasks.className = "table-tasks";
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            const thId = document.createElement('th');
            thId.textContent = "ID";
            const thTask = document.createElement('th');
            thTask.textContent = "Tarea";
            const thCompletado = document.createElement('th');
            thCompletado.textContent = "¿Completado?";
            const thAcciones = document.createElement('th');
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
                tdId.textContent = element.tasks[i].id;
                const tdDescription = document.createElement('td');
                tdDescription.textContent = element.tasks[i].description;
                const tdCompleted = document.createElement('td');
                const inputCheckBox = document.createElement('input');
                inputCheckBox.type = "checkbox";
                inputCheckBox.className = "check-completed";
                inputCheckBox.checked = element.tasks[i].completed;
                tdCompleted.appendChild(inputCheckBox);
                const tdAcciones = document.createElement('td');
                const buttonEdit = document.createElement('input');
                buttonEdit.type = "button";
                buttonEdit.value = "Editar";
                buttonEdit.className = "btn-edit-task";
                const buttonDelete = document.createElement('input');
                buttonDelete.type = "button";
                buttonDelete.value = "Eliminar";
                buttonDelete.className = "btn-delete-task";
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
 * Esta función se crea para la delegación de eventos del DOM
 */
const eventsButtons = () => {

    document.addEventListener("click", async e => {

        /**
         * Función para el evento de eliminar una lista
         */
        if (e.target.className === "btn-delete-list") {
            let isDelete = confirm(`¿Estás seguro de eliminar la lista?`);

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
         * Función para el evento de crear una nueva tarea
         */
        if (e.target.className === "btn-create-task") {
            let idInputTask = e.target.dataset.id + "-" + e.target.className;
            const inputCreateTask = document.getElementById(idInputTask);
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
        }


    })
}

document.addEventListener("DOMContentLoaded", getAll);
createNewList();
eventsButtons();