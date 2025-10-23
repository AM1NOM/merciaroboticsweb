function dropRobot() {
  const robot = document.createElement("div");
  robot.classList.add("robot");
  robot.textContent = "🤖";

  // Random horizontal position
  robot.style.left = Math.random() * 90 + "vw";

  document.body.appendChild(robot);

  // Remove after it passes through the bottom
  setTimeout(() => {
    robot.remove();
  }, 5000); // matches fall animation duration
}

// Start 30s after load, then repeat every 15s
setTimeout(() => {
  dropRobot(); // first drop
  setInterval(dropRobot, 15000);
}, 30000);
