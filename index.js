const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
window.addEventListener("resize", resize);

const colors = [
  'yellow',
  'black',
  'purple',
  'blue',
  'green',
  'red',
];

function speak(message) {
  let msg = new SpeechSynthesisUtterance();
  msg.text = message;
  window.speechSynthesis.speak(msg);
};

speak('Hello crewmate... How are you Kieran?');

let player = {
  x: Math.floor(window.innerWidth / 2),
  y: Math.floor(window.innerHeight / 2),
  direction: { dX: 0, dY: 0 },
  facing: "right",
  color: 0
};

let lastRender = 0;
let start, previousTimeStamp;

resize();
setControlListeners();

function resize () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = Math.floor(window.innerWidth / 2);
  player.y = Math.floor(window.innerHeight / 2);
}


// a comment
function controls (e) {
  switch (e.key) {

    case 'W':
    case 'ArrowUp':
    case 'w':
      player.direction.dY = -1;
      break;

    case 'A':
    case 'ArrowLeft':
    case 'a':
      player.direction.dX = -1;
      player.facing = "left";
      break;

    case 'S':
    case 'ArrowDown':
    case 's':
      player.direction.dY = 1;
      break;

    case 'D':
    case 'ArrowRight':
    case 'd':
      player.direction.dX = 1;
      player.facing = "right";
      break;

    case 'Escape':
      if (!e.repeat) exitGame();
      break;

    case 'c':
    case 'C':
      changeColor();
    break;

    default: break;
  }
}

function keyupControls (e) {

  switch (e.key) {
    case 'W':
    case 'ArrowUp':
    case 'w':
    case 'S':
    case 'ArrowDown':
    case 's': player.direction.dY = 0;
      break;

    case 'A':
    case 'ArrowLeft':
    case 'D':
    case 'ArrowRight':
    case 'd': player.direction.dX = 0;
      break;

    default:
      break;
  }
}

function setControlListeners () {
  document.addEventListener('keydown', controls);
  document.addEventListener('keyup', keyupControls);
}

function changeColor() {
  console.log('color change: ', player.color);

  player.color = player.color + 1
  if (player.color > colors.length) player.color = 0;

}

gameLoop();

function gameLoop () {
  clearCanvas();
  movePlayer();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // sets transparent black
}

function movePlayer() {
  player.x = player.x + player.direction.dX;
  player.y = player.y + player.direction.dY;
};

function drawPlayer () {
  let crewColor = colors[player.color];
  let crewOutline = crewColor;
  if (player.color == 1) crewOutline = 'white';

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
    ctx.roundRect(player.x -15, player.y - 8, 8, 3, 1); // no support in firefox !!
  } else {
    ctx.roundRect(player.x + 5, player.y - 8, 8, 3, 1); // no support in firefox !!
  }
    ctx.stroke();
    ctx.fill();

}
