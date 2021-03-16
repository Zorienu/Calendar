let inputDate = new Date();
let selectedDate = null;
let monthArray = [];
let notes = [];

const actualDate = new Date();
let year = actualDate.getFullYear();
let month = actualDate.getMonth();

const actualDay = new Date(year, month, actualDate.getDate());
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const stringToHTML = (s) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, "text/html");
  return doc.body.firstChild;
};

const obtainInputDate = () => {
  const dateInput = document.getElementById("input-date");
  const selectDateButton = document.getElementById("select-date");
  selectDateButton.addEventListener("click", () => {
    const userDate = dateInput.value.split("-");
    year = userDate[0];
    month = userDate[1] - 1;
    const day = userDate[2];

    inputDate = new Date(year, month, day);
    createMonth(year, month);
  });
};

const setYearAndMonth = (year, month) => {
  const container = document.getElementById("year-month");
  container.innerText = `${year}, ${months[month]}`;
};

const createMonth = (year, month) => {
  setYearAndMonth(year, month);
  monthArray = [];
  monthArray.push(new Date(year, month, 1));

  for (let i = 2; i <= 31; i++) {
    const date = new Date(year, month, i);
    if (date.getMonth() === monthArray[monthArray.length - 1].getMonth())
      monthArray.push(date);
    else break;
  }
  renderMonth();
};

const getTimeDiff = () => {};

const listNotes = () => {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  notes.forEach((note) => {
    const year = note.date.getFullYear();
    const month = note.date.getMonth() + 1;
    const day = note.date.getDate();

    const noteElement = stringToHTML(
      `<div class="note">${year}/${month}/${day} - ${note.note}</div>`
    );
    notesList.appendChild(noteElement);
  });
};

const addNote = () => {
  const addNoteBtn = document.getElementById("add-note-btn");

  addNoteBtn.addEventListener("click", () => {
    const noteInput = document.getElementById("note-body");
    const newNote = { note: noteInput.value, date: selectedDate || actualDay };
    notes.push(newNote);
    listNotes();
    renderMonth();
  });
};

const renderMonth = () => {
  const table = document.getElementById("table-days");
  table.innerHTML = "";
  const renderedMonth = [];
  const firstDay = monthArray[0];

  monthArray.forEach((day, index) => {
    renderedMonth[firstDay.getDay() + index] = day;
  });

  for (let i = 0; i < renderedMonth.length; i++) {
    const day = renderedMonth[i];
    const isUserDate = day && inputDate.getTime() === day.getTime();
    const isSelectedDate =
      day && selectedDate && selectedDate.getTime() === day.getTime();
    const isActualDate = day && actualDay.getTime() === day.getTime();

    let hasNote = false;
    notes.forEach((note) => {
      if (note.date === day) hasNote = true;
    });

    const dayElement = stringToHTML(
      `<div class="day-tile ${isUserDate && "user-date"} ${
        isSelectedDate && "selected-date"
      } ${isActualDate && "actual-date"} ${hasNote && "has-note"}">${
        day ? day.getDate() : ""
      }</div>`
    );

    dayElement.addEventListener("click", () => {
      selectedDate = day;
      renderMonth();
      getTimeDiff();
    });
    table.appendChild(dayElement);
  }
};

const setEventsButtons = () => {
  const prevMonthButton = document.getElementById("prev-month-btn");
  const nextMonthButton = document.getElementById("next-month-btn");

  prevMonthButton.addEventListener("click", () => {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    createMonth(year, month);
  });

  nextMonthButton.addEventListener("click", () => {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    createMonth(year, month);
  });

  const prevYearButton = document.getElementById("prev-year-btn");
  const nextYearButton = document.getElementById("next-year-btn");

  prevYearButton.addEventListener("click", () => {
    year -= 1;
    createMonth(year, month);
  });

  nextYearButton.addEventListener("click", () => {
    console.log("next year");
    year += 1;
    createMonth(year, month);
  });
};

window.onload = () => {
  const app = document.getElementById("app");
  obtainInputDate();
  setEventsButtons();
  createMonth(year, month);
  addNote();
};
