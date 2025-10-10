document.getElementById('year').textContent = new Date().getFullYear();

const robotEmojis = ['🤖', '🦾', '⚙️', '🔧', '🔩', '📡', '🛠️', '💡'];
const sponsorForm = document.getElementById('sponsorForm');
const sponsorGrid = document.getElementById('sponsorGrid');
const smsg = document.getElementById('smsg');

const contactForm = document.getElementById('contactForm');
const cmsg = document.getElementById('cmsg');
// Run after DOM is ready in case script loads early
document.addEventListener('DOMContentLoaded', () => {
  const robotEmojis = ['🤖', '🦾', '⚙️', '🔧', '🔩', '📡', '🛠️', '💡'];

  function dropRobotEmoji() {
    const el = document.createElement('div');
    el.className = 'falling-robot';
    el.textContent = robotEmojis[Math.floor(Math.random() * robotEmojis.length)];

    // Random horizontal position within viewport, with small margin
    const vw = window.innerWidth;
    const left = Math.max(8, Math.min(vw - 40, Math.random() * vw));
    el.style.left = left + 'px';

    // Random size and duration for variety
    el.style.fontSize = (Math.random() * 1.4 + 1.6) + 'rem';
    const duration = (Math.random() * 2 + 4).toFixed(2) + 's';
    el.style.animationDuration = duration + ', ' + duration;

    document.body.appendChild(el);

    // Clean up after animation
    setTimeout(() => el.remove(), parseFloat(duration) * 1000 + 200);
  }

  // Drop one immediately and then every 30s
  dropRobotEmoji();
  setInterval(dropRobotEmoji, 30000);
});


function createSponsorElement(name, website, imgSrc){
  const div = document.createElement('div');
  div.className = 'sponsor-item';
  if(imgSrc){
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

function loadSponsors(){
  try{
    const raw = localStorage.getItem('mercia_sponsors');
    if(!raw) return;
    const arr = JSON.parse(raw);
    arr.forEach(s => sponsorGrid.appendChild(createSponsorElement(s.name, s.website, s.img)));
  } catch(e){console.warn(e)}
}
loadSponsors();

sponsorForm.addEventListener('submit', async function(e){
  e.preventDefault();
  smsg.textContent = '';
  const name = document.getElementById('sname').value.trim();
  const tier = document.getElementById('stier').value;
  const website = document.getElementById('swebsite').value.trim();
  const contact = document.getElementById('scontact').value.trim();
  const file = document.getElementById('slogo').files[0];
  if(!name){ smsg.textContent = 'Please enter a sponsor name.'; return; }
  if(contact && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)){ smsg.textContent = 'Please enter a valid contact email.'; return; }

  const message = `Name: ${name}\nTier: ${tier}\nWebsite: ${website}\nContact: ${contact}`;

  try{
    const response = await fetch('http://localhost:8080/email/sponsor-inquiry', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({name, email: contact, message})
    });
    if(response.ok){
      smsg.textContent = 'Sponsorship inquiry sent successfully!';
      sponsorForm.reset();
    } else {
      smsg.textContent = 'Failed to send inquiry. Please try again.';
    }
  } catch(e){
    smsg.textContent = 'Error sending inquiry. Please check your connection.';
  }
});

contactForm.addEventListener('submit', async function(e){
  e.preventDefault();
  cmsg.textContent = '';
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if(!name || !email || !message){ cmsg.textContent = 'Please fill in all fields.'; return; }
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ cmsg.textContent = 'Please enter a valid email.'; return; }

  try{
    const response = await fetch('http://localhost:8080/email/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({name, email, message})
    });
    if(response.ok){
      cmsg.textContent = 'Message sent successfully!';
      contactForm.reset();
    } else {
      cmsg.textContent = 'Failed to send message. Please try again.';
    }
  } catch(e){
    cmsg.textContent = 'Error sending message. Please check your connection.';
  }
});

setInterval(dropRobotEmoji, 30000);
dropRobotEmoji(); // Optional: drop one on page load

