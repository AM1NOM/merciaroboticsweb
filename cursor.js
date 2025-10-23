// Cursor ring behaviour (self-contained)
(function(){
  const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [data-interactive], .interactive';
  const NON_INTERACTIVE_SIZE = 28; // size when not over interactive
  const ACTIVE_SIZE = 44;         // fixed size when over interactive
  const LERP = 0.18;

  // Disable on touch / coarse-pointer devices to avoid interference
  const isTouchDevice = (('ontouchstart' in window) ||
                        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
                        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches));
  if (isTouchDevice) {
    const existing = document.getElementById('cursor-ring');
    if (existing) existing.style.display = 'none';
    return;
  }

  // create DOM if not present
  let ringEl = document.getElementById('cursor-ring');
  if (!ringEl) {
    ringEl = document.createElement('div');
    ringEl.id = 'cursor-ring';
    ringEl.innerHTML = '<div class="ring"></div>';
    document.documentElement.appendChild(ringEl);
  } else if (!ringEl.querySelector('.ring')) {
    ringEl.innerHTML = '<div class="ring"></div>';
  }
  const ring = ringEl.querySelector('.ring');

  // make sure wrapper starts at non-interactive size and inner ring is 100%
  let targetSize = NON_INTERACTIVE_SIZE;
  ringEl.style.width = `${targetSize}px`;
  ringEl.style.height = `${targetSize}px`;
  ring.style.width = `100%`;
  ring.style.height = `100%`;
  ringEl.style.background = 'transparent';
  ringEl.style.border = 'none';
  ringEl.style.outline = 'none';

  // internal state
  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let pos = { x: mouse.x, y: mouse.y };
  let isActive = false;

  // smooth follow loop (wrapper sized to targetSize so translate(-50%,-50%) keeps it centered)
  function rafLoop(){
    pos.x += (mouse.x - pos.x) * LERP;
    pos.y += (mouse.y - pos.y) * LERP;
    ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    const size = Math.max(8, Math.round(targetSize));
    ringEl.style.width = `${size}px`;
    ringEl.style.height = `${size}px`;
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  // pointer movement
  document.addEventListener('pointermove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    ringEl.classList.remove('hidden');
  }, { passive: true });

  // hide when leaving window/tab
  window.addEventListener('blur', () => ringEl.classList.add('hidden'));
  document.addEventListener('pointerleave', () => ringEl.classList.add('hidden'));
  document.addEventListener('pointerenter', () => ringEl.classList.remove('hidden'));

  // set to fixed active size when hovering interactive element
  function setActiveFixed(){
    isActive = true;
    ringEl.classList.add('active');
    ringEl.classList.remove('input-focus');
    targetSize = ACTIVE_SIZE;
  }

  function clearActive(){
    isActive = false;
    ringEl.classList.remove('active');
    ringEl.classList.remove('input-focus');
    targetSize = NON_INTERACTIVE_SIZE;
  }

  // delegated handlers (no centering toward element, only size change)
  document.addEventListener('pointerover', (ev) => {
    const el = ev.target && ev.target.closest ? ev.target.closest(interactiveSelector) : null;
    if (el) {
      setActiveFixed();
    }
  }, { capture: true });

  document.addEventListener('pointerout', (ev) => {
    const to = ev.relatedTarget;
    // if moving to another interactive element, keep active (its pointerover will run)
    if (to && to.closest && to.closest(interactiveSelector)) return;
    clearActive();
  }, { capture: true });

  // keyboard focus support: treat focused interactive as active
  document.addEventListener('focusin', (ev) => {
    const el = ev.target && ev.target.closest ? ev.target.closest(interactiveSelector) : null;
    if (el) setActiveFixed();
  });
  document.addEventListener('focusout', () => clearActive());

  // constrain mouse position on resize
  window.addEventListener('resize', () => {
    mouse.x = Math.min(mouse.x, window.innerWidth);
    mouse.y = Math.min(mouse.y, window.innerHeight);
  });

  // small API for debugging/tuning
  window.__cursorRing = {
    el: ringEl,
    setActiveSize: (px) => { targetSize = Number(px) || NON_INTERACTIVE_SIZE; },
    setNonInteractiveSize: (px) => { if (!isActive) targetSize = Number(px) || NON_INTERACTIVE_SIZE; },
    hide: () => ringEl.classList.add('hidden'),
    show: () => ringEl.classList.remove('hidden')
  };
})();