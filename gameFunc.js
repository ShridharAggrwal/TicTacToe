document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");
  const resetButton = document.getElementById("reset");
  const scoreX = document.getElementById("scoreX");
  const scoreO = document.getElementById("scoreO");
  const firstPlayerSelect = document.getElementById("firstPlayer");

  let currentPlayer = "X";
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let gameOver = false;

  // Load scores from localStorage
  const loadScores = () => {
    const storedScores = JSON.parse(localStorage.getItem('scores')); // Get scores from localStorage
    if (storedScores) {
      scoreX.textContent = storedScores.X;  // Set stored score for X
      scoreO.textContent = storedScores.O;  // Set stored score for O
    }
  };

  loadScores();  // Call to load scores when the game starts

  // Update the scores in localStorage
  const updateScoresInLocalStorage = () => {
    const scores = {
      X: parseInt(scoreX.textContent),
      O: parseInt(scoreO.textContent),
    };
    localStorage.setItem('scores', JSON.stringify(scores)); // Store scores in localStorage
  };

  const firstPlayerChange = () => {
    currentPlayer = firstPlayerSelect.value;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    resetGame();
  };

  firstPlayerSelect.addEventListener("change", firstPlayerChange);

  const cellClick = (event) => {
    const cell = event.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameBoard[index] !== "") {
      alert("This cell is already occupied! Please choose a different one.");
      return;
    }

    cell.textContent = currentPlayer;
    gameBoard[index] = currentPlayer;

    checkWinner();

    if (!gameOver) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  };

  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        gameBoard[a] &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
      ) {
        statusText.textContent = `Player ${gameBoard[a]} wins!`;

        if (gameBoard[a] === "X") {
          scoreX.textContent = parseInt(scoreX.textContent) + 1;
        } else {
          scoreO.textContent = parseInt(scoreO.textContent) + 1;
        }

        updateScoresInLocalStorage(); // Update scores in localStorage

        gameOver = true;
        setTimeout(() => {
          alert(`Player ${currentPlayer} wins!`);
          resetBoard(); // Clear the board after a win
        }, 100);
        return;
      }
    }

    if (!gameBoard.includes("")) {
      statusText.textContent = "It's a draw!";
      gameOver = true;
      setTimeout(() => {
        alert("It's a draw!");
        resetBoard(); // Clear the board after a draw
      }, 100);
    }
  };

  const resetGame = () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    cells.forEach((cell) => (cell.textContent = ""));
    gameOver = false;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  };

  // Reset the board and set turn back to the first player after a win/draw
  const resetBoard = () => {
    setTimeout(() => {
      gameBoard = ["", "", "", "", "", "", "", "", ""];
      cells.forEach((cell) => (cell.textContent = ""));
      currentPlayer = firstPlayerSelect.value; // Set current player to the first selected player
      statusText.textContent = `Player ${currentPlayer}'s turn`;
      gameOver = false; // Reset gameOver flag
    }, 1000); // Delay the reset slightly to give players time to see the result
  };

  resetButton.addEventListener("click", () => {
    resetGame();
    localStorage.removeItem('scores'); // Clear stored scores
    scoreX.textContent = "0"; // Reset Player X's score
    scoreO.textContent = "0"; // Reset Player O's score
  });

  cells.forEach((cell) => {
    cell.addEventListener("click", cellClick);
});
});