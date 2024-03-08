document.getElementById('darkmodeBtn').addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

document.getElementById('cancelDialog').addEventListener('click', () => {
  document.getElementById('configdialog').returnValue = 'cancel';
  document.getElementById('configdialog').close()
});

document.getElementById('jobcancelBtn').addEventListener('click', () => {
  jobdialog.returnValue = 'cancel';
  jobdialog.close();
});

document.getElementById('newjobBtn').addEventListener('click', () => {
  closeAllDialogs();
  jobdialog.show();
});

document.getElementById('contextclosebutton').addEventListener('click', () => {
  jobeditdialog.returnValue = 'cancel';
  jobeditdialog.close();
});

jobdialog.addEventListener('close', () => {
  let returnValue = jobdialog.returnValue;
  if (returnValue == 'cancel') {
    return;
  }
  const formData = new FormData(jobform);
  let jobnum = formData.get('jobnumber');
  if (document.getElementById(jobnum) !== null) {
    jobform.reset();
    return;
  }
  let jobcategory = formData.get('category');
  let time = formData.get('time');
  let tz = formData.get('timezone');
  let sow = formData.get('sow');
  let note = formData.get('note');
  let city = '';
  let state = '';
  new Job(jobnum, jobcategory, false, sow, time, tz, note, city, state);
  if (jobcategory === 'Today' || jobcategory === 'Tomorrow') {
    sortCategoryBySched();
  } else if (jobcategory === 'Scheduled') {
    sortCategoryByDate();
  }
  updateLocalStorage();
  jobform.reset();
});

document.getElementById('copyqueueBtn').addEventListener('click', () => {
  let queuestring = '';
  const items = Array.from(document.querySelectorAll('.job'))
  let todaystring = 'Today:\n';
  let tomorrowstring = '\nTomorrow:\n';
  let unscheduledstring = '\nUnscheduled:\n';
  let completedstring = '\nCompleted:\n';
  items.forEach((item) => {
    let category = item.parentNode.parentNode.id;
    let note = item.getAttribute('data-note')
    let itemText = item.textContent;
    let noteText = ''
    if (note !== '') {
      itemText = itemText.split(note)[0];
      noteText = ' - ' + note;
    }
    switch (category) {
      case 'Today':
        todaystring += itemText + noteText + '\n';
        break;
      case 'Tomorrow':
        tomorrowstring += itemText + noteText + '\n';
        break;
      case 'Unscheduled':
        unscheduledstring += itemText + noteText + '\n';
        break;
      case 'Completed':
        completedstring += itemText + noteText + '\n';
        break;
    }
  });
  if (todaystring != 'Today:\n') { queuestring += todaystring; }
  if (tomorrowstring != '\nTomorrow:\n') { queuestring += tomorrowstring; }
  if (unscheduledstring != '\nUnscheduled:\n') { queuestring += unscheduledstring; }
  if (completedstring != '\nCompleted:\n') { queuestring += completedstring; }
  if (queuestring === '') {
    return;
  }
  copyToClipboard(queuestring.trim());
  copyText.textContent = 'Text copied to clipboard!'
  copyText.classList.remove('hidden');
  setTimeout(() => {
    copyText.classList.add('hidden')
  }, 2000);
});

document.getElementById('copylunchBtn').addEventListener('click', () => {
  if (!('lunchhour' in localStorage)) {
    localStorage['lunchhour'] = '11:00';
  }
  const lunchHour = localStorage['lunchhour']
  let lunchstring = 'Taking lunch at ' + convertTo12HrFormat(lunchHour) + '\n';
  let duringstring = "\nNeed to be checked in: \n";
  let beforestring = "\nOn site: \n"
  const items = Array.from(document.querySelectorAll('.job'));
  items.forEach((item) => {
    const category = item.parentNode.parentNode.id;
    const time = item.getAttribute('data-time');
    const done = item.classList.contains('done');
    let itemText = item.textContent;
    let note = item.getAttribute('data-note');
    let noteText = ''
    if (note !== '') {
      itemText = itemText.split(note)[0]
      noteText = ' - ' + note;
    }
    if (done) {
      return;
    }
    if (!time) {
      return;
    }
    if (category == 'Today') {
      if (isAfterLunch(time, lunchHour)) {
        if (isBefore1HrAfterLunch(time, lunchHour)) {
          duringstring += itemText + noteText + '\n';
        }
      } else {
        beforestring += itemText + noteText + '\n';
      }
    }
  });
  if (duringstring != "\nNeed to be checked in: \n") { lunchstring += duringstring; }
  if (beforestring != "\nOn site: \n") { lunchstring += beforestring; }
  if (lunchstring == 'Taking lunch at ' + convertTo12HrFormat(lunchHour) + '\n') {
    lunchstring = 'Taking lunch at ' + convertTo12HrFormat(lunchHour) + '. Nothing to cover.'
  }
  copyToClipboard(lunchstring.trim());
  copyText.textContent = 'Text copied to clipboard!'
  copyText.classList.remove('hidden');
  setTimeout(() => {
    copyText.classList.add('hidden')
  }, 2000);
});

//Helper functions for checking the time in relation to the lunch hour set. Both assume all times are in HH:MM format (ex 12:30) 
function isBefore1HrAfterLunch(itemTime, lunchHourString) {
  const [itemHours, itemMinutes] = itemTime.split(':').map(Number);
  const [lunchHours, lunchMinutes] = lunchHourString.split(':').map(Number);

  const itemDate = new Date();
  itemDate.setHours(itemHours, itemMinutes);

  const lunchDate = new Date();
  lunchDate.setHours(lunchHours, lunchMinutes);
  lunchDate.setHours(lunchDate.getHours() + 1);

  return itemDate <= lunchDate;
}

function isAfterLunch(itemTime, lunchHourString) {
  const [itemHours, itemMinutes] = itemTime.split(':').map(Number);
  const [lunchHours, lunchMinutes] = lunchHourString.split(':').map(Number);

  const itemDate = new Date();
  itemDate.setHours(itemHours, itemMinutes);

  const lunchDate = new Date();
  lunchDate.setHours(lunchHours, lunchMinutes);

  return itemDate >= lunchDate;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

jobeditdialog.addEventListener('close', () => {
  let returnValue = jobeditdialog.returnValue;
  if (returnValue == 'cancel') {
    return
  }
  const formData = new FormData(jobeditform);
  let jobnum = formData.get('jobnumber');
  let jobcategory = formData.get('category');
  let time = formData.get('time');
  let timezone = formData.get('timezone');
  let sow = formData.get('sow');
  const id = jobeditdialog.originalTarget;
  const target = document.getElementById(id);
  let done = target.classList.contains('done')
  let note = formData.get('note');
  let city = target.getAttribute('data-city');
  let state = target.getAttribute('data-state');
  target.remove();
  new Job(jobnum, jobcategory, done, sow, time, timezone, note, city, state);
  if (jobcategory === 'Today' || jobcategory === 'Tomorrow') {
    sortCategoryBySched();
  } else if (jobcategory === 'Scheduled') {
    sortCategoryByDate();
  }
  jobeditform.reset();
  updateLocalStorage();
});

document.getElementById('copyJobBtn').addEventListener('click', () => {
  let target = document.getElementById(contextmenudialog.originalTarget)
  let targetText = target.textContent;
  let note = target.getAttribute('data-note');
  let noteText = '';
  if (note !== '') {
    targetText = targetText.split(note)[0];
    noteText = ' - ' + note;
  }
  copyToClipboard(targetText + noteText);
  contextmenudialog.close();
  copyText.textContent = 'Text copied to clipboard!'
  copyText.classList.remove('hidden');
  setTimeout(() => {
    copyText.classList.add('hidden')
  }, 2000);
});

document.getElementById('copslookupBtn').addEventListener('click', () => {
  jobid = contextmenudialog.originalTarget;
  window.open('https://copsapps.concerttech.com/COPSJobSiteManager/pfscreen5.aspx?jobid=' + jobid, '_blank');
  contextmenudialog.close();
});

contextmenucloseBtn.addEventListener('click', () => {
  contextmenudialog.returnValue = 'cancel';
  contextmenudialog.close();
});

editjobBtn.addEventListener('click', () => {
  closeAllDialogs();
  jobcontextOpen(contextmenudialog.originalEvent);
})

document.getElementById('configBtn').addEventListener('click', () => {
  if ('lunchhour' in localStorage) {
    const timeinput = configform.querySelector("input[name='lunchhour']");
    const colorinput = configform.querySelector("input[name='donecolor']");
    timeinput.value = localStorage['lunchhour'];
    colorinput.value = localStorage['donecolor'];
  }
  closeAllDialogs();
  configdialog.showModal();
});

configdialog.addEventListener('close', () => {
  if (configdialog.returnValue == 'cancel') {
    return;
  }
  setConfig();
});

document.getElementById('importqBtn').addEventListener('click', () => {
  closeAllDialogs();
  importdialog.show();
});

closeimportBtn.addEventListener('click', () => {
  importdialog.returnValue = 'cancel';
  importqfield.value = '';
  importdialog.close();
});

clearimportBtn.addEventListener('click', () => {
  importqfield.value = '';
});

document.getElementById('copyqBtn').addEventListener('click', () => {
  let queue_str = importqfield.value;
  import_jobs(queue_str);
  importqfield.value = '';
  importdialog.close();
  updateLocalStorage();
});

document.getElementById('copyImgBtn').addEventListener('click', () => {
  var bodyStyle = window.getComputedStyle(document.body);
  var bodyBackgroundColor = bodyStyle.backgroundColor || '#FFFFFF';
  html2canvas(document.getElementById('areas'), {
    backgroundColor: bodyBackgroundColor,
  }).then(canvas => {
    canvas.toBlob(function(blob) {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    }, 'image/png');
  });
  copyText.textContent = 'Image copied to clipboard!'
  copyText.classList.remove('hidden');
  setTimeout(() => {
    copyText.classList.add('hidden')
  }, 2000);
});

const reportdialog = document.getElementById('reportdialog');
const reportdialogBtn = document.getElementById('bugreportBtn');
const closereportBtn = reportdialog.querySelector('span');

reportdialogBtn.addEventListener('click', () => {
  closeAllDialogs();
  reportdialog.showModal();
})

closereportBtn.addEventListener('click', () => {
  reportdialog.close();
})

function toggleSideTray() {
  var tray = document.getElementById("sideTray");
  let btn = document.getElementById('schedJobBtn');
  let svg = document.getElementById('schedjobsvg');
  if (tray.classList.contains('open')) {
    tray.classList.remove('open');
    svg.classList.remove('reverse-arrow');
    btn.style.left = '0px';
  } else {
    tray.classList.add('open');
    svg.classList.add('reverse-arrow');
    btn.style.left = '250px';
  }
}
