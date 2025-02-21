// assets/js/tambola.js

// Global game variables
let availableNumbers = [];
let recentNumbers = [];
const sizes = ["1.6em", "1.8em", "2em", "2.2em", "2.4em"];
const recencyColors = ["#B0E0E6", "#87CEEB", "#6495ED", "#4169E1", "#00008B"];
let announcementTimer = null;

// DOM element references
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const voiceSelect = document.getElementById("voiceSelect");
const recentNumbersDiv = document.getElementById("recentNumbers");
const numberGrid = document.getElementById("numberGrid");

// Build grid cells for numbers 1 to 90
function initGrid() {
  numberGrid.innerHTML = "";
  for (let i = 1; i <= 90; i++) {
    const cell = document.createElement("div");
    cell.classList.add("number");
    cell.id = "num-" + i;
    cell.textContent = i;
    numberGrid.appendChild(cell);
  }
}

// Initialize/reset game
function initGame() {
  availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  recentNumbers = [];
  nextBtn.disabled = false;
  recentNumbersDiv.innerHTML = "";
  initGrid();
}

// Update recent numbers display
function updateRecentDisplay() {
  recentNumbersDiv.innerHTML = "";
  const count = recentNumbers.length;
  const startIndex = 5 - count;
  recentNumbers.forEach((num, index) => {
    const span = document.createElement("span");
    span.classList.add("recent-number");
    span.textContent = num;
    span.style.fontSize = sizes[startIndex + index];
    span.style.color = recencyColors[startIndex + index];
    recentNumbersDiv.appendChild(span);
  });
}

// Convert a number to words
function numberToWords(num) {
  const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
                "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (num < 20) return ones[num];
  const tenPart = Math.floor(num / 10);
  const onePart = num % 10;
  return onePart === 0 ? tens[tenPart] : tens[tenPart] + " " + ones[onePart];
}

// Create announcement text
function numberAnnouncementText(num) {
  const padded = num < 10 ? "0" + num : num.toString();
  const digitWords = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
                       "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine" };
  return padded.split("").map(d => digitWords[d]).join(" ");
}

// Announce next number with debounce
nextBtn.addEventListener("click", () => {
  if (availableNumbers.length === 0) {
    showWinnerPopup("Congratulations! All numbers announced.");
    return;
  }
  if (announcementTimer) {
    clearTimeout(announcementTimer);
    speechSynthesis.cancel();
  }
  const announcedNumber = availableNumbers.splice(Math.floor(Math.random() * availableNumbers.length), 1)[0];
  const cell = document.getElementById("num-" + announcedNumber);
  if (cell) cell.classList.add("marked");
  recentNumbers.push(announcedNumber);
  if (recentNumbers.length > 5) recentNumbers.shift();
  updateRecentDisplay();
  
  announcementTimer = setTimeout(() => {
    if (localStorage.getItem("isMuted") === "true" || !('speechSynthesis' in window)) return;
    let digitUtterance = new SpeechSynthesisUtterance(numberAnnouncementText(announcedNumber));
    digitUtterance.lang = 'en-US';
    digitUtterance.rate = 0.9;
    let numberUtterance = new SpeechSynthesisUtterance(numberToWords(announcedNumber));
    numberUtterance.lang = 'en-US';
    numberUtterance.rate = 0.9;
    const voices = speechSynthesis.getVoices();
    const selectedVoiceValue = voiceSelect.value;
    const selectedVoice = voices.find(v => (v.name + "|" + v.lang) === selectedVoiceValue);
    if (selectedVoice) {
      digitUtterance.voice = selectedVoice;
      numberUtterance.voice = selectedVoice;
    }
    if (availableNumbers.length === 0) {
      digitUtterance.onend = () => {
        setTimeout(() => {
          speechSynthesis.speak(numberUtterance);
          numberUtterance.onend = () => {
            playTriumphMusic();
            showWinnerPopup("Congratulations! All numbers announced.");
          };
        }, 200);
      };
    } else {
      digitUtterance.onend = () => {
        setTimeout(() => {
          speechSynthesis.speak(numberUtterance);
        }, 200);
      };
    }
    speechSynthesis.speak(digitUtterance);
  }, 500);
});

// Restart game using custom confirm popup if needed
restartBtn.addEventListener("click", () => {
  if (availableNumbers.length !== 90) {
    showConfirmPopup("Restarting will reset all numbers. Proceed?", function(confirmed) {
      if (confirmed) {
        if (speechSynthesis.speaking) speechSynthesis.cancel();
        restartGame();
      }
    });
  } else {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    restartGame();
  }
});

// Restart game function
function restartGame() {
  fadeOutAndRemove(document.querySelector('.overlay'));
  fadeOutAndRemove(document.querySelector('.game-popup'));
  initGame();
}
window.restartGame = restartGame; // Expose globally

initGame();