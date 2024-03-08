document.addEventListener('DOMContentLoaded', () => {
  initializeQueue();
  initializeDark();
  initializeDoneColor();
});

function initializeQueue() {
  const savedQueue = localStorage.getItem('queue');
  if (savedQueue) {
    const queueItems = JSON.parse(savedQueue);
    queueItems.forEach(item => new Job(item.num, item.category, item.done, item.sow, item.time, item.timezone, item.note, item.city, item.state));
    sortCategoryBySched();
  }
}

function initializeDark() {
  const savedDark = localStorage.getItem('darkMode');
  if (savedDark == 'true') {
    document.body.classList.toggle('dark-mode');
  }
}

function initializeDoneColor() {
  if ('donecolor' in localStorage) {
    doneColor = localStorage['donecolor'];
  } else {
    localStorage['donecolor'] = '#228B22'
    doneColor = localStorage['donecolor'];
  }
  document.documentElement.style.setProperty('--done-bg-color', doneColor);
  const darkColor = darkenHexColor(doneColor, 50);
  document.documentElement.style.setProperty('--done-hover-bg-color', darkColor);
}