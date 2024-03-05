let tasks = [];

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    loadTasks();
    populateCategoryFilter();
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        const noTasksMessage = document.createElement('li');
        noTasksMessage.textContent = 'No tasks found';
        taskList.appendChild(noTasksMessage);
    } else {
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }
}

function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = ''; 

    const categories = [...new Set(tasks.map(task => task.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    categoryFilter.appendChild(allOption);
}

function addTask() {
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueDate');
    const categoryInput = document.getElementById('category');
    const errorMessageDiv = document.getElementById('errorMessage');

    const taskText = newTaskInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = categoryInput.value.trim();

    let unfilledFields = [];

    if (taskText === '') {
        unfilledFields.push('Task');
    }

    if (dueDate === '') {
        unfilledFields.push('Due Date');
    }

    if (category === '') {
        unfilledFields.push('Category');
    }

    if (unfilledFields.length === 0) {
        const newTask = { text: taskText, dueDate, category, completed: false };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToDOM(newTask);
        newTaskInput.value = '';
        dueDateInput.value = '';
        categoryInput.value = '';
        populateCategoryFilter();
        errorMessageDiv.textContent = '';
    } else {
        errorMessageDiv.textContent = `Please fill the: ${unfilledFields.join(', ')} field`;
    }
}



function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');

    li.innerHTML = `
        <div class="task-item">
            <span class="bullet">&#8226;</span>
            <span class="task-text ${task.completed ? 'completed' : ''}" onclick="toggleTask(${tasks.indexOf(task)})">${task.text}</span>
            <span class="details">
                ${task.dueDate ? `<span class="due-date">Due: ${task.dueDate}</span>` : ''}
                ${task.category ? `<span class="category">Category: ${task.category}</span>` : ''}
            </span>
            <div class="action-icons">
                ${task.completed
                    ? `<span class="action-icon done-icon" onclick="toggleTask(${tasks.indexOf(task)})" title="Mark as Incomplete">✔</span>`
                    : `<span class="action-icon done-icon" onclick="markTaskDone(${tasks.indexOf(task)})" title="Mark as Complete">Completed</span>`}
                <span class="action-icon edit-icon" onclick="editTask(${tasks.indexOf(task)})" title="Edit Task">✎</span>
                <span class="action-icon delete-icon" onclick="deleteTask(${tasks.indexOf(task)})" title="Delete Task">&#10006;</span>
            </div>
        </div>
    `;

    taskList.appendChild(li);
}

function editTask(index) {
    const task = tasks[index];

    const editedTask = prompt('Edit Task:', task.text);
    if (editedTask !== null) {
        task.text = editedTask.trim();

        const editedDueDate = prompt('Edit Due Date:', task.dueDate);
        task.dueDate = editedDueDate ? editedDueDate : null;

        const editedCategory = prompt('Edit Category:', task.category);
        task.category = editedCategory ? editedCategory.trim() : null;

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        populateCategoryFilter();
    }
}

function markTaskDone(index) {
    tasks[index].completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    populateCategoryFilter();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    populateCategoryFilter();
}

function deleteTask(index) {
    const deletedCategory = tasks[index].category.toLowerCase();

    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    populateCategoryFilter();

    const categoryFilter = document.getElementById('categoryFilter');
    const options = categoryFilter.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value.toLowerCase() === deletedCategory) {
            categoryFilter.remove(i);
            break;
        }
    }
}

function filterTasks() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value.toLowerCase();

    const doneFilter = document.getElementById('doneFilter');
    const selectedStatus = doneFilter.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        const categoryMatch = selectedCategory === 'all' || task.category.toLowerCase() === selectedCategory;
        const statusMatch = selectedStatus === 'all' || (selectedStatus === 'done' && task.completed) || (selectedStatus === 'undone' && !task.completed);
        return categoryMatch && statusMatch;
    });

    displayTasks(filteredTasks);
}

function sortTasks() {
    const sortOption = document.getElementById('sortOption');

    switch (sortOption.value) {
        case 'asc':
            tasks.sort((a, b) => ((a.dueDate > b.dueDate) ? 1 : -1) || (a.completed - b.completed));
            break;
        case 'desc':
            tasks.sort((a, b) => ((a.dueDate < b.dueDate) ? 1 : -1) || (a.completed - b.completed));
            break;
        default:
            break;
    }

    displayTasks(tasks);
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}
