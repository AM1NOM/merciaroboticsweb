document.getElementById('year').textContent = new Date().getFullYear();

const sponsorForm = document.getElementById('sponsorForm');
const sponsorGrid = document.getElementById('sponsorGrid');
const smsg = document.getElementById('smsg');

const contactForm = document.getElementById('contactForm');
const cmsg = document.getElementById('cmsg');

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
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  if (!canvas) return; // guard if section not present
  const context = canvas.getContext('2d');

  const grid = 16;
  let count = 0;

  const snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
  };

  const apple = { x: 320, y: 320 };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function loop() {
    requestAnimationFrame(loop);

    if (++count < 4) return;
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake
    context.fillStyle = 'lime';
    snake.cells.forEach((cell, index) => {
      context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }

      for (let i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          snake.x = 160;
          snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;
          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
    else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
    else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
    else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
  });

  requestAnimationFrame(loop);
});

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

