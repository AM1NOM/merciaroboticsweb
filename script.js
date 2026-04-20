// Mobile menu functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileMenuToggle && mobileNav) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  // Close mobile menu when clicking on links
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileMenuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
    }
  });
}

// Enhanced smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');

    // Skip if href is just "#"
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Enhanced header functionality
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const scrolled = window.pageYOffset;

  if (header) {
    if (scrolled > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Active menu item highlighting
function updateActiveMenuItem() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  let currentSection = '';
  const scrollPos = window.pageYOffset + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveMenuItem);
window.addEventListener('load', updateActiveMenuItem);

// Parallax effect for geometric shapes
window.addEventListener('scroll', () => {
  const shapes = document.querySelectorAll('.shape');
  const scrolled = window.pageYOffset;

  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.3;
    shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
  });
});

// Neural lines pulse effect
const neuralLines = document.querySelectorAll('.neural-line');
if (neuralLines.length) {
  setInterval(() => {
    neuralLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'scaleX(1.2)';
        setTimeout(() => {
          line.style.opacity = '0.2';
          line.style.transform = 'scaleX(0.5)';
        }, 200);
      }, index * 300);
    });
  }, 2000);
}

// Enhanced particle generation
function createQuantumParticle() {
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.width = Math.random() * 4 + 1 + 'px';
  particle.style.height = particle.style.width;
  particle.style.background = ['#00ffff', '#ff0080', '#8000ff'][Math.floor(Math.random() * 3)];
  particle.style.borderRadius = '50%';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = '100vh';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '-1';
  particle.style.boxShadow = `0 0 10px ${particle.style.background}`;

  document.body.appendChild(particle);

  const duration = Math.random() * 3000 + 2000;
  const drift = (Math.random() - 0.5) * 200;

  particle.animate([
    { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
    { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 1 }
  ], {
    duration: duration,
    easing: 'ease-out'
  }).onfinish = () => particle.remove();
}

// Generate quantum particles
setInterval(createQuantumParticle, 300);

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe timeline items and hexagons
document.querySelectorAll('.timeline-content, .hexagon').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(50px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(el);
});

// Set year in footer when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// Form submission effect — after animation navigate to donate link (if present)
// (function() {
//   const submitBtn = document.querySelector('.submit-btn');
//   if (!submitBtn) return;

//   submitBtn.addEventListener('click', function(e) {
//     e.preventDefault();
//     const btn = this;
//     btn.innerHTML = 'TRANSMITTING...';
//     btn.style.background = 'linear-gradient(45deg, #8000ff, #00ffff)';

//     setTimeout(() => {
//       btn.innerHTML = 'TRANSMISSION COMPLETE';
//       btn.style.background = 'linear-gradient(45deg, #00ff00, #00ffff)';

//       setTimeout(() => {
//         btn.innerHTML = 'TRANSMIT TO MATRIX';
//         btn.style.background = 'linear-gradient(45deg, #00ffff, #ff0080)';

//         // find link to navigate to:
//         // prefer nearest ancestor <a>, fall back to href on the button or data-href
//         const anchor = btn.closest('a');
//         let href = null;
//         let target = null;
//         if (anchor && anchor.getAttribute('href')) {
//           href = anchor.getAttribute('href');
//           target = anchor.getAttribute('target');
//         } else {
//           href = btn.getAttribute('href') || btn.dataset.href || null;
//         }

//         if (href) {
//           // small delay to allow the final state to be visible
//           setTimeout(() => {
//             if (target === '_blank') {
//               window.open(href, '_blank', 'noopener');
//             } else {
//               window.location.href = href;
//             }
//           }, 80);
//         }
//       }, 2000);
//     }, 1500);
//   });
// })();

// Seamless Infinite Sponsor Scroller
(function () {
  const SPEED_PX_PER_SEC = 110;

  function initSponsorsMarquee() {
    const viewport = document.getElementById("sponsorViewport");
    const track = document.getElementById("sponsorTrack");
    if (!viewport || !track) return;

    // Wait for images to load
    const imgs = Array.from(track.querySelectorAll("img"));
    const imgPromises = imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    });

    Promise.all(imgPromises).then(() => {
      // ensure layout is stable before measuring
      requestAnimationFrame(() => {
        let totalWidth = track.scrollWidth;
        const viewportWidth = viewport.clientWidth || window.innerWidth;

        const originalChildren = Array.from(track.children);

        let guard = 0;
        while (totalWidth < viewportWidth * 2 && guard < 20) {
          originalChildren.forEach((n) =>
            track.appendChild(n.cloneNode(true))
          );
          totalWidth = track.scrollWidth;
          guard++;
        }

        const scrollDistance = Math.floor(totalWidth / 2) || 0;
        const durationSec = Math.max(5, scrollDistance / SPEED_PX_PER_SEC);

        track.style.setProperty("--scroll-width", scrollDistance + "px");
        track.style.setProperty("--duration", durationSec + "s");

        // Fallback: ensure animation property is present (in case CSS vars not applied)
        track.style.animation = `sponsorScroll ${durationSec}s linear infinite`;
        track.style.transform = 'translateX(0)';

        // Pause/resume functions
        function pause() { track.style.animationPlayState = 'paused'; }
        function resume(){ track.style.animationPlayState = 'running'; }

        // Use pointerenter/pointerleave on both viewport and track
        [viewport, track].forEach(el => {
          el.addEventListener('pointerenter', pause, {passive:true});
          el.addEventListener('pointerleave', resume, {passive:true});
          // also add touchstart/touchend for mobile/touch
          el.addEventListener('touchstart', pause, {passive:true});
          el.addEventListener('touchend', resume, {passive:true});
        });

        // Responsive: rebuild on resize
        let rTO;
        window.addEventListener("resize", () => {
          clearTimeout(rTO);
          rTO = setTimeout(() => {
            // reset track to original children then re-init
            const originals = originalChildren.map((n) => n.cloneNode(true));
            track.innerHTML = "";
            originals.forEach((n) => track.appendChild(n));
            initSponsorsMarquee();
          }, 250);
        }, { passive: true });
      });
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initSponsorsMarquee, 30);
  } else {
    window.addEventListener("load", initSponsorsMarquee);
  }
})();


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
let highScore = 0;

function updateScore() {
  const current = Math.floor(counter / 100);
  if (current > highScore) highScore = current;
  document.getElementById("scoreSpan").textContent = String(current).padStart(5, "0");
  document.getElementById("highScoreSpan").textContent = String(highScore).padStart(5, "0");
}
