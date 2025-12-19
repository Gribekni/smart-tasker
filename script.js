/*
Пользователь вводит свободный текст с мыслями.
Нужно превратить этот текст в список конкретных задач.
Задачи должны быть короткими, чёткими и начинаться с глагола.
*/

let tasks = [];

// Функции аутентификации
function showAuthForm() {
    document.getElementById('auth-form').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
}

function showMainContent() {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('main-content').style.display = 'block';
}

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    window.auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log('Вход выполнен');
        })
        .catch(error => alert('Ошибка входа: ' + error.message));
});

document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    window.auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log('Регистрация выполнена');
        })
        .catch(error => alert('Ошибка регистрации: ' + error.message));
});

document.getElementById('logout-btn').addEventListener('click', () => {
    window.auth.signOut().then(() => {
        tasks = [];
        renderTasks();
        showAuthForm();
    });
});

// Мониторинг состояния аутентификации
window.auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('user-email').textContent = user.email;
        loadTasks();
        showMainContent();
    } else {
        currentUser = null;
        showAuthForm();
    }
});

function loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.status === 'done';
        checkbox.addEventListener('change', () => {
            task.status = checkbox.checked ? 'done' : 'todo';
            saveTasks();
            renderTasks();
        });

        const label = document.createElement('label');
        label.textContent = task.text;
        if (task.status === 'done') {
            label.style.textDecoration = 'line-through';
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function extractTasks(text) {
    // Разделяем текст на предложения по точкам, восклицательным и вопросительным знакам
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [];
    const taskTexts = [];

    sentences.forEach(sentence => {
        // Убираем лишние пробелы
        let task = sentence.trim();

        // Пропускаем пустые предложения
        if (task.length === 0) return;

        // Убираем пунктуацию в конце
        task = task.replace(/[.!?]$/, '');

        taskTexts.push(task);
    });

    return taskTexts;
}

// При нажатии на кнопку преобразовать текст в задачи и добавить их к списку
document.getElementById('submit-button').addEventListener('click', () => {
    const inputText = document.getElementById('thought-input').value.trim();
    if (!inputText) return;

    const newTaskTexts = extractTasks(inputText);
    newTaskTexts.forEach((text, index) => {
        const task = {
            id: Date.now() + index,
            text: text,
            status: 'todo'
        };
        tasks.push(task);
    });

    saveTasks();
    renderTasks();

    // Очистить поле ввода
    document.getElementById('thought-input').value = '';
});






