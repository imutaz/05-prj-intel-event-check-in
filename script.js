// Get elements from the page
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");

// Set up variables
let totalCount = 0;
const goal = 50;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];

// Load saved progress from localStorage
function loadProgress() {
  const savedTotal = localStorage.getItem("totalCount");
  const savedTeams = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");
  if (savedTotal !== null) {
    totalCount = Number(savedTotal);
  }
  if (savedTeams !== null) {
    teamCounts = JSON.parse(savedTeams);
  }
  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
}

function saveProgress() {
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function updateDisplay() {
  attendeeCountSpan.textContent = totalCount;
  waterCountSpan.textContent = teamCounts["water"];
  zeroCountSpan.textContent = teamCounts["zero"];
  powerCountSpan.textContent = teamCounts["power"];
  const percent = (totalCount / goal) * 100;
  progressBar.style.width = `${percent}%`;
  // Update attendee list
  attendeeList.innerHTML = "";
  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    let teamLabel = "";
    if (attendee.team === "water") {
      teamLabel = "Team Water Wise";
    } else if (attendee.team === "zero") {
      teamLabel = "Team Net Zero";
    } else if (attendee.team === "power") {
      teamLabel = "Team Renewables";
    }
    const li = document.createElement("li");
    li.textContent = `${attendee.name} (${teamLabel})`;
    attendeeList.appendChild(li);
  }
}

function showCelebration() {
  // Find winning team
  let winningTeam = "";
  let maxCount = 0;
  for (let key in teamCounts) {
    if (teamCounts[key] > maxCount) {
      maxCount = teamCounts[key];
      winningTeam = key;
    }
  }
  let teamLabel = "";
  if (winningTeam === "water") {
    teamLabel = "Team Water Wise";
  } else if (winningTeam === "zero") {
    teamLabel = "Team Net Zero";
  } else if (winningTeam === "power") {
    teamLabel = "Team Renewables";
  }
  celebrationMessage.textContent = `🎉 Goal reached! ${teamLabel} wins! 🎉`;
  celebrationMessage.style.display = "block";
}

// Initial load
loadProgress();
updateDisplay();

// Listen for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get values from input and dropdown
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  // Only continue if both fields are filled
  if (name === "" || team === "") {
    greeting.textContent = "Please enter your name and select a team.";
    greeting.className = "";
    greeting.style.display = "block";
    return;
  }

  // Increment total count
  totalCount = totalCount + 1;

  // Increment correct team's count
  teamCounts[team] = teamCounts[team] + 1;

  // Combine name and team into welcome message
  let teamLabel = "";
  if (team === "water") {
    teamLabel = "Team Water Wise";
  } else if (team === "zero") {
    teamLabel = "Team Net Zero";
  } else if (team === "power") {
    teamLabel = "Team Renewables";
  }
  const message = `Welcome, ${name}! You are on ${teamLabel}.`;

  // Show success message
  greeting.textContent = message;
  greeting.className = "success-message";
  greeting.style.display = "block";

  attendees.push({ name: name, team: team });

  updateDisplay();
  saveProgress();

  if (totalCount >= goal) {
    showCelebration();
  } else {
    celebrationMessage.style.display = "none";
  }

  // Reset the form
  form.reset();
});
