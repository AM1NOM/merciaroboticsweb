(function(){
  const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [data-interactive], .interactive';
  const LERP = 0.35;

  // create ring element immediately
  let ringEl = document.createElement('div');
  ringEl.id = 'cursor-ring';
  ringEl.innerHTML = '<div class="ring"></div>';
  document.body.appendChild(ringEl); // changed from documentElement to body

  // Disable on touch devices
  const isTouchDevice = (('ontouchstart' in window) || 
    (navigator.maxTouchPoints > 0) || 
    (window.matchMedia('(pointer: coarse)').matches));
    
  if (isTouchDevice) {
    ringEl.style.display = 'none';
    return;
  }

  // internal state
  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let pos = { x: mouse.x, y: mouse.y };
  
  // smooth follow loop
  function rafLoop(){
    pos.x += (mouse.x - pos.x) * LERP;
    pos.y += (mouse.y - pos.y) * LERP;
    ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  // cursor movement
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    ringEl.classList.remove('hidden');
    // Add debug log
    console.log('Mouse position:', mouse.x, mouse.y);
  }, { passive: true });

  // window events
  window.addEventListener('blur', () => ringEl.classList.add('hidden'));
  document.addEventListener('mouseleave', () => ringEl.classList.add('hidden'));
  document.addEventListener('mouseenter', () => ringEl.classList.remove('hidden'));

  // interactive element handling
  document.addEventListener('mouseover', e => {
    const target = e.target.closest(interactiveSelector);
    if (target) {
      ringEl.classList.add('active');
      // Add debug log
      console.log('Hovering interactive element:', target);
    }
  }, { capture: true });

  document.addEventListener('mouseout', e => {
    const related = e.relatedTarget?.closest(interactiveSelector);
    if (!related) {
      ringEl.classList.remove('active');
    }
  }, { capture: true });

  // Debug info
  console.log('Cursor ring initialized');
  console.log('Ring element:', ringEl);
})();
