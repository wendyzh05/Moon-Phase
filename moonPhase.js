/*
Pages available to check
Credits

Inspiration 
//https://editor.p5js.org/Pole/sketches/A3DLjxk7g

Data/Sources
https://griffithobservatory.lacity.gov/explore/observing-the-sky/whats-in-the-sky/the-moon/2026-phases-of-the-moon/
https://aa.usno.navy.mil/data/MoonPhases

Drawing Moon
https://archive.p5js.org/learn/curves.html
https://p5js.org/tutorials/custom-shapes-and-smooth-curves/
https://p5js.org/reference/p5/beginShape/

p5.js
https://p5js.org/reference/p5/vertex/
https://p5js.org/reference/p5/map/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

Used AI to calculate the moon phases and get help with slider
*/

const YEAR = 2026;

let selectedMonth = 0;
let selectedDay = 15;
let moonPhase = 0;

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const monthNames = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const phaseNames = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent"
];

const lunarCycle = 29.530588853;

function setup() {
  createCanvas(1000, 850);
  textFont("Georgia");
}

function draw() {
  background(12, 25, 39);

  drawStars();
  drawHeader();
  drawMonths();

  const date = new Date(YEAR, selectedMonth, selectedDay);
  moonPhase = getLunarPhase(date);

  drawMoon(width / 2, 390, 300, moonPhase);

  drawDateInfo();
  drawSlider();
}

function drawStars() {
  randomSeed(25);
  noStroke();

  for (let i = 0; i < 85; i++) {
    const x = random(width);
    const y = random(170, 590);
    const size = random(1, 3);

    fill(220, 220, 240, random(70, 180));
    circle(x, y, size);
  }
}

function drawHeader() {
  textAlign(CENTER, CENTER);
  noStroke();

  fill(246, 232, 194);
  textSize(32);
  text("Moon Phase Calendar (Northern Hemisphere)", width / 2, 43);

  fill(166, 181, 198);
  textSize(13);
  text("Moon phases and dates are estimates", width / 2, 76);

  stroke(65, 79, 95);
  line(65, 103, 935, 103);
  noStroke();
}

function drawMonths() {
  const startX = 65;
  const tabWidth = 72.5;

  for (let i = 0; i < 12; i++) {
    const x = startX + i * tabWidth;

    if (i === selectedMonth) {
      noStroke();
      fill(217, 199, 240);
      rect(x + 2, 117, tabWidth - 4, 34, 9);
      fill(40, 35, 57);
    } else {
      fill(166, 181, 198);
    }

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(months[i], x + tabWidth / 2, 134);
  }
}

function drawMoon(x, y, size, phase) {
  const r = size / 2;

  noStroke();
  fill(47, 59, 78);
  circle(x, y, size);

  noFill();
  stroke(217, 199, 240, 25);
  strokeWeight(12);
  circle(x, y, size + 12);
  noStroke();
  strokeWeight(1);

  const terminator = cos(TWO_PI * phase);

  // New moon
  if (phase < 0.005 || phase > 0.995) {
    return;
  }

  // Full moon
  if (abs(phase - 0.5) < 0.005) {
    fill(255, 244, 202);
    circle(x, y, size);
    drawMoonDetails(x, y, r);
    return;
  }

  // Waxing and waning illumination
  fill(255, 244, 202);
  beginShape();

  if (phase < 0.5) {
    // Waxing
    for (let yy = -r; yy <= r; yy += 2) {
      const edge = sqrt(max(0, r * r - yy * yy));
      vertex(x + terminator * edge, y + yy);
    }

    for (let yy = r; yy >= -r; yy -= 2) {
      const edge = sqrt(max(0, r * r - yy * yy));
      vertex(x + edge, y + yy);
    }
  } else {
    // Waning
    for (let yy = -r; yy <= r; yy += 2) {
      const edge = sqrt(max(0, r * r - yy * yy));
      vertex(x - edge, y + yy);
    }

    for (let yy = r; yy >= -r; yy -= 2) {
      const edge = sqrt(max(0, r * r - yy * yy));
      vertex(x - terminator * edge, y + yy);
    }
  }

  endShape(CLOSE);
  drawMoonDetails(x, y, r);
}

function drawMoonDetails(x, y, r) {
  noStroke();
  fill(185, 174, 139, 65);

  circle(x - r * 0.25, y - r * 0.20, r * 0.18);
  circle(x + r * 0.25, y + r * 0.12, r * 0.13);
  circle(x - r * 0.12, y + r * 0.42, r * 0.10);
  circle(x + r * 0.38, y - r * 0.38, r * 0.08);
}

function drawDateInfo() {
  const date = new Date(YEAR, selectedMonth, selectedDay);
  const illumination = getIllumination(moonPhase);
  const age = moonPhase * lunarCycle;
  const nextPhase = getNextPhase(moonPhase);
  const daysUntil = getDaysUntilNextPhase(moonPhase);

  textAlign(CENTER, CENTER);
  noStroke();

  // Selected date
  fill(246, 232, 194);
  textSize(25);
  text(
    monthNames[selectedMonth] + " " + selectedDay + ", " + YEAR,
    width / 2,
    585
  );

  // Current moon phase
  fill(217, 199, 240);
  textSize(19);
  text(getPhaseName(moonPhase), width / 2, 618);

  // Illumination information
  fill(246, 232, 194);
  textSize(14);
  text(
    "Illumination: " + illumination.toFixed(1) + "%",
    width / 2,
    650
  );

  // Moon age
  fill(166, 181, 198);
  textSize(12);
  text(
    "Moon age: " + age.toFixed(1) + " days",
    width / 2,
    674
  );

  // Next major phase
  text(
    "Next: " + nextPhase + " in about " + daysUntil + " days",
    width / 2,
    697
  );
}

//Used AI help to create a custom slider due to some technical problems with the built-in createSlider()
function drawSlider() {
  let left = 170;
  let right = 830;
  let y = 735;
  let lastDay = getDaysInMonth(selectedMonth);

  // Draw the slider line
  stroke(100);
  strokeWeight(5);
  line(left, y, right, y);
  let knobX = map(selectedDay, 1, lastDay, left, right);

  fill(217, 199, 240);
  noStroke();
  circle(knobX, y, 18);

  fill(200);
  textSize(11);
  textAlign(CENTER);

  for (let day = 1; day <= lastDay; day++) {
    if (day === 1 || day % 5 === 0 || day === lastDay) {
      let x = map(day, 1, lastDay, left, right);
      text(day, x, 765);
    }
  }

  text("Drag to change the date", width / 2, 805);
}

//AI used for this portion to calculate the moon phases, but used a valid source to ensure accuracy
// Approximate lunar phase from a known date of a new moon
function getLunarPhase(date) {
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);

  const selectedDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12
  );

  const daysSinceNewMoon =
    (selectedDate - knownNewMoon) / 86400000;

  return ((daysSinceNewMoon / lunarCycle) % 1 + 1) % 1;
}

// Percentage of illumination
function getIllumination(phase) {
  return (1 - cos(TWO_PI * phase)) * 50;
}
//End of AI portion

function getPhaseName(phase) {
  const index = floor(((phase + 1 / 16) % 1) * 8);
  return phaseNames[index];
}

function getDaysInMonth(month) {
  return new Date(YEAR, month + 1, 0).getDate();
}

function getNextPhase(phase) {
  const nextIndex = floor(phase * 4) + 1;
  const names = [
    "New Moon",
    "First Quarter",
    "Full Moon",
    "Last Quarter",
    "New Moon"
  ];

  return names[nextIndex];
}

function getDaysUntilNextPhase(phase) {
  const nextQuarter = (floor(phase * 4) + 1) / 4;
  let distance = (nextQuarter - phase) * lunarCycle;

  if (distance <= 0) {
    distance += lunarCycle;
  }

  return max(1, round(distance));
}

function selectDayFromMouse() {
  const left = 170;
  const right = 830;
  const y = 735;
  const lastDay = getDaysInMonth(selectedMonth);

  if (mouseY < y - 25 || mouseY > y + 25) return;
  if (mouseX < left - 15 || mouseX > right + 15) return;

  selectedDay = constrain(
    round(map(mouseX, left, right, 1, lastDay)),
    1,
    lastDay
  );
}

function mousePressed() {
  const startX = 65;
  const tabWidth = 72.5;

  if (
    mouseY >= 117 &&
    mouseY <= 151 &&
    mouseX >= startX &&
    mouseX < 935
  ) {
    selectedMonth = constrain(
      floor((mouseX - startX) / tabWidth),
      0,
      11
    );

    selectedDay = min(
      selectedDay,
      getDaysInMonth(selectedMonth)
    );

    return;
  }

  selectDayFromMouse();
}

function mouseDragged() {
  selectDayFromMouse();
}
