import "./style.css";

const GAME_VELOCITY = 1;
const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

const SHAPES = [
  {
    x: null,
    y: null,
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    x: null,
    y: null,
    shape: [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
    ],
  },
  {
    x: null,
    y: null,
    shape: [
      [0, 3, 0],
      [3, 3, 3],
      [0, 0, 0],
    ],
  },
  {
    x: null,
    y: null,
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
  },
  {
    x: null,
    y: null,
    shape: [
      [0, 5, 5],
      [5, 5, 0],
    ],
  },
];

let board = [];
createBoard();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let shape = null;

function newShape() {
  shape = getShape();
  shape.x = Math.floor(BOARD_WIDTH / 2 - shape.shape[0].length / 2);
  shape.y = 0;
  shape.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        board[y + shape.y][x + shape.x] = val;
      }
    });
  });
}

function clearCompleteRows() {
  board.forEach((row, y) => {
    let isCompleteRow = true;
    row.forEach((val, x) => {
      if (val === 0) {
        isCompleteRow = false;
      }
    });
    if (isCompleteRow) {
      for (let y2 = y; y2 > 0; y2--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y2][x] = board[y2-1][x];
        }
      }
    }
  });
}

newShape();

let lastTime = 0;
update();

function update(time) {
  const deltaTime = time - lastTime;
  if (deltaTime >= 1000 * GAME_VELOCITY) {
    lastTime = time;
    if (canFall(shape)) {
      moveShape(shape);
    } else {
      clearCompleteRows();
      newShape();
    }
  }

  draw();
  window.requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown":
      // Do something for "down arrow" key press.
      if (canFall(shape)) {
        moveShape(shape)
      } else {
        clearCompleteRows()
        newShape()
      }
      break;
    case "ArrowUp":
      // Do something for "up arrow" key press.
      if (canRotate(shape)) {
        clearShape(shape)
        shape.shape = rotateMatrix(shape.shape);
        drawShape(shape)
      }
      break;
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      if (canMove(shape, -1)) {
        moveShapeH(shape, -1)
      }
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      if (canMove(shape, 1)) {
        moveShapeH(shape, 1)
      }
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case " ":
      // Do something for "space" key press.
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
});

function canRotate(shape) {
  let rShape = rotateMatrix(shape.shape)
  let canMove = true
  rShape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        if (board[y + shape.y]) {
          if (board[y + shape.y][x + shape.x] !== val) {
            if (board[y + shape.y][x + shape.x] !== 0) {
              canMove = false;
            }
          }
        } else {
          canMove = false;
        }
      }
    })
  })
  return canMove
}

function moveShapeH(shape, direction) {
  clearShape(shape);
  shape.x += direction;
  drawShape(shape);
}

function canMove(shape, direction) {
  let canMove = true;
  shape.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        if (board[y + shape.y]) {
          if (board[y + shape.y][x + shape.x + direction] !== val) {
            if (board[y + shape.y][x + shape.x + direction] !== 0) {
              canMove = false;
            }
          }
        } else {
          canMove = false;
        }
      }
    });
  });
  return canMove;
}

function canFall(shape) {
  let canFall = true;
  shape.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        if (board[y + shape.y + 1]) {
          if (board[y + shape.y + 1][x + shape.x] !== val) {
            if (board[y + shape.y + 1][x + shape.x] !== 0) {
              canFall = false;
            }
          }
        } else {
          canFall = false;
        }
      }
    });
  });

  if (!canFall) {
    shape.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          board[y + shape.y][x + shape.x] = val + 0.1;
        }
      });
    });
  }
  return canFall;
}

function clearShape(shape) {
  shape.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        board[y + shape.y][x + shape.x] = 0;
      }
    });
  });
}

function moveShape(shape) {
  clearShape(shape);
  shape.y++;
  drawShape(shape);
}

function drawShape(shape) {
  shape.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        board[y + shape.y][x + shape.x] = val;
      }
    });
  });
}

function draw() {
  board.forEach((row, y) => {
    let isCompleteRow = true;
    row.forEach((val, x) => {
      let color = null;
      const v = Math.floor(val);
      switch (v) {
        case 0:
          color = "rgb(60,60,60)";
          break;
        case 1:
          color = "rgb(200,0,0)";
          break;
        case 2:
          color = "rgb(0,200,0)";
          break;
        case 3:
          color = "rgb(0,0,200)";
          break;
        case 4:
          color = "rgb(0,200,200)";
          break;
        case 5:
          color = "rgb(200,0,200)";
          break;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });
}

function getShape() {
  const r = Math.floor(Math.random() * (5 - 0));
  return SHAPES[r];
}

function createBoard() {
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    board.push([]);
    for (let column = 0; column < BOARD_WIDTH; column++) {
      board[row].push(0);
    }
  }
}

function rotateMatrix(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  const newMatrix = [];

  for (let x = 0; x < n; x++) {
    newMatrix.push([]);
    for (let y = 0; y < m; y++) {
      newMatrix[x].push([]);
    }
  }

  matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      newMatrix[n - 1 - x][y] = val;
    });
  });

  return newMatrix;
}
