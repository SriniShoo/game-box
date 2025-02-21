// assets/js/common.js
// Common helper functions used across the app

function fadeOutAndRemove(el) {
  if (!el) return;
  el.classList.add("fade-out");
  setTimeout(() => {
    el.remove();
  }, 300); // Duration matches the CSS transition duration
}

function playTriumphMusic() {
  if (localStorage.getItem("isMuted") === "true") return;
  const audio = new Audio("assets/audio/triumph.mp3");
  audio.play().catch(err => console.error("Failed to play triumph music:", err));
}

function showWinnerPopup(message) {
  // Remove any existing popup/overlay with fade out
  fadeOutAndRemove(document.querySelector('.overlay'));
  fadeOutAndRemove(document.querySelector('.game-popup'));
  
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const popup = document.createElement('div');
  popup.className = 'game-popup';
  popup.innerHTML = `
    <h2>${message}</h2>
    <div class="popup-buttons">
      <button class="btn" onclick="restartGame()">Play Again</button>
      <a href="/index.html" class="btn">Back to Home</a>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

function showConfirmPopup(message, onConfirm) {
  fadeOutAndRemove(document.querySelector('.overlay'));
  fadeOutAndRemove(document.querySelector('.game-popup'));
  
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const popup = document.createElement('div');
  popup.className = 'game-popup';
  popup.innerHTML = `
    <h2>${message}</h2>
    <div class="popup-buttons">
      <button class="btn" id="confirmYesBtn">Yes</button>
      <button class="btn" id="confirmNoBtn">No</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  document.getElementById('confirmYesBtn').addEventListener('click', function() {
    fadeOutAndRemove(overlay);
    fadeOutAndRemove(popup);
    onConfirm(true);
  });
  document.getElementById('confirmNoBtn').addEventListener('click', function() {
    fadeOutAndRemove(overlay);
    fadeOutAndRemove(popup);
    onConfirm(false);
  });
}

// Expose common functions globally so inline event handlers can access them
window.fadeOutAndRemove = fadeOutAndRemove;
window.playTriumphMusic = playTriumphMusic;
window.showWinnerPopup = showWinnerPopup;
window.showConfirmPopup = showConfirmPopup;