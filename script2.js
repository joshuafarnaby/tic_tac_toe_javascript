const playerFactory = (name, token) => {
  const getName = () => name;
  const getToken = () => token;
  const takeTurn = (gameboard, position) => {
    gameboard[position] = token
  }

  return {
    getName,
    getToken,
    takeTurn
  }
}

const gameboard = (function () {
  const _internalGameboard = ['', '', '', '', '', '', '', '', ''];
  const _externalGameboard = document.querySelectorAll('[data-square]');

  const internalGameboard = () => _internalGameboard;
  const externalGameboard = () => Array.from(_externalGameboard);

  const updateExternalGameboard = (targetPosition, token) => {
    _externalGameboard[targetPosition].classList.add(token);
  }

  return {
    internalGameboard,
    externalGameboard,
    updateExternalGameboard
  }
})();

const gameRules = (function () {
  const WINNING_COMBINATIONS = [
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
    return WINNING_COMBINATIONS.some(combination => {
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
})()

const gameController = (function () {
  const playerOne = playerFactory('Player 1', 'x');
  const playerTwo = playerFactory('Player 2', 'o');

  const playerOneTurn = true;
  const currentPlayer = playerOneTurn ? playerOne : playerTwo;
  const turnsTaken = 0;

  const internalGameboard = gameboard.internalGameboard();
  const externalGameboard = gameboard.externalGameboard();

  const { updateExternalGameboard } = gameboard
  
  const {
    winningMove,
    positionFree
  } = gameRules;

  const initiateTurn = (event) => {
    const targetPosition = event.target.getAttribute('data-square');

    if (positionFree(internalGameboard, targetPosition)) {
      currentPlayer.takeTurn(internalGameboard, targetPosition);
      updateExternalGameboard(targetPosition, currentPlayer.getToken());
    }
  }

  externalGameboard.forEach(element => {
    element.addEventListener('click', initiateTurn)
  })
})();