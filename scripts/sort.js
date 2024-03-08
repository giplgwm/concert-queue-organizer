function sortCategoryBySched() {
  const categories = ['Today', 'Tomorrow'];
  const timezoneOffsets = {
    'EST': +5, // Eastern Standard Time
    'AST': +4, // Atlantic Standard Time
    'PST': +8, // Pacific Standard Time
    'MST': +7, // Mountain Standard Time
    'CST': +6,  // Central Standard Time
    'HAST': +10, //Hawaiin Alaueiosnjstion Time - Basically alien time
    'AKST': +9, //Alaska Sucks Time
  };

  categories.forEach(item => {
    let container = document.getElementById(item).querySelector('.dragbox');
    let jobs = Array.from(container.children);

    jobs.sort((a, b) => {
      let timeA = a.getAttribute('data-time');
      let tzA = a.getAttribute('data-tz');
      let timeB = b.getAttribute('data-time');
      let tzB = b.getAttribute('data-tz');
      if (timeA === '' && timeB === '') {
        return 0; // Both are undefined, consider them equal
      } else if (timeA === '') {
        return 1; // Sort a to the end
      } else if (timeB === '') {
        return -1; // Sort b to the end
      }
      if (!timezoneOffsets.hasOwnProperty(tzA)) {
        tzA = 'EST';
      }
      if (!timezoneOffsets.hasOwnProperty(tzB)) {
        tzB = 'EST';
      }
      // Convert times to a common basis for comparison
      let totalMinutesA = convertToMinutes(timeA, timezoneOffsets[tzA]);
      let totalMinutesB = convertToMinutes(timeB, timezoneOffsets[tzB]);

      return totalMinutesA - totalMinutesB;
    });

    jobs.forEach(job => container.appendChild(job));
  });
}

function sortCategoryByDate() {
  category = 'Scheduled';
  let container = document.getElementById(category).querySelector('.dragbox');
  let jobs = Array.from(container.children);
  jobs.sort((a, b) => {
    let dateA = a.getAttribute('data-note');
    let dateB = b.getAttribute('data-note');
    if (isNaN(dateA[0]) && isNaN(dateB[0])) {
      return 0;
    }
    if (isNaN(dateA[0])) {
      return 1;
    }
    if (isNaN(dateB[0])) {
      return -1;
    }
    dateA = Date.parse(dateA)
    dateB = Date.parse(dateB)
    
    if (isNaN(dateA) && isNaN(dateB)) {
      return 0;
    }
    if (isNaN(dateA)) {
      return 1;
    }
    if (isNaN(dateB)) {
      return -1;
    }
    return dateA - dateB;
  });
  jobs.forEach(job => container.appendChild(job));
}

function convertToMinutes(time, timezoneOffset) {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours + timezoneOffset) * 60 + minutes;
}