// assets/js/tictactoe.js

const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = true;

// Helper: Fade out and remove element is in common.js

// Play triumphant music is in common.js
// Create board cells for Tic Tac Toe
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('button');
  cell.classList.add('cell');
  cell.setAttribute('data-index', i);
  cell.addEventListener('click', handleCellClick);
  board.appendChild(cell);
}

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute('data-index');
  if (gameBoard[index] === '' && gameActive) {
    gameBoard[index] = currentPlayer;
    cell.setAttribute('data-player', currentPlayer);
    cell.disabled = true;
    if (checkWinner()) {
      const winningCells = getWinningCells();
      highlightWinningCells(winningCells);
      playTriumphMusic();
      setTimeout(() => {
        showWinnerPopup(`Player ${currentPlayer} wins!`);
      }, 200);
      gameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
      playTriumphMusic();
      setTimeout(() => {
        showWinnerPopup("It's a draw!");
      }, 200);
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
      status.setAttribute('data-player', currentPlayer);
    }
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] !== '' &&
           gameBoard[a] === gameBoard[b] &&
           gameBoard[a] === gameBoard[c];
  });
}

function getWinningCells() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] !== '' &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]) {
      return pattern;
    }
  }
  return [];
}

function highlightWinningCells(cells) {
  cells.forEach(index => {
    const cell = board.children[index];
    cell.classList.add('winner');
  });
}

function showWinnerPopup(message) {
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
      <a href="../index.html" class="btn">Back to Home</a>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

// Restart game function
function restartGame() {
  fadeOutAndRemove(document.querySelector('.overlay'));
  fadeOutAndRemove(document.querySelector('.game-popup'));
  initGame();
}
window.restartGame = restartGame;

restartBtn.addEventListener('click', () => {
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  restartGame();
});

function initGame() {
  gameBoard = Array(9).fill('');
  gameActive = true;
  currentPlayer = 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
  status.setAttribute('data-player', currentPlayer);
  Array.from(document.querySelectorAll('.cell')).forEach(cell => {
    cell.disabled = false;
    cell.classList.remove('winner');
    cell.removeAttribute('data-player');
  });
}

initGame();