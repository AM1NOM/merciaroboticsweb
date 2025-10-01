document.getElementById('year').textContent = new Date().getFullYear();

const sponsorForm = document.getElementById('sponsorForm');
const sponsorGrid = document.getElementById('sponsorGrid');
const smsg = document.getElementById('smsg');

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

sponsorForm.addEventListener('submit', function(e){
  e.preventDefault();
  smsg.textContent = '';
  const name = document.getElementById('sname').value.trim();
  const tier = document.getElementById('stier').value;
  const website = document.getElementById('swebsite').value.trim();
  const contact = document.getElementById('scontact').value.trim();
  const file = document.getElementById('slogo').files[0];
  if(!name){ smsg.textContent = 'Please enter a sponsor name.'; return; }
  if(contact && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)){ smsg.textContent = 'Please enter a valid contact email.'; return; }

  const sponsorObj = {name, tier, website, contact, img: null};

  function finalize(imgData){
    sponsorObj.img = imgData;
    sponsorGrid.appendChild(createSponsorElement(name, website, imgData));
    smsg.textContent = 'Thanks — sponsorship noted locally. We will contact you to finalise details.';
    try{
      const existing = JSON.parse(localStorage.getItem('mercia_sponsors') || '[]');
      existing.push(sponsorObj);
      localStorage.setItem('mercia_sponsors', JSON.stringify(existing));
    }catch(e){console.warn(e)}
    sponsorForm.reset();
  }

  if(file){
    const reader = new FileReader();
    reader.onload = () => finalize(reader.result);
    reader.readAsDataURL(file);
  } else {
    finalize(null);
  }
});