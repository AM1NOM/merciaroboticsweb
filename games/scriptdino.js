// ===============================
// Dino Game with Sound Effects 🦖
// ===============================

// Global Variables
const player = document.getElementById("player");
const block = document.getElementById("block");
let counter = 0;
let frameCount = 0;
let gameStarted = false;
const collisionEvent = new Event("collision");
const scoreUpEvent = new Event("scoreUp");

// ===============================
// 🎧 Sound Effects (MP3 in /sounds folder)
// ===============================
const jumpSound = new Audio("sounds/jump.mp3");
const hitSound = new Audio("sounds/hit.mp3");
const pointSound = new Audio("sounds/point.mp3");

// Optional: preload for instant playback
jumpSound.preload = "auto";
hitSound.preload = "auto";
pointSound.preload = "auto";

// ===============================
// 🕹️ Game Logic
// ===============================

// Start / Jump Logic
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

// Game Loop
function gameLoop() {
  const playerRect = player.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();

  // Collision detection
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

// Jump Action
function jump() {
  if (player.classList.contains("animate")) return;
  player.classList.add("animate");

  // 🔊 Play jump sound
  jumpSound.currentTime = 0;
  jumpSound.play();

  setTimeout(() => player.classList.remove("animate"), 300);
}

// ===============================
// 🎯 Event Listeners
// ===============================

// Spacebar or click to play/jump
function handleKeyDown(event) {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    userInput();
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("mousedown", userInput);

// Collision event (Game Over)
player.addEventListener("collision", () => {
  gameStarted = false;
  block.style.animation = "none";

  // 🔊 Play hit sound
  hitSound.currentTime = 0;
  hitSound.play();

  counter = 0;
  updateScore();

  const gameContainer = document.querySelector(".game");
  gameContainer.style.backgroundColor = "red";
  setTimeout(() => (gameContainer.style.backgroundColor = ""), 200);
});

// Score event
player.addEventListener("scoreUp", () => {
  counter++;
  if (counter % 100 === 0) {
    // 🔊 Play point sound every milestone
    pointSound.currentTime = 0;
    pointSound.play();
  }
  updateScore();
});

// ===============================
// 🧮 Score Update
// ===============================
function updateScore() {
  document.getElementById("scoreSpan").textContent = Math.floor(counter / 100);
}
