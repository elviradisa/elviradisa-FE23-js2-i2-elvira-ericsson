import { getTasks, postTasks, patchTaskInProgress, patchTaskDone, deleteTask } from "./modules/fetch.js";

const form = document.querySelector('#task-form');
const containerForTasks = document.querySelector('.to-do-container');
const containerForInProgress = document.querySelector('.in-progress-container');
const containerForDone = document.querySelector('.done-container');

function displayTasks (tasks) {
    for (const key in tasks) {
        const task = tasks[key];
        displayAllTasks(task, key);
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const taskData = {
        task: form.querySelector('#enter-task').value,
        category: form.querySelector('#categories').value,
        status: "to do",
        assigned: "none"
    }
    console.log(taskData);
    form.reset();

    postTasks(taskData)
        .then(removeFormerTasks)
        .then(getTasks)
        .then(displayTasks)
})

containerForTasks.addEventListener('submit', event => {
    event.preventDefault();

    let id ;
    id = event.target.closest('div').id;

    const assigned = document.querySelector(`#${id} input`).value;

    const assignedTask = {
        assigned: assigned,
        status: 'in progress'
    }

    patchTaskInProgress(id, assignedTask)
        .then(removeFormerTasks)
        .then(getTasks)
        .then(displayTasks)
})

containerForInProgress.addEventListener('click', event => {
    event.preventDefault();

    if (event.target.localName == 'button') {

        let id;
        id = event.target.closest('div').id;

        const doneTask = {
            status: 'done'
        }

        patchTaskDone(id, doneTask)
            .then(removeFormerTasks)
            .then(getTasks)
            .then(displayTasks)
    }
})

containerForDone.addEventListener('click', event => {
    event.preventDefault();

    if (event.target.localName == 'button') {
        let id;
        id = event.target.closest('div').id;

        deleteTask(id)
            .then(removeFormerTasks)
            .then(getTasks)
            .then(displayTasks)
    }
})

getTasks().then(displayTasks);

function displayAllTasks (task, id) {
    if (task.status === 'to do') {
        const taskContainer = document.querySelector('.to-do-container');
        taskContainer.classList.add('toDoTask');
        taskContainer.setAttribute('id', 'assign');

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskDiv');
        taskDiv.innerHTML = task.task;
        taskDiv.id = id;

        const form = document.createElement('form');
        form.classList.add('toDoForm');

        const nameInput = document.createElement('input');
        nameInput.classList.add('assignTask');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter name';

        const assignButton = document.createElement('button');
        assignButton.classList.add('assignButton');
        assignButton.textContent = 'Assign';

        taskContainer.appendChild(taskDiv);
        taskDiv.appendChild(form);
        form.appendChild(nameInput);
        form.appendChild(assignButton);

        if (task.category == 'ux') {
            taskDiv.classList.add('dev-ux')
        } else if (task.category == 'dev frontend') {
            taskDiv.classList.add('dev-frontend')
        } else taskDiv.classList.add('dev-backend');
    } else if (task.status === 'in progress') {
        const inProgressContainer = document.querySelector('.in-progress-container');

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskDiv');
        taskDiv.id = id;

        const taskText = document.createElement('p');
        taskText.classList.add('taskText');
        taskText.innerHTML = task.task;

        const taskAssigned = document.createElement('p');
        taskAssigned.classList.add('taskAssigned');
        taskAssigned.textContent = task.assigned;

        const doneButton = document.createElement('button');
        doneButton.classList.add('doneButton');
        doneButton.textContent = 'Done';
        doneButton.type = 'button';

        inProgressContainer.appendChild(taskDiv);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(taskAssigned);
        taskDiv.appendChild(doneButton);
    
        if (task.category == 'ux') {
           taskDiv.classList.add('dev-ux')
        } else if (task.category == 'dev frontend') {
           taskDiv.classList.add('dev-frontend')
        } else taskDiv.classList.add('dev-backend');
    } else {
        const doneContainer = document.querySelector('.done-container');

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskDiv');
        taskDiv.id = id;

        const taskText = document.createElement('p');
        taskText.classList.add('taskText');
        taskText.textContent = task.task;

        const taskAssigned = document.createElement('p');
        taskAssigned.classList.add('taskAssigned');
        taskAssigned.textContent = task.assigned;

        const removeButton = document.createElement('button');
        removeButton.classList.add('removeButton');
        removeButton.textContent = 'Remove X';
        removeButton.type = 'button';

        doneContainer.appendChild(taskDiv);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(taskAssigned);
        taskDiv.appendChild(removeButton);

        if (task.category == 'ux') {
            taskDiv.classList.add('dev-ux')
        } else if (task.category == 'dev frontend') {
            taskDiv.classList.add('dev-frontend')
        } else taskDiv.classList.add('dev-backend');
    }
}

function removeFormerTasks () {
    containerForTasks.innerHTML = '';
    containerForInProgress.innerHTML = '';
    containerForDone.innerHTML = '';
}