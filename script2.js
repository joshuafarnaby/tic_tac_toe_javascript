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

  return {
    internalGameboard,
    externalGameboard
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