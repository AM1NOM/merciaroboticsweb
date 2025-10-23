// ...existing code...
(function(){
  const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [data-interactive], .interactive';
  const DEFAULT_SIZE = 20;
  const PADDING = 12; // extra padding around hovered element
  const LERP = 0.18;

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

  // initial styles ensuring correct starting size
  ring.style.width = `${DEFAULT_SIZE}px`;
  ring.style.height = `${DEFAULT_SIZE}px`;

  // internal state
  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let pos = { x: mouse.x, y: mouse.y };
  let targetSize = DEFAULT_SIZE;
  let isActive = false;

  // smooth follow loop
  function rafLoop(){
    pos.x += (mouse.x - pos.x) * LERP;
    pos.y += (mouse.y - pos.y) * LERP;
    ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    ring.style.width = `${targetSize}px`;
    ring.style.height = `${targetSize}px`;
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  // pointer movement
  document.addEventListener('pointermove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    ringEl.classList.remove('hidden');
  }, { passive: true });

  document.addEventListener('mouseleave', () => ringEl.classList.add('hidden'));
  document.addEventListener('mouseenter', () => ringEl.classList.remove('hidden'));

  // helper to set active/size
  function setActive(el){
    if (!el) return;
    isActive = true;
    ringEl.classList.add('active');
    if (el && el.getBoundingClientRect) {
      const r = el.getBoundingClientRect();
      const maxDim = Math.max(r.width, r.height);
      targetSize = Math.max(DEFAULT_SIZE, Math.min(220, Math.ceil(maxDim + PADDING)));

      // For inputs make the ring smaller / less intrusive
      if (/input|textarea|select/.test(el.tagName.toLowerCase())) {
        ringEl.classList.add('input-focus');
        targetSize = Math.max(14, Math.ceil(Math.min(maxDim + 6, 48)));
      } else {
        ringEl.classList.remove('input-focus');
      }
       
      mouse.x = r.left + r.width / 2;
      mouse.y = r.top + r.height / 2;
    } else {
      targetSize = DEFAULT_SIZE * 1.6;
      ringEl.classList.remove('input-focus');
    }
  }

  function clearActive(){
    isActive = false;
    ringEl.classList.remove('active');
    ringEl.classList.remove('input-focus');
    targetSize = DEFAULT_SIZE;
  }

  // delegated handlers so dynamic elements are handled
  document.addEventListener('pointerover', (ev) => {
    const el = ev.target && ev.target.closest ? ev.target.closest(interactiveSelector) : null;
    if (el) setActive(el);
  }, { capture: true });

  document.addEventListener('pointerout', (ev) => {
    const to = ev.relatedTarget;
    if (to && to.closest && to.closest(interactiveSelector)) {
      // moving to another interactive element — let its pointerover handle it
      return;
    }
    clearActive();
  }, { capture: true });

  // keyboard focus support
  document.addEventListener('focusin', (ev) => {
    const el = ev.target && ev.target.closest ? ev.target.closest(interactiveSelector) : null;
    if (el) setActive(el);
  });
  document.addEventListener('focusout', () => clearActive());

  // keep ring within window on resize
  window.addEventListener('resize', () => {
    mouse.x = Math.min(mouse.x, window.innerWidth);
    mouse.y = Math.min(mouse.y, window.innerHeight);
  });

  // expose small API for debugging / tuning
  window.__cursorRing = {
    el: ringEl,
    setActiveSize: (px) => { targetSize = Number(px) || DEFAULT_SIZE; },
    hide: () => ringEl.classList.add('hidden'),
    show: () => ringEl.classList.remove('hidden')
  };
})();
/* ...existing code... */