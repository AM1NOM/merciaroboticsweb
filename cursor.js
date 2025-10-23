(function(){
  const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [data-interactive], .interactive';
  const LERP = 0.18;

  // Disable on touch devices
  const isTouchDevice = (('ontouchstart' in window) || 
    (navigator.maxTouchPoints > 0) || 
    (window.matchMedia('(pointer: coarse)').matches));
    
  if (isTouchDevice) {
    const existing = document.getElementById('cursor-ring');
    if (existing) existing.style.display = 'none';
    return;
  }

  // create ring element
  let ringEl = document.getElementById('cursor-ring');
  if (!ringEl) {
    ringEl = document.createElement('div');
    ringEl.id = 'cursor-ring';
    ringEl.innerHTML = '<div class="ring"></div>';
    document.documentElement.appendChild(ringEl);
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
    }
  }, { capture: true });

  document.addEventListener('mouseout', e => {
    const related = e.relatedTarget?.closest(interactiveSelector);
    if (!related) {
      ringEl.classList.remove('active');
    }
  }, { capture: true });
})();