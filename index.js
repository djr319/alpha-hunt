const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', {alpha: false});
window.addEventListener("resize", resize);
resize();

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let player = {
  x: Math.floor(window.innerWidth / 2),
  y: Math.floor(window.innerHeight / 2),
  direction: 0,
  speed: 0
};

gameLoop();

function gameLoop() {
  drawPlayer();
}

function drawPlayer() {

  // body
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'red';
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.roundRect(player.x - 10, player.y -20, 20, 40, 10); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  // legs
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'red';
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.roundRect(player.x - 10, player.y +10, 7, 15, 2.5); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  ctx.strokeStyle = 'red';
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.roundRect(player.x +3, player.y +10, 7, 15, 2.5); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  // backpack
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.roundRect(player.x - 20, player.y -5, 5, 20, 10); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  // eye
  ctx.strokeStyle = 'black';
  ctx.fillStyle = '#78f0f0';
  ctx.beginPath();
  ctx.roundRect(player.x - 1, player.y -10, 15, 10, 5); // no support in firefox !!
  ctx.stroke();
  ctx.fill();

  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.roundRect(player.x +5, player.y -8, 8, 3, 1); // no support in firefox !!
  ctx.stroke();
  ctx.fill();
}
