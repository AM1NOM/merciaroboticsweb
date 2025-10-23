// --- Existing site logic ---

document.getElementById('year').textContent = new Date().getFullYear();

const sponsorForm = document.getElementById('sponsorForm');
const sponsorGrid = document.getElementById('sponsorGrid');
const smsg = document.getElementById('smsg');

const contactForm = document.getElementById('contactForm');
const cmsg = document.getElementById('cmsg');

function createSponsorElement(name, website, imgSrc) {
  const div = document.createElement('div');
  div.className = 'sponsor-item';
  if (imgSrc) {
    const a = document.createElement('a');
    a.href = website || '#';
    a.target = '_blank';
    const img = document.createElement('img');
    img.alt = name;
    img.src = imgSrc;
    a.appendChild(img);
    div.appendChild(a);
  } else {
    div.textContent = name;
  }
  return div;
}

function loadSponsors() {
  try {
    const raw = localStorage.getItem('mercia_sponsors');
    if (!raw) return;
    const arr = JSON.parse(raw);
    arr.forEach(s =>
      sponsorGrid.appendChild(createSponsorElement(s.name, s.website, s.img))
    );
  } catch (e) {
    console.warn(e);
  }
}
loadSponsors();

sponsorForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  smsg.textContent = '';
  const name = document.getElementById('sname').value.trim();
  const tier = document.getElementById('stier').value;
  const website = document.getElementById('swebsite').value.trim();
  const contact = document.getElementById('scontact').value.trim();
  const file = document.getElementById('slogo').files[0];
  if (!name) {
    smsg.textContent = 'Please enter a sponsor name.';
    return;
  }
  if (contact && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)) {
    smsg.textContent = 'Please enter a valid contact email.';
    return;
  }

  const message = `Name: ${name}\nTier: ${tier}\nWebsite: ${website}\nContact: ${contact}`;

  try {
    const response = await fetch('http://localhost:8080/email/sponsor-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, email: contact, message })
    });
    if (response.ok) {
      smsg.textContent = 'Sponsorship inquiry sent successfully!';
      sponsorForm.reset();
    } else {
      smsg.textContent = 'Failed to send inquiry. Please try again.';
    }
  } catch (e) {
    smsg.textContent = 'Error sending inquiry. Please check your connection.';
  }
});

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  cmsg.textContent = '';
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    cmsg.textContent = 'Please fill in all fields.';
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    cmsg.textContent = 'Please enter a valid email.';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/email/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, email, message })
    });
    if (response.ok) {
      cmsg.textContent = 'Message sent successfully!';
      contactForm.reset();
    } else {
      cmsg.textContent = 'Failed to send message. Please try again.';
    }
  } catch (e) {
    cmsg.textContent = 'Error sending message. Please check your connection.';
  }
});

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

const container = document.getElementById('dot-layer');
const numDots = 100;
const dots = [];
const maxInfluence = 100; // pixels

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});



  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    dot.dataset.origX = x;
    dot.dataset.origY = y;

    container.appendChild(dot);
    dots.push(dot);
  }

  function animateDots() {
    dots.forEach(dot => {
      const rect = dot.getBoundingClientRect();
      const dx = mouse.x - rect.left;
      const dy = mouse.y - rect.top;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxInfluence) {
        const moveX = dx * 0.1;
        const moveY = dy * 0.1;
        dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
        dot.style.opacity = '0.8';
      } else {
        dot.style.transform = 'translate(0, 0)';
        dot.style.opacity = '0.5';
      }
    });

    requestAnimationFrame(animateDots);
  }

  requestAnimationFrame(animateDots);
});
