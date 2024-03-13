// Elvira Ericsson
// FE23
//
// Scrum Board
// Inlämning 2

import { getTasks, postTask, patchTask, deleteTask} from "./firebase.js";
document.addEventListener('DOMContentLoaded', getExistingTasks);

async function getExistingTasks () {
    try {
        const tasks = await getTasks();
        // console.log(tasks);
        if (tasks) {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                const color = categoryColors[task.category];
                displayTask(task.task, color, taskId, task.status, task.assigned);
                // console.log(task)
            })
        }
    } catch (error) {
        console.log('Could not fetch tasks:', error);
    }
}

const form = document.querySelector('#task-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskData = {
        task: form.querySelector('#enter-task').value,
        category: form.querySelector('#categories').value,
        status: "to do",
        assigned: "none"
    }
    
    console.log("Task object:", taskData);
    try {
        const response = await postTask(taskData);
        const taskId = response.name;
        const color = categoryColors[taskData.category];
        displayTask(taskData, color, taskId);
        form.reset();
        console.log("To do task ID is:",taskId);
    } catch (error) {
        console.log('Error posting task:', error)
    }
})

const categoryColors = {
    "ux": "rgb(255, 213, 135)",
    "dev backend": "rgb(255, 208, 255)",
    "dev frontend": "rgb(170, 223, 170)"
};



function displayTask (taskInput, color, taskId, status, assignedTo) {
    let statusContainer;
    if (status === 'in progress') {
        statusContainer = document.querySelector('.in-progress-container');
    } else if (status === 'done') {
        statusContainer = document.querySelector('.done-container');
    } else {
        statusContainer = document.querySelector('.to-do-container');
    }
 
    const taskDiv = document.createElement('div');
    const form = document.createElement('form');
    const nameInput = document.createElement('input');
    const assignButton = document.createElement('button');

    taskDiv.classList.add('toDoTask');
    form.classList.add('toDoForm');
    nameInput.classList.add('assignTask');
    assignButton.classList.add('assignButton');

    taskDiv.setAttribute('data-task-id', taskId);
    taskDiv.style.backgroundColor = color;
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter name';
    assignButton.textContent = 'Assign';
    assignButton.type = 'button';

    const taskText = typeof taskInput === 'object' ? taskInput.task : taskInput;
    taskDiv.textContent = taskText;

    if (assignedTo && assignedTo !== "none") {
        const assignedToElement = document.createElement('p');
        assignedToElement.classList.add('assignedTo');
        assignedToElement.textContent = `- ${assignedTo}`;
        taskDiv.appendChild(assignedToElement);
    }

    assignButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const assignedName = nameInput.value.trim();
        if (assignedName) {
            try {
                const dataUpdate = {status: "in progress", assigned: assignedName};
                await patchTask(taskId, dataUpdate);
                moveTaskToInProgress(nameInput, taskInput, color, taskId);
                taskDiv.remove(); 
            } catch (error) {
                console.log('Error updating the task:', error);
            }
        } else {
            alert('Please assign a person to the task')
        }
    })

    if (status === "in progress") {
        form.style.display = 'none';
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.classList.add('doneButton');
        doneButton.addEventListener('click', async () => {
            try {
                const assignedName = nameInput.value.trim();
                const dataUpdate = {status: "done", assigned: assignedName};
                await patchTask(taskId, dataUpdate)
                taskDiv.remove();
            } catch (error) {
                console.log('Task is not done:', error);
            }
        });
        taskDiv.appendChild(doneButton);
    }   else if (status === "done") {
        form.style.display = 'none';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove X';
        removeButton.classList.add('removeButton');
        removeButton.addEventListener('click', async () => {
            try {
                await deleteTask(taskId);
                taskDiv.remove();
            } catch (error) {
                console.log('Error removing task:', error);
            }
        });
        taskDiv.appendChild(removeButton);
    }

    form.appendChild(nameInput);
    form.appendChild(assignButton);
    taskDiv.appendChild(form);
    statusContainer.appendChild(taskDiv);
}

function moveTaskToInProgress (nameInput, taskInput, color, taskId) {
    const nameValue = nameInput.value.trim();
    const inProgressContainer = document.querySelector('.in-progress-container');
    const inProgressDiv = document.createElement('div');
    const doneButton = document.createElement('button');

    inProgressDiv.classList.add('inProgressDiv');
    doneButton.classList.add('doneButton');

    inProgressDiv.style.backgroundColor = color;
    const taskText = typeof taskInput === 'object' ? taskInput.task : taskInput;
    inProgressDiv.textContent = `${taskText}` + ' - ' + `${nameValue}`;
    inProgressDiv.setAttribute('data-task-id', taskId);
    console.log("In progress task ID is:", taskId);
    doneButton.textContent = 'Done';
    doneButton.type = 'button';

    doneButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const taskId = inProgressDiv.getAttribute('data-task-id');
        const assignedName = nameInput.value.trim();
    
        if (assignedName) {
            try {
                console.log("Done task ID is:", taskId);
                removeTask(inProgressDiv, color, taskId);
                inProgressDiv.remove();
            } catch (error) {
                console.log('Not progressed:', error);
            }
        } else {
            alert('Task is not completed!');
        }
    })

    inProgressDiv.appendChild(doneButton);
    inProgressContainer.appendChild(inProgressDiv);
}

function removeTask (inProgressDiv, color, taskId) {
    const doneContainer = document.querySelector('.done-container');
    const doneDiv = document.createElement('div');

    doneDiv.classList.add('doneDiv');
    doneDiv.innerHTML = inProgressDiv.innerHTML;
    doneDiv.style.backgroundColor = color;
    doneDiv.setAttribute('data-task-id', taskId);

    const doneButton = doneDiv.querySelector('.doneButton');
    if (doneButton) {
        doneButton.remove();
    }
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('removeButton')
    removeButton.textContent = 'Remove X';

    removeButton.addEventListener('click', async () => {
        try {
            await deleteTask(taskId);
            doneDiv.remove();
        } catch (error) {
            console.log('Error removing task:', error);
        }
        
    })

    doneDiv.appendChild(removeButton);
    doneContainer.appendChild(doneDiv);
    
    inProgressDiv.remove();
}
