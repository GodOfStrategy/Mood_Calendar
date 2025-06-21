const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const noteInput = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");
const emojiButtons = document.querySelectorAll("#emoji-box button");
const entryDisplay = document.getElementById("entryDisplay");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let viewedDate = new Date(); // currently shown month
let selectedMood = "";
let selectedDateStr = new Date().toDateString(); // selected date to save/edit

// Select emoji
emojiButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMood = btn.getAttribute("data-mood");
    emojiButtons.forEach(b => b.style.border = "none");
    btn.style.border = "2px solid black";
  });
});

// Save mood + optional note
saveBtn.addEventListener("click", () => {
  if (!selectedMood) {
    alert("Please pick a mood!");
    return;
  }

  let note = noteInput.value; // note can be empty
  localStorage.setItem(selectedDateStr, JSON.stringify({ mood: selectedMood, note }));

  buildCalendar(); // refresh calendar view
  noteInput.value = "";
  emojiButtons.forEach(b => b.style.border = "none");
  selectedMood = "";
  selectedDateStr = new Date().toDateString(); // reset back to today
  entryDisplay.style.display = "none";
});

// Navigation buttons
prevBtn.addEventListener("click", () => {
  viewedDate.setMonth(viewedDate.getMonth() - 1);
  buildCalendar();
});

nextBtn.addEventListener("click", () => {
  viewedDate.setMonth(viewedDate.getMonth() + 1);
  buildCalendar();
});

// Build calendar
function buildCalendar() {
  calendar.innerHTML = "";

  const year = viewedDate.getFullYear();
  const month = viewedDate.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = viewedDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  for (let day = 1; day <= daysInMonth; day++) {
    let date = new Date(year, month, day);
    let key = date.toDateString();
    let entry = JSON.parse(localStorage.getItem(key));
    let mood = entry ? entry.mood : "";

    let div = document.createElement("div");

    // Add weekday label (Mon, Tue, etc.)
    let weekdayShort = date.toLocaleString('default', { weekday: 'short' });
    div.innerHTML = `<small>${weekdayShort}</small><br>${day} ${mood}`;

    // Highlight today's date
    if (date.toDateString() === today.toDateString()) {
      div.style.backgroundColor = "#e0f7fa";
    }

    // Click to view/edit
    div.addEventListener("click", () => {
      selectedDateStr = key;

      if (entry) {
        noteInput.value = entry.note;
        selectedMood = entry.mood;

        emojiButtons.forEach(b => {
          b.style.border = b.getAttribute("data-mood") === selectedMood ? "2px solid black" : "none";
        });

        // Show "No note" if empty
        entryDisplay.innerHTML = `<strong>${key}</strong><br>Mood: ${entry.mood}<br>Note: ${entry.note || 'No note'}`;
        entryDisplay.style.display = "block";
      } else {
        noteInput.value = "";
        selectedMood = "";
        emojiButtons.forEach(b => b.style.border = "none");
        entryDisplay.style.display = "none";
      }
    });

    calendar.appendChild(div);
  }
}

// Run on page load
buildCalendar();
