// Elvira Ericsson
// FE23
//
// Scrum Board
// Inlämning 2

const baseUrl = 'https://scrum-board-4eb67-default-rtdb.europe-west1.firebasedatabase.app/tasks';
const header = {
    "Content-type": "application/json; charset=UTF-8"
}

async function getTasks () {
    const url = `${baseUrl}.json`;

    const options = {
        method: 'GET',
        headers: header
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

async function postTask(taskData) {
    const url = `${baseUrl}.json`;

    const options = {
        method: 'POST',
        body: JSON.stringify(taskData),
        headers: header
    }

    const response = await fetch(url, options);
    const data = await response.json();

    // console.log(response)
    // console.log(data);
    // console.log(taskData)
    return data;
}

async function patchTask(taskId, updateData) {
    const url = baseUrl + `/${taskId}.json`;

    const options = {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: header
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

async function deleteTask (taskId) {
    const url = `${baseUrl}/${taskId}.json`;

    const options = {
        method: 'DELETE',
        body: JSON.stringify(taskId)
    }

    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Deleted task:", data);
}

export {getTasks, postTask, patchTask, deleteTask};
