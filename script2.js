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

