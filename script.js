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

// --- Cursor ring logic ---

window.addEventListener('DOMContentLoaded', () => {
  const ring = document.getElementById('cursor-ring');
  if (!ring) {
    console.warn('No #cursor-ring element found in DOM.');
    return;
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;

  function animate() {
    x += (targetX - x) * 0.25;
    y += (targetY - y) * 0.25;

    ring.style.transform = `translate(${x}px, ${y}px) scale(${
      ring.classList.contains('hover') ? 1.8 : 1
    })`;

    requestAnimationFrame(animate);
  }
  animate();

  // Update target on mouse move
  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Detect hover over interactive elements
  const isInteractive = el =>
    el.matches('button, a, [role="button"], input, select, textarea, .cta');

  let hoverCount = 0;

  document.addEventListener('mouseover', e => {
    if (isInteractive(e.target)) {
      hoverCount++;
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (isInteractive(e.target)) {
      hoverCount = Math.max(0, hoverCount - 1);
      if (hoverCount === 0) ring.classList.remove('hover');
    }
  });

  // Keep ring inside viewport on resize
  window.addEventListener('resize', () => {
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);
  });
});
