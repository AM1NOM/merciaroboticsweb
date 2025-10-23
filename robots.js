// Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Ground
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -5;
scene.add(ground);

// Placeholder robot (cube) in case you don’t have a model yet
let robot = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshPhongMaterial({ color: 0xff0000 })
);
robot.position.y = 5;
scene.add(robot);

// Gravity variables
let velocity = 0;
const gravity = -0.01;

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Apply gravity
  velocity += gravity;
  robot.position.y += velocity;

  // Stop at ground
  if (robot.position.y <= -4) {
    robot.position.y = -4;
    velocity = 0;
  }

  // Spin
  robot.rotation.x += 0.02;
  robot.rotation.y += 0.03;

  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- OPTIONAL: Load a real robot model instead of the cube ---
// Uncomment this block if you have robot.glb in the same folder
/*
const loader = new THREE.GLTFLoader();
loader.load(
  "robot.glb",
  function (gltf) {
    scene.remove(robot); // remove cube
    robot = gltf.scene;
    robot.scale.set(1, 1, 1);
    robot.position.set(0, 5, 0);
    scene.add(robot);
  },
  undefined,
  function (error) {
    console.error("Error loading robot model:", error);
  }
);
*/
