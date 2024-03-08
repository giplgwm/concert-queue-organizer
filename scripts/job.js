class Job {
  constructor(num, category, done = false, sow = '', time = '', timezone = '', note = '', city = '', state = '') {
    this.num = num;
    this.category = category;
    this.done = done;
    this.sow = sow;
    this.time = time;
    this.timezone = timezone;
    this.note = note;
    this.city = city;
    this.state = state;
    this.createJob();
  }

  createJob() {
    const todayDiv = document.getElementById(this.category);
    const childDiv = todayDiv.querySelector('.dragbox');
    const newFieldset = document.createElement('fieldset');
    newFieldset.setAttribute('draggable', 'true');
    newFieldset.setAttribute('ondragstart', 'drag(event)');
    newFieldset.setAttribute('id', this.num);
    newFieldset.setAttribute('class', 'job');
    newFieldset.setAttribute('data-sow', this.sow);
    newFieldset.setAttribute('data-time', this.time);
    newFieldset.setAttribute('data-tz', this.timezone);
    newFieldset.addEventListener('dblclick', markDone);
    newFieldset.addEventListener('contextmenu', contextmenuopen);
    newFieldset.classList.add('fade-in-up');
    setTimeout(() => {
      newFieldset.classList.remove('fade-in-up')
    }, 1000);
    if (this.done) { newFieldset.classList.add('done'); }
    newFieldset.innerText = this.num;
    //add SOW
    if (this.sow) { newFieldset.innerText += ' - ' + this.sow; }
    //add Time
    if (this.time) { newFieldset.innerText += ' - ' + this.convertTo12HrFormat(this.time); }
    if (this.time && this.timezone) {
      newFieldset.innerText += '\xa0' + this.timezone + '\xa0';
    }
    newFieldset.setAttribute('data-note', this.note);
    newFieldset.setAttribute('data-city', this.city);
    newFieldset.setAttribute('data-state', this.state);

    if (this.city !== '' && this.state !== '') {
      newFieldset.innerText += `\n${this.city},\xa0${this.state}`;
    }

    if (this.note !== '') {
      newFieldset.innerHTML += `<hr>${this.note}`;
    }

    childDiv.appendChild(newFieldset);
  }

  convertTo12HrFormat(time24) {
    const [hours, minutes] = time24.split(':');
    const hoursIn12HrFormat = ((hours % 12) || 12);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hoursIn12HrFormat}:${minutes} ${ampm}`;
  }

}