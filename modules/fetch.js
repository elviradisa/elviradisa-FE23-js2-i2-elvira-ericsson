const baseUrl = "https://scrum-board-4eb67-default-rtdb.europe-west1.firebasedatabase.app/tasks";
const header = {
    "Content-type": "application/json; charset=UTF-8"
};

async function getTasks() {
    const url = `${baseUrl}.json`;

    const options = {
        method: 'GET',
        headers: header
    }

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            console.log('getting tasks');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
    
}


async function postTasks(taskData) {
    const url = `${baseUrl}.json`;

    const options = {
        method: 'POST',
        body: JSON.stringify(taskData),
        headers: header
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};

async function patchTaskInProgress(id, assigned) {
    const url = `${baseUrl}/${id}.json`;

    const options = {
        method: 'PATCH',
        body: JSON.stringify(assigned),
        headers: header
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};

async function patchTaskDone(id, doneTask) {
    const url = `${baseUrl}/${id}.json`;

    const options = {
        method: 'PATCH',
        body: JSON.stringify(doneTask),
        headers: header
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};

async function deleteTask(id) {
    const url = `${baseUrl}/${id}.json`;
    const options = {
        method: 'DELETE',
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};

export {getTasks, postTasks, patchTaskInProgress, patchTaskDone, deleteTask};