let topChild1 = document.querySelector('.top-child-1');
let topChild2 = document.querySelector('.top-child-2');
let tasksBar = document.querySelector('.tasks-bar');
let detailsBar = document.querySelector('.details-bar');
let addBtn = document.getElementById('add-btn');
let taskEditor = document.querySelector('.taskEditor');
let textEdit = document.querySelector('.textEdit');
let currentTask = null;

// Function to update the time every second
setInterval(() => {
    topChild1.textContent = new Date().toLocaleTimeString();
}, 1000);

// Update the date
topChild2.textContent = new Date().toLocaleDateString();

// Function to toggle task editor visibility
const openTexter = () => {
    addBtn.classList.toggle('openEditor');
    taskEditor.style.display = addBtn.classList.contains('openEditor') ? 'flex' : 'none';
    addBtn.textContent = addBtn.classList.contains('openEditor') ? 'x' : '+';
    detailsBar.style.display = addBtn.classList.contains('openEditor') ? 'none' : '';
    tasksBar.style.display = addBtn.classList.contains('openEditor') ? 'block' : '';
};

// Function to add a new task
const addTodoTask = () => {
    const taskText = taskEditor.querySelector('input').value.trim();
    if (taskText) {
        const taskHTML = createTaskElement(taskText, new Date().toLocaleString(), '');
        tasksBar.appendChild(taskHTML);
        saveTasksToLocalStorage();
        clearInput();
        openTexter();
    }
};

// Add event listener for "Enter" key press
taskEditor.querySelector('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodoTask();
    }
});


// Function to open the editor for a task
const openEditor = (taskElement) => {
    currentTask = taskElement;
    textEdit.style.display = 'flex';
    textEdit.querySelector('input').value = currentTask.querySelector('.taskText').innerHTML;
};

// Function to update a task
const updateTodo = () => {
    if (currentTask) {
        currentTask.querySelector('.taskText').innerHTML = textEdit.querySelector('input').value;
        currentTask.dataset.edited = new Date().toLocaleString();
        textEdit.style.display = 'none';
        saveTasksToLocalStorage(); // Save changes to local storage
    }
};

// Add event listener for "Enter" key press to trigger updateTodo
textEdit.querySelector('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateTodo();
    }
});


// Create a new task element
const createTaskElement = (taskText, added, edited) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task';
    taskItem.dataset.added = added || new Date().toLocaleString();
    taskItem.dataset.edited = edited || '';
    taskItem.innerHTML = `<p class="taskText">${taskText}</p> <label for="done" onclick="textStrike(this)"><div></div></label>
    <div class="controls">
        <i class="fa-solid fa-pencil" onclick="openEditor(this.closest('.task'))"></i>
        <i class="fa-solid fa-trash" onclick="deleteTask(this)"></i>
    </div>`;
    return taskItem;
};

// Function to clear input field
const clearInput = () => {
    taskEditor.querySelector('input').value = '';
};

// Function to save tasks to local storage
const saveTasksToLocalStorage = () => {
    const taskBlocks = [];
    document.querySelectorAll('.task').forEach(task => {
        const taskText = task.querySelector('.taskText').innerHTML;
        const isStriked = task.querySelector('label').classList.contains('color');
        taskBlocks.push({
            text: taskText,
            added: task.dataset.added,
            edited: task.dataset.edited,
            striked: isStriked
        });
    });
    localStorage.setItem('Tasks', JSON.stringify(taskBlocks));
};

// Function to save deleted tasks to local storage
const saveDeletedTasksToLocalStorage = (task) => {
    let deletedTasks = JSON.parse(localStorage.getItem('DeletedTasks')) || [];
    deletedTasks.push(task);
    localStorage.setItem('DeletedTasks', JSON.stringify(deletedTasks));
};

// Load tasks from local storage on page load
window.onload = () => {
    const savedTasks = JSON.parse(localStorage.getItem('Tasks'));
    const deletedTasks = JSON.parse(localStorage.getItem('DeletedTasks'));

    if (savedTasks) {
        savedTasks.forEach(task => {
            const taskHTML = createTaskElement(task.text, task.added, task.edited);
            tasksBar.appendChild(taskHTML);
        });
    }

    if (deletedTasks) {
        // This is just to ensure that deleted tasks are not shown in the main task bar
        deletedTasks.forEach(task => {
            // Add logic here if you need to handle deleted tasks differently on load
        });
    }
};

// Function to delete a task
const deleteTask = (deleteIcon) => {
    const taskToDelete = deleteIcon.closest('.task');
    const taskDetails = {
        text: taskToDelete.querySelector('.taskText').innerHTML,
        added: taskToDelete.dataset.added,
        edited: taskToDelete.dataset.edited,
        deleted: new Date().toLocaleString()
    };
    tasksBar.removeChild(taskToDelete);
    saveDeletedTasksToLocalStorage(taskDetails);
    saveTasksToLocalStorage();
};

// Function to toggle strike-through state of a task
const textStrike = (e) => {
    e.classList.toggle('color');
    if (e.classList.contains('color')) {
        e.firstElementChild.style.opacity = 1;
        e.previousElementSibling.style.textDecoration = 'line-through';
        e.previousElementSibling.style.color = '#232323';
        e.previousElementSibling.style.background = '#ffe3c0';
        e.previousElementSibling.style.borderColor = '#232323';
    } else {
        e.firstElementChild.style.opacity = '';
        e.previousElementSibling.style.textDecoration = '';
        e.previousElementSibling.style.color = '';
        e.previousElementSibling.style.background = '';
        e.previousElementSibling.style.borderColor = '';
    }
    saveTasksToLocalStorage(); // Update local storage when strike state changes
};

// Function to display task details
const displayDetailsBar = () => {
    tasksBar.style.display = 'none';
    detailsBar.style.display = 'flex';

    detailsBar.innerHTML = ''; // Clear previous details
    const savedTasks = JSON.parse(localStorage.getItem('Tasks')) || [];
    const deletedTasks = JSON.parse(localStorage.getItem('DeletedTasks')) || [];

    const allTasks = savedTasks.concat(deletedTasks);

    allTasks.forEach(task => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detailItem';
        detailItem.innerHTML = `
            <p>Task: ${task.text}</p>
            <p>Added: ${task.added}</p>
            <p>Edited: ${task.edited || 'Not Edited'}</p>
            <p>Deleted: ${task.deleted || 'Not Deleted'}</p>
        `;
        detailsBar.appendChild(detailItem);
    });
};

// Function to hide details and show tasks
const displayTaskBar = () => {
    tasksBar.style.display = 'block';
    detailsBar.style.display = 'none';
};
