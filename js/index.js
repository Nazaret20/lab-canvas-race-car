const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Car
const carWidth = 50;
const carHeight = 100;
const bottomMargin = 20;
let carX = (canvas.width - carWidth) / 2;
let carY = canvas.height - carHeight - bottomMargin;

// Images
const roadImg = new Image();
roadImg.src = "images/road.png";

const carImg = new Image();
carImg.src = "images/car.png";

// Obstacles
let obstacles = [];
let score = 0;
let gameOver = false;

// Control de loops
let animationId;
let obstacleInterval;

class Obstacle {
  constructor(x, width, speed = 3) {
    this.x = x;
    this.y = 0;
    this.width = width;
    this.height = 20;
    this.speed = speed;
  }

  move() {
    this.y += this.speed;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Colisiones
function checkCollision(obs) {
  return (
    carX < obs.x + obs.width &&
    carX + carWidth > obs.x &&
    carY < obs.y + obs.height &&
    carY + carHeight > obs.y
  );
}

// Dibujar todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fondo + coche
  ctx.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(carImg, carX, carY, carWidth, carHeight);

  // obstáculos
  obstacles.forEach((obs) => {
    obs.move();
    obs.draw();
    if (checkCollision(obs)) gameOver = true;
  });

  // mostrar score solo si no hay game over
  if (!gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 20, 30);
  }
}

// Game loop
function gameLoop() {
  if (gameOver) {
    // detener animación y obstáculos
    cancelAnimationFrame(animationId);
    clearInterval(obstacleInterval);

    // pantalla final
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 40);

    return;
  }

  score++;
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

// Obstáculos cada 2s
function startObstacles() {
  obstacleInterval = setInterval(() => {
    const minWidth = 50;
    const maxWidth = 200;
    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
    const x = Math.floor(Math.random() * (canvas.width - width));
    obstacles.push(new Obstacle(x, width));
  }, 2000);
}

// Movimiento coche
document.addEventListener("keydown", (event) => {
  const step = 10;
  if (event.key === "ArrowLeft") {
    carX -= step;
    if (carX < 0) carX = 0;
  }
  if (event.key === "ArrowRight") {
    carX += step;
    if (carX > canvas.width - carWidth) {
      carX = canvas.width - carWidth;
    }
  }
});

// Start game
function startGame() {
  // limpiar estado anterior
  cancelAnimationFrame(animationId);
  clearInterval(obstacleInterval);

  obstacles = [];
  score = 0;
  gameOver = false;

  gameLoop();
  startObstacles();
}

window.addEventListener("load", () => {
  let startBtn = document.querySelector("#start-button");
  startBtn.addEventListener("click", () => {
    startGame();
  });
});
