const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const winPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWin = function () {
    for (let p of winPositions) {
      let countX = 0;
      let countO = 0;

      for (let pos of p) {
        if (board[pos] === 'x') {
          countX++;
        } else if (board[pos] === 'o') {
          countO++;
        } else {
          continue;
        }
      }
      if (countX === 3) {
        return 'x';
      } else if (countO === 3) {
        return 'o';
      }
    }
    return null;
  }

  const resetBoard = function () {
    board = ['', '', '', '', '', '', '', '', ''];
    return true;
  };


  const makeMove = function (movePosition, player) {
    if (movePosition < 0 || movePosition >= board.length) {
      return false;
    }
    if (board[movePosition] === '') {
      board[movePosition] = player;
      return true;
    } else {
      return false;
    }
  }

  function getBoard() {
    return board;
  }

  return { getBoard, makeMove, resetBoard, checkWin }
})()

const GameController = (() => {
  const board = Gameboard;
  const players = ['x', 'o'];

  let activePlayer = players[0];

  function getActivePlayer() {
    return activePlayer;
  }

  function play(move) {
    const success = board.makeMove(move, activePlayer);
    if (!success) {
      msg = `invalid move`;
      return { success, msg }
    }

    let msg = '';
    const player = getActivePlayer();
    const winner = board.checkWin();

    if (!winner && board.getBoard().every(cell => cell != '')) {
      msg = 'that\'s a draw';
      return {
        success, winner, isDraw: true, player, msg
      };
    }

    if (success && winner) {
      msg = `${winner} won!`
      return { success, winner, player, msg }
    } else if (success) {
      switchPlayer();
      msg = `${activePlayer} to play`
      return { success, winner, player, msg }
    } else {
      msg = `invalid move`;
      return { success, msg }
    }
  }

  // function printNewRound() {
  //   board.printBoard();
  // }

  function switchPlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  // printNewRound();

  return {
    play,
    board,
    getActivePlayer
  };
})();

const DomHandler = (() => {
  const app = document.querySelector('#app');
  const header = document.createElement('h1');
  // header.innerText = 'Tic Tac Toe';

  const resetButton = document.createElement('button')
  resetButton.innerText = 'Reset Button';
  resetButton.addEventListener('click', () => {
    resetBoardUI();
  })

  const msg = document.createElement('p');

  const board = document.createElement('div');
  board.setAttribute('class', 'game');

  app.appendChild(header);
  app.appendChild(board);
  app.appendChild(msg);
  app.appendChild(resetButton);

  for (let b = 0; b < GameController.board.getBoard().length; b++) {
    const btn = document.createElement('button');
    btn.onclick = () => {
      let next = GameController.play(b);

      // check draw
      if (next.isDraw) {
        msg.innerText = next.msg;
      }

      // check winner
      if (next.winner) {
        msg.innerText = next.msg;
        btn.innerText = next.player;
        const buttons = document.querySelectorAll('.game button');
        buttons.forEach(btn => { btn.setAttribute("disabled", "true") })
      }

      // regular valid move
      if (next.success) {
        btn.innerText = next.player;
      }

      msg.innerText = next.msg;
    }
    board.appendChild(btn)
  }

  function resetBoardUI() {
    GameController.board.resetBoard();
    const buttons = board.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.innerText = '';
      btn.removeAttribute("disabled");
    });
    msg.innerText = ''
  }
})();
