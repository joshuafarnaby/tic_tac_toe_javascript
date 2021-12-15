const playerFactory = (name, token) => {
  let score = 0;

  const getName = () => name;
  const getToken = () => token;
  const getScore = () => score;
  const increaseScore = () => score++
  const takeTurn = (gameboard, position) => {
    gameboard[position] = token
  }

  return {
    getName,
    getToken,
    getScore,
    increaseScore,
    takeTurn
  }
}

const gameboard = (function () {
  const _internalGameboard = ['', '', '', '', '', '', '', '', ''];
  const _externalGameboard = Array.from(document.querySelectorAll('[data-square]'));
  const _externalGameboardParent = _externalGameboard[0].parentElement;

  _externalGameboardParent.classList.add('x');

  const internalGameboard = () => _internalGameboard;
  const externalGameboard = () => _externalGameboard;
  const setDefaultExternalGameboardClass = () => {
    if (_externalGameboardParent.classList.contains('o')) {
      _externalGameboardParent.classList.remove('o');
    }
    _externalGameboardParent.classList.add('x');
  }
  const toggleExternalGameboardClass = () => {
    if (_externalGameboardParent.classList.contains('x')) {
      _externalGameboardParent.classList.remove('x');
      _externalGameboardParent.classList.add('o')
    } else if (_externalGameboardParent.classList.contains('o')) {
      _externalGameboardParent.classList.remove('o');
      _externalGameboardParent.classList.add('x');
    }
  }

  const updateExternalGameboard = (targetPosition, token) => {
    _externalGameboard[targetPosition].classList.add(token);
  }

  const enableExternalGameboard = () => {
    _externalGameboard.forEach(element => element.style.pointerEvents = 'auto');
  }

  const disableExternalGameboard = () => {
    _externalGameboard.forEach(element => element.style.pointerEvents = 'none');
  };

  const resetGameboard = () => {
    _internalGameboard.forEach((element, idx, arr) => arr[idx] = '');

    _externalGameboard.forEach(element => {
      if (element.classList.contains('x')) {
        element.classList.remove('x');
      } else if (element.classList.contains('o')) {
        element.classList.remove('o')
      }
    });
  }

  return {
    internalGameboard,
    externalGameboard,
    setDefaultExternalGameboardClass,
    toggleExternalGameboardClass,
    updateExternalGameboard,
    enableExternalGameboard,
    disableExternalGameboard,
    resetGameboard
  }
})();

const gameRules = (function () {
  const _WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const winningMove = (gameboard, token) => {
    return _WINNING_COMBINATIONS.some(combination => {
      return combination.every(position => {
        return gameboard[position] == token;
      })
    })
  }

  const positionFree = (gameboard, position) => !gameboard[position];

  return {
    winningMove,
    positionFree
  }
})();

const gameResultObj = (function () {
  const _gameResultContainer = document.getElementById('game-result-container');
  const _gameResultText = document.getElementById('game-result-text');
  const restartBtn = document.getElementById('restart-btn');

  const showGameWinner = function (winner) {
    _gameResultText.innerText = `${winner.toUpperCase()} WINS!`;
    _gameResultContainer.classList.remove('hide');
    _gameResultContainer.classList.add('show');
  }

  const showDraw = () => {
    _gameResultText.innerText = 'IT\'S A DRAW!';
    _gameResultContainer.classList.remove('hide');
    _gameResultContainer.classList.add('show');
  }

  const hideGameResult = function () {
    _gameResultContainer.classList.remove('show');
    _gameResultContainer.classList.add('hide');

  }

  return {
    showGameWinner,
    hideGameResult,
    showDraw,
    restartBtn
  }
})();

const externalScoreboard = (function () {
  const _playerOneScoreText = document.getElementById('player-one-score');
  const _playerTwoScoreText = document.getElementById('player-two-score');

  const updateExternalScoreboard = (player, score) => {
    if (player == 'Player 1') {
      _playerOneScoreText.innerText = score;
    } else {
      _playerTwoScoreText.innerText = score;
    }
  }

  return {
    updateExternalScoreboard
  }
})();

const gameController = (function () {
  const playerOne = playerFactory('Player 1', 'x');
  const playerTwo = playerFactory('Player 2', 'o');

  let playerOneTurn = true;
  let turnsTaken = 0;

  const { updateExternalScoreboard } = externalScoreboard;

  const internalGameboard = gameboard.internalGameboard();
  const externalGameboard = gameboard.externalGameboard();

  const {
    setDefaultExternalGameboardClass,
    toggleExternalGameboardClass,
    updateExternalGameboard,
    enableExternalGameboard,
    disableExternalGameboard, 
    resetGameboard 
  } = gameboard;

  const { 
    showGameWinner, 
    showDraw,
    hideGameResult, 
    restartBtn 
  } = gameResultObj;
  
  const {
    winningMove,
    positionFree
  } = gameRules;

  const resetGame = () => {
    playerOneTurn = true,
    turnsTaken = 0;
    hideGameResult();
    resetGameboard();
    restartBtn.removeEventListener('click', resetGame);
    setDefaultExternalGameboardClass();
    enableExternalGameboard()
  }

  setDefaultExternalGameboardClass();

  const initiateTurn = (event) => {
    const targetPosition = event.target.getAttribute('data-square');
    let currentPlayer = playerOneTurn ? playerOne : playerTwo;

    if (positionFree(internalGameboard, targetPosition)) {
      currentPlayer.takeTurn(internalGameboard, targetPosition);
      updateExternalGameboard(targetPosition, currentPlayer.getToken());
      toggleExternalGameboardClass()
      playerOneTurn = !playerOneTurn;
      turnsTaken++
    }

    if (turnsTaken >= 5 && winningMove(internalGameboard, currentPlayer.getToken())) {
      showGameWinner(currentPlayer.getName());
      currentPlayer.increaseScore();
      updateExternalScoreboard(currentPlayer.getName(), currentPlayer.getScore())
      disableExternalGameboard(initiateTurn);
      restartBtn.addEventListener('click', resetGame);
    }

    if (turnsTaken >= 9 && !winningMove(internalGameboard, currentPlayer.getToken())) {
      showDraw();
      restartBtn.addEventListener('click', resetGame);
    }
  }

  externalGameboard.forEach(element => element.addEventListener('click', initiateTurn));
})();