const jobdialog = document.getElementById('job-dialog');
const jobform = jobdialog.querySelector('form');
const jobeditdialog = document.getElementById('jobeditdialog');
const jobeditform = jobeditdialog.querySelector('form');
const jobnotesdialog = document.getElementById('jobnotesdialog');
const contextmenudialog = document.getElementById('contextmenudialog');
const contextmenucloseBtn = contextmenudialog.querySelector('#close');
const editjobBtn = document.getElementById('editjobBtn');
const copyText = document.getElementById('copiedText');
const configdialog = document.getElementById('configdialog');
const configform = configdialog.querySelector('form');
const importdialog = document.getElementById('importqdialog');
const importqfield = importdialog.querySelector('#queuefield');
const closeimportBtn = importdialog.querySelector('#closeqdialog');
const clearimportBtn = importdialog.querySelector('#clearqimport');
const copyqBtn = importdialog.querySelector('#copyqBtn');

function clearQueue() {
  let confirmation = confirm('Are you sure you want to clear all jobs from the screen?')
  if (confirmation) {
    const items = document.getElementsByClassName('job');
    while (items.length > 0) {
      items[0].parentNode.removeChild(items[0]);
    }
    updateLocalStorage();
  }
}

function updateLocalStorage() {
  const jobs = Array.from(document.querySelectorAll('.job')).map(job => ({
    num: job.id,
    category: job.parentNode.parentNode.id,
    done: job.classList.contains('done'),
    sow: job.getAttribute('data-sow') || '',
    time: job.getAttribute('data-time'),
    timezone: job.getAttribute('data-tz'),
    note: job.getAttribute('data-note'),
    city: job.getAttribute('data-city'),
    state: job.getAttribute('data-state'),
  }));
  localStorage.setItem('queue', JSON.stringify(jobs));
}

function markDone() {
  this.classList.toggle('done');
  updateLocalStorage();
}

function cancelDialog() {
  document.getElementById('configdialog').close();
}

function jobcontextOpen(event) {
  event.preventDefault();
  const jobnumInput = jobeditform.querySelector('input[name="jobnumber"]');
  const jobcategoryInput = jobeditform.querySelector('select[name="category"]');
  const jobtimeInput = jobeditform.querySelector('input[name="time"]');
  const jobtimezoneInput = jobeditform.querySelector('select[name="timezone"]')
  const jobsowInput = jobeditform.querySelector('select[name="sow"]');
  const jobnoteInput = jobeditform.querySelector('input[name="note"]');
  jobnumInput.value = event.target.id;
  jobcategoryInput.value = event.target.parentNode.parentNode.id;
  jobtimeInput.value = event.target.getAttribute('data-time');
  jobsowInput.value = event.target.getAttribute('data-sow');
  jobtimezoneInput.value = event.target.getAttribute('data-tz');
  jobnoteInput.value = event.target.getAttribute('data-note');
  jobeditdialog.originalTarget = event.target.id;
  closeAllDialogs();
  jobeditdialog.show();
}

function contextmenuopen(event) {
  event.preventDefault();
  closeAllDialogs();
  contextmenudialog.show();
  contextmenudialog.originalEvent = event;
  contextmenudialog.originalTarget = event.target.id;
  contextmenudialog.querySelector('#jobidheading').textContent = event.target.id;
}

function setConfig() {
  let formData = new FormData(configform);
  const lunchHour = formData.get('lunchhour');
  const doneColor = formData.get('donecolor');

  if (localStorage['lunchhour'] != lunchHour) {
    localStorage['lunchhour'] = lunchHour;
  }
  if (localStorage['donecolor'] != doneColor) {
    localStorage['donecolor'] = doneColor;
    document.documentElement.style.setProperty('--done-bg-color', doneColor);
    const darkColor = darkenHexColor(doneColor, 50);
    document.documentElement.style.setProperty('--done-hover-bg-color', darkColor);
  }
}

function convertTo12HrFormat(time24) {
  const [hours, minutes] = time24.split(':');
  const hoursIn12HrFormat = ((hours % 12) || 12);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hoursIn12HrFormat}:${minutes}\xa0${ampm}`;
}

function darkenHexColor(hex, amount) {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Decrease each color's brightness by the amount
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Convert back to hex and return
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function closeAllDialogs() {
  document.querySelectorAll('dialog').forEach((value) => {
    value.returnValue = 'cancel';
    value.close();
  });
}
