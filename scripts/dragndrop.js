function allowDrop(ev) {
  ev.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  const data_element = document.getElementById(data);

  let dropTarget = event.target.closest('.dragbox');

  if (dropTarget) {
    if (data_element.getAttribute('data-lasttimeout') !== null) {
      clearTimeout(data_element.getAttribute('data-lasttimeout'));
    }

    dropTarget.appendChild(data_element);
    data_element.classList.add('fade-in-up');
    data_element.setAttribute('data-lasttimeout', setTimeout(() => {
      data_element.classList.remove('fade-in-up')
    }, 1000))
    let category = dropTarget.closest('.category');
    if (category.id === 'Scheduled') {
      sortCategoryByDate();
    } else if (category.id === 'Today' || category.id === 'Tomorrow') {
      sortCategoryBySched();
    }
    updateLocalStorage();
  }
}

function trash(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  document.getElementById(data).remove();
  updateLocalStorage();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}