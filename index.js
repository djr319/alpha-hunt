const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
window.addEventListener('resize', resize);

const outerBuffer = 30;
const innerBuffer = 30;
let houseWidth;
let houseHeight;
const doorWidth = 100;
const doorHeight = 100;
let xUnit;
let yUnit;
const walls = [];
resize();
defineWalls();

const gameOn = 1;
const speed = 2;
const alphabet = ['a','ä','b','c','d','e','f','g','h','i','j','k','l','m','n','o','ö','p','q','r','s','t','u','ü','v','w','x','y','z'];
let currentLetter = {
  letter: 0,
  x:0,
  y:0
};

const colors = [
  'yellow',
  'purple',
  'blue',
  'green',
  'red',
];

let player = {
  x: 0,
  y: 0,
  direction: { dX: 0, dY: 0 },
  facing: "right",
  color: 0,
  ghost: false
};

({ x: player.x, y: player.y } = randomPosition());

let lastRender = 0;
let start, previousTimeStamp;

initGame();

function initGame() {
  setControlListeners();
  // speak('Hello crew mate');
  placeLetter();
  gameLoop();
};

function gameLoop() {
  clearCanvas();
  drawWalls();
  drawLetter();
  movePlayer();
  drawPlayer();
  // requestAnimationFrame(gameLoop);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  houseWidth = canvas.width - (2 * outerBuffer);
  houseHeight = canvas.height - (2 * outerBuffer);
  xUnit = houseWidth / 8;
  yUnit = houseHeight / 6;
}

function controls(e) {
  switch (e.key) {

    case 'W':
    case 'ArrowUp':
    case 'w':
      player.direction.dY = -speed;
      break;

    case 'A':
    case 'ArrowLeft':
    case 'a':
      player.direction.dX = -speed;
      player.facing = "left";
      break;

    case 'S':
    case 'ArrowDown':
    case 's':
      player.direction.dY = speed;
      break;

    case 'D':
    case 'ArrowRight':
    case 'd':
      player.direction.dX = speed;
      player.facing = "right";
      break;

    case 'Escape':
      if (!e.repeat) exitGame();
      break;

    case 'c':
    case 'C':
      changeColor();
      break;

    case ' ':
      ghostMode();
    default: break;
  }
}

function keyupControls(e) {

  switch (e.key) {
    case 'w':
    case 'W':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'S':
    case 's': player.direction.dY = 0;
    break;

    case 'A':
    case 'a':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'D':
    case 'd': player.direction.dX = 0;
    break;

    default:
      break;
    }
}

function setControlListeners() {
  document.addEventListener('keydown', controls);
  document.addEventListener('keyup', keyupControls);
}

function speak(message) {
  let msg = new SpeechSynthesisUtterance();
  msg.text = message;
  window.speechSynthesis.speak(msg);
};

function changeColor() {
  player.color = player.color + 1
  if (player.color > colors.length) player.color = 0;
}

function ghostMode() {
  speak('Imposter alert!');
  player.ghost = true;
  setTimeout(() => {
    if (!isNotWall({x:player.x,y:player.y})){die()}
    player.ghost = false;

  }, 2000);
};

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWalls() {
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';

  walls.forEach(wall => {
    console.log(wall.start.x);

    ctx.moveTo(wall.start.x, wall.start.y);
    ctx.lineTo(wall.end.x, wall.end.y);
    ctx.stroke();
  });
}

function defineWalls() {

  walls.push(
    {
      name: 'house_top',
      start: { x: outerBuffer, y: outerBuffer },
      end: { x: outerBuffer + houseWidth, y: outerBuffer }
    },
    {
      name: 'house_left',
      start: { x: outerBuffer, y: outerBuffer },
      end: { x: outerBuffer, y: outerBuffer + houseHeight }
    },
    {
      name: 'house_right',
      start: { x: outerBuffer + houseWidth, y: outerBuffer },
      end: { x: outerBuffer + houseWidth, y: outerBuffer + houseHeight }
    },
    {
      name: 'house_bottom',
      start: { x: outerBuffer, y: outerBuffer + houseHeight },
      end: { x: outerBuffer + houseWidth, y: outerBuffer + houseHeight }
    },
    {
      name: 'room_nw',
      start: { x: outerBuffer + 3 * xUnit, y: outerBuffer },
      end: { x: outerBuffer + 3 * xUnit, y: outerBuffer + 2 * yUnit }
    },
    {
      name: 'room ne',
      start: { x: outerBuffer + 5 * xUnit, y: outerBuffer },
      end: { x: outerBuffer + 5 * xUnit, y: outerBuffer + 2 * yUnit }
    },
    {
      name: 'room e',
      start: { x: outerBuffer + 5.5 * xUnit, y: outerBuffer + 2 * yUnit },
      end: { x: outerBuffer + 5.5 * xUnit, y: outerBuffer + 4 * yUnit }
    },

    {
      name: 'room se',
      start: { x: outerBuffer + 5 * xUnit, y: outerBuffer + 4 * yUnit },
      end: { x: outerBuffer + 5 * xUnit, y: outerBuffer + 6 * yUnit }
    },

    {
      name: 'room sw',
      start: { x: outerBuffer + 3 * xUnit, y: outerBuffer + 4 * yUnit },
      end: { x: outerBuffer + 3 * xUnit, y: outerBuffer + 6 * yUnit }
    },

    {
      name: 'room w',
      start: { x: outerBuffer, y: outerBuffer + 3 * yUnit },
      end: { x: outerBuffer + 2.5 * xUnit, y: outerBuffer + 3 * yUnit }
    },

    {
      name: 'hall top left',
      start: { x: outerBuffer + 2.5 * xUnit, y: outerBuffer + 2 * yUnit },
      end: { x: outerBuffer + 4 * xUnit - 1 / 2 * doorWidth, y: outerBuffer + 2 * yUnit }
    },

    {
      name: 'hall top right',
      start: { x: outerBuffer + 4 * xUnit + 1 / 2 * doorWidth, y: outerBuffer + 2 * yUnit },
      end: { x: outerBuffer + 5 * xUnit, y: outerBuffer + 2 * yUnit }
    },

    {
      name: 'hall right',
      start: { x: outerBuffer + 5.5 * xUnit, y: outerBuffer + 2 * yUnit },
      end: { x: outerBuffer + 5.5 * xUnit, y: outerBuffer + 4 * yUnit }
    },

    {
      name: 'hall bottom right',
      start: { x: outerBuffer + 4 * xUnit + 1 / 2 * doorWidth, y: outerBuffer + 4 * yUnit },
      end: { x: outerBuffer + 5 * xUnit, y: outerBuffer + 4 * yUnit }
    },

    {
      name: 'hall bottom left',
      start: { x: outerBuffer + 2.5 * xUnit, y: outerBuffer + 4 * yUnit },
      end: { x: outerBuffer + 4 * xUnit - 1 / 2 * doorWidth, y: outerBuffer + 4 * yUnit }
    },

    {
      name: 'hall left',
      start: { x: outerBuffer + 2.5 * xUnit, y: outerBuffer + 2 * yUnit + doorHeight },
      end: { x: outerBuffer + 2.5 * xUnit, y: outerBuffer + 4 * yUnit - doorHeight }
    }
  );
}

function catchLetter () {
  // todo: add to score
  currentLetter.letter ++;
  if (currentLetter > alphabet.length) endGame();
  if (gameOn === 1) placeLetter();
}

function placeLetter () {
  ({x:currentLetter.x, y:currentLetter.y} = randomPosition());
}

function randomPosition () {
  let x = outerBuffer + innerBuffer + Math.random() * (houseWidth - 2 * innerBuffer);
  let y = outerBuffer + innerBuffer + Math.random() * (houseHeight - 2 * innerBuffer);
  // check for wall
  if (isNotWall({ x, y })) {
    return { x, y };
  } else {
    return randomPosition();
  }
}

function drawLetter() {
  ctx.font = '14px sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText( alphabet[currentLetter.letter].toUpperCase() + alphabet[currentLetter.letter], currentLetter.x, currentLetter.y);
}

function movePlayer() {

  if (player.ghost == true || isNotWall({
      x: player.x + player.direction.dX,
      y: player.y
    })) {
      player.x = player.x + player.direction.dX;
    }

    if (player.ghost == true || isNotWall({
      x: player.x,
      y: player.y + player.direction.dY
    })) {
      player.y = player.y + player.direction.dY;
    }

  // boundry check
  if (player.x > houseWidth + outerBuffer - innerBuffer) player.x = houseWidth + outerBuffer - innerBuffer;
  if (player.y > houseHeight + outerBuffer - innerBuffer) player.y = houseHeight + outerBuffer - innerBuffer;
  if (player.x < outerBuffer + innerBuffer) player.x = outerBuffer + innerBuffer;
  if (player.y < outerBuffer + innerBuffer) player.y = outerBuffer + innerBuffer;

}

function isNotWall (point) {
  let x = point.x,
    y = point.y;

  for (let i = 0; i < walls.length; i++) {

     let x1 = walls[i].start.x,
      x2 = walls[i].end.x,
      y1 = walls[i].start.y,
      y2 = walls[i].end.y;

    if (
      x1 == x2 && y1 != y2 &&
      x > x1 - innerBuffer && x < x1 + innerBuffer &&
      y > Math.min(y1, y2) - innerBuffer && y < Math.max(y1, y2) + innerBuffer) {
      // wallOrientation = 'vertical' ;
      return false;
    }

    if (
      x1 != x2 && y1 == y2 &&
      y > y1 - innerBuffer && y < y1 + innerBuffer &&
      x > Math.min(x1, x2) - innerBuffer && x < Math.max(x1, x2) + innerBuffer) {
      // wallOrientation = 'horizontal';
      return false;
    }
  }
  return true;
}

function drawPlayer() {
  if (player.ghost == true) ctx.globalAlpha = 0.4;
  let crewColor = colors[player.color];
  let crewOutline = crewColor;

  // body
  ctx.lineWidth = 5;
  ctx.strokeStyle = crewOutline;
  ctx.fillStyle = crewColor;
  ctx.beginPath();
  ctx.roundRect(player.x - 10, player.y - 20, 20, 40, 10); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  // legs
  ctx.lineWidth = 5;
  ctx.strokeStyle = crewOutline;
  ctx.fillStyle = crewColor;
  ctx.beginPath();
  ctx.roundRect(player.x - 10, player.y + 10, 7, 15, 2.5); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  ctx.strokeStyle = crewOutline;
  ctx.fillStyle = crewColor;
  ctx.beginPath();
  ctx.roundRect(player.x + 3, player.y + 10, 7, 15, 2.5); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  // backpack
  ctx.strokeStyle = crewOutline;
  ctx.fillStyle = crewColor;
  ctx.beginPath();
  if (player.facing == "left") {
    ctx.roundRect(player.x + 15, player.y - 5, 5, 20, 10); // no support in firefox !!
  } else {
    ctx.roundRect(player.x - 20, player.y - 5, 5, 20, 10); // no support in firefox !!
  }
  ctx.stroke();
  ctx.fill();

  // eye
  ctx.strokeStyle = 'black';
  ctx.fillStyle = '#78f0f0';
  ctx.beginPath();
  if (player.facing == "left") {
    ctx.roundRect(player.x - 16, player.y - 10, 15, 10, 5); // no support in firefox !!
  } else {
    ctx.roundRect(player.x - 1, player.y - 10, 15, 10, 5); // no support in firefox !!
  }
  ctx.stroke();
  ctx.fill();

  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.beginPath();
  if (player.facing == "left") {
    ctx.roundRect(player.x - 15, player.y - 8, 8, 3, 1); // no support in firefox !!
  } else {
    ctx.roundRect(player.x + 5, player.y - 8, 8, 3, 1); // no support in firefox !!
  }
  ctx.stroke();
  ctx.fill();
  ctx.globalAlpha = 1;
}

function endGame () {
  gameOn = 0;
  alert("Congratulations! You won!")
}

function die() {
  speak('You died!');
  alert('You died');
  ({x:player.x, y:player.y} = randomPosition());
}
