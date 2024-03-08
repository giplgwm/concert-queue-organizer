let string_prefix = `Job SearchExpand
  Find a job
  JobID	
  Lecid	
  Site ID	
  Customer order number	
  Account Name	
  Site Name	
  ID1	
  Address	
  ID2	
  City	
  ID3	
  State	
  ...
  ID4	
  Zip Code	
  Job date:    Between	

  Assigned to me		And	

  Condition	
  And	Or
  Due Date Scheduled Date Completion Date 
  Number of jobs: 19
  Note: Double click on a row will load job to tabs
  Job#	Account	CN#	SiteID	Sched.Date&Time 	Due Date	Cust# Last Update	CUD#	Pf	City	State	Status	EQ	 
`

function import_jobs(string_entered) {
  if (string_entered === '') {
    return;
  }
  let string_fixed = '';

  if (string_entered.includes('Pf	City	State	Status	EQ	')) {
    string_fixed = string_entered.split("Pf	City	State	Status	EQ	")[1];
  } else {
    string_fixed = string_entered;
  }
  const jobEntries = string_fixed.trim().split(/^|\n(?=\d+\t)/m);
  const timezonefinish = {
    'AT': 'AST',
    'AKT': 'AKST',
    'ET': 'EST',
    'MT': 'MST',
    'PT': 'PST',
    'CT': 'CST',
    'HT': 'HAST',
    'HST': 'HAST',
    'HAS': 'HAST',
    'KST': 'AKST',
    'AKS': 'AKST',
  }
  let nowDate = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(nowDate.getDate() + 1);
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  jobEntries.forEach(jobEntry => {
    const info = jobEntry.split('\t');
    const num = info[0];

    let date_str = info[4];
    const status = info[6];
    const city = info[9];
    const state = info[10];
    let sow = '';
    if (status.includes('Install')) {
      sow = 'Install';
    } else if (status.includes('Site Survey')) {
      sow = 'Survey';
    } else if (status.includes('Extend/Test/I')) {
      sow = 'Extend/Test/Install';
    } else if (status.includes('Issue')) {
      sow = 'Issues';
    } else if (status.includes('On Hold')) {
      sow = 'On Hold';
    } else if (status.includes('Extend and Test')) {
      sow = 'Extend and Test';
    } else if (status.includes('Uninstall')) {
      sow = 'Uninstall';
    } else if (status.includes('Revisit')) {
      sow = 'Revisit';
    }
    if (sow === '') {
      console.log(status)
    }

    let category = '';
    let time = '';
    let timeZone = '';
    let date_note = '';

    try {
      if (date_str.length < 5) {
        date = ''
        category = 'Unscheduled'
      }
      else {
        let timezone_str = date_str.split(' ').pop().replace('D', 'S');
        if (timezone_str === 'AM' || timezone_str === 'PM') {
          timezone_str = '';
        }
        if (timezone_str in timezonefinish) {
          timezone_str = timezonefinish[timezone_str];
        }
        timeZone = timezone_str;

        date = new Date(Date.parse(date_str.substring(0, date_str.length - timeZone.length)));



        // Check if the year, month, and day of the month are the same
        let isSameDay = date.getFullYear() === nowDate.getFullYear() &&
          date.getMonth() === nowDate.getMonth() &&
          date.getDate() === nowDate.getDate();


        let isTomorrow = date.getFullYear() === tomorrow.getFullYear() &&
          date.getMonth() === tomorrow.getMonth() &&
          date.getDate() === tomorrow.getDate();

        if (isSameDay) {
          category = 'Today'
        } else if (isTomorrow) {
          category = 'Tomorrow'
        } else if (date > tomorrow) {
          category = 'Scheduled'
        }
        if (status.includes('Completed') || status.includes('Issue')) {
          category = 'Completed'
        }
        let hours = date.getHours();
        let minutes = date.getMinutes();

        // Formatting hours and minutes to ensure two digits
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');

        /**  timeZone = date_str.substring(date_str.length - 3)
        if (timeZone.charAt(1) === 'D') {
          timeZone = timeZone.charAt(0) + 'S' + timeZone.charAt(2);
        } */ //This shit is stupid. Dumbass. More adaptable version up above.


        // Combine hours and minutes for 24-hour format
        let timeIn24HourFormat = hours + ':' + minutes;
        time = timeIn24HourFormat || time;

        if (category === 'Scheduled') {
          date_note = (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate() + '/' + date.getFullYear()
        }



      }
    } catch (TypeError) {
      return;
    } finally {
      if (category !== '') {
        if (document.getElementById(num) !== null) {
          if (document.getElementById(num).parentElement.parentElement.id !== category) {
            document.getElementById(num).remove();
          }
          else return;
        }
        new Job(num, category, false, sow, time, timeZone, date_note, city, state);
      }
    }

  });
  sortCategoryBySched();
  sortCategoryByDate();
}