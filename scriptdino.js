// Global Variables
const player = document.getElementById("player");
const block = document.getElementById("block");
let counter = 0;
let frameCount = 0;
let gameStarted = false;
const collisionEvent = new Event("collision");
const scoreUpEvent = new Event("scoreUp");

// Sound effects
const jumpSound = new Audio("sounds/jump.mp3");
const hitSound = new Audio("sounds/hit.mp3");
const pointSound = new Audio("sounds/point.mp3");
jumpSound.preload = "auto";
hitSound.preload = "auto";
pointSound.preload = "auto";

function userInput() {
  if (!gameStarted) {
    gameStarted = true;
    block.style.animation = "block 1s infinite linear";
    gameLoop();
    jump();
  } else {
    jump();
  }
}

function gameLoop() {
  const playerRect = player.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();

  if (
    playerRect.right >= blockRect.left &&
    playerRect.left <= blockRect.right &&
    playerRect.bottom >= blockRect.top &&
    playerRect.top <= blockRect.bottom
  ) {
    player.dispatchEvent(collisionEvent);
  } else {
    frameCount++;
    if (frameCount % 10 === 0) player.dispatchEvent(scoreUpEvent);
  }

  if (gameStarted) requestAnimationFrame(gameLoop);
}

function jump() {
  if (player.classList.contains("animate")) return;
  player.classList.add("animate");
  jumpSound.currentTime = 0;
  jumpSound.play();
  setTimeout(() => player.classList.remove("animate"), 300);
}

function handleKeyDown(event) {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    userInput();
  }
}

player.addEventListener("collision", () => {
  gameStarted = false;
  block.style.animation = "none";
  hitSound.currentTime = 0;
  hitSound.play();

  counter = 0;
  updateScore();

  const gameContainer = document.querySelector(".game");
  gameContainer.style.backgroundColor = "red";
  setTimeout(() => (gameContainer.style.backgroundColor = ""), 200);
});

player.addEventListener("scoreUp", () => {
  counter++;
  if (counter % 100 === 0) {
    pointSound.currentTime = 0;
    pointSound.play();
  }
  updateScore();
});

function updateScore() {
  document.getElementById("scoreSpan").textContent = Math.floor(counter / 100);
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("mousedown", userInput);
