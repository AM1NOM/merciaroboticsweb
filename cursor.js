// ...existing code...
(function(){
  const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [data-interactive], .interactive';
  const DEFAULT_SIZE = 20;
  const PADDING = 12; // extra padding around hovered element
  const LERP = 0.18;

  // create DOM
  let ringEl = document.getElementById('cursor-ring');
  if (!ringEl) {
    ringEl = document.createElement('div');
    ringEl.id = 'cursor-ring';
    ringEl.innerHTML = '<div class="ring"></div>';
    document.documentElement.appendChild(ringEl);
  }
  const ring = ringEl.querySelector('.ring');

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

  // events
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    ringEl.classList.remove('hidden');
  });

  document.addEventListener('mouseleave', () => ringEl.classList.add('hidden'));
  document.addEventListener('mouseenter', () => ringEl.classList.remove('hidden'));

  // helper to set active/size
  function setActive(el){
    isActive = true;
    ringEl.classList.add('active');
    if (el && el.getBoundingClientRect) {
      const r = el.getBoundingClientRect();
      const maxDim = Math.max(r.width, r.height);
      targetSize = Math.max(DEFAULT_SIZE, Math.min(160, Math.ceil(maxDim + PADDING)));
      if (/input|textarea|select/.test(el.tagName.toLowerCase())) {
        ringEl.classList.add('input-focus');
        targetSize = Math.max(14, Math.ceil(Math.min(maxDim, 40)));
      } else {
        ringEl.classList.remove('input-focus');
      }
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

  // attach delegated handlers
  function attachDelegatedHandlers() {
    document.addEventListener('pointerover', (ev) => {
      const t = ev.target;
      if (t && t.closest && t.closest(interactiveSelector)) {
        const interactive = t.closest(interactiveSelector);
        setActive(interactive);
      }
    }, { capture: true });

    document.addEventListener('pointerout', (ev) => {
      const to = ev.relatedTarget;
      if (to && to.closest && to.closest(interactiveSelector)) return;
      clearActive();
    }, { capture: true });

    document.addEventListener('focusin', (ev) => {
      const t = ev.target;
      if (t && t.closest && t.closest(interactiveSelector)) {
        setActive(t.closest(interactiveSelector));
      }
    });
    document.addEventListener('focusout', () => clearActive());
  }

  attachDelegatedHandlers();

  // expose simple API
  window.__cursorRing = {
    el: ringEl,
    setActiveSize: (px) => { targetSize = Number(px) || DEFAULT_SIZE; },
    hide: () => ringEl.classList.add('hidden'),
    show: () => ringEl.classList.remove('hidden')
  };
})();