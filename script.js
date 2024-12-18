let currentPage = 0;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toggleMenu(menuId) {
    const menuContent = document.getElementById(menuId);
    menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function openColorPicker(element) {
    const colorPicker = document.getElementById('hiddenColorPicker');
    colorPicker.targetElement = element;
    colorPicker.click();
}

function updateColor(colorPicker) {
    const element = colorPicker.targetElement;
    const classElement = element.closest('.class');
    classElement.style.backgroundColor = colorPicker.value;
    saveSchedule();
}

function saveSchedule() {
    days.forEach(day => {
        const classes = document.querySelectorAll(`#dayContainer${day} .class`);
        const schedule = Array.from(classes).map(classEl => ({
            subject: classEl.querySelector('.subject').value,
            time: classEl.querySelector('.time').value,
            location: classEl.querySelector('.location').value,
            color: classEl.style.backgroundColor
        }));
        localStorage.setItem(`schedule${day}`, JSON.stringify(schedule));
    });
}

function loadSchedule() {
    days.forEach(day => {
        const schedule = JSON.parse(localStorage.getItem(`schedule${day}`));
        if (schedule) {
            schedule.forEach(classData => addClassElement(day, classData));
        }
    });
}

function addClassElement(day, { subject, time, location, color }) {
    const dayContainer = document.getElementById(`dayContainer${day}`);
    const classEl = document.createElement('div');
    classEl.className = 'class';
    classEl.style.backgroundColor = color;

    classEl.innerHTML = `
        <div class="color-picker" onclick="openColorPicker(this)" style="background-color: ${color};"></div>
        <input class="editable subject" value="${subject}">
        <input class="editable time" value="${time}">
        <input class="editable location" value="${location}">
    `;

    classEl.querySelectorAll('.editable').forEach(input => input.addEventListener('input', saveSchedule));
    dayContainer.appendChild(classEl);
}

function nextPage() {
    if (currentPage < days.length - 1) currentPage++;
    updatePage();
}

function prevPage() {
    if (currentPage > 0) currentPage--;
    updatePage();
}

function updatePage() {
    const container = document.getElementById('container');
    container.style.transform = `translateX(-${currentPage * 100}%)`;
}

let startX = 0, currentX = 0;

function handleTouchStart(evt) {
    startX = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
    currentX = evt.touches[0].clientX - startX;
}

function handleTouchEnd() {
    if (currentX < -50) nextPage();
    if (currentX > 50) prevPage();
    startX = currentX = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');

    const container = document.getElementById('container');
    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', handleTouchMove, false);
    container.addEventListener('touchend', handleTouchEnd, false);
});
