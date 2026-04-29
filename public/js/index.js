document.addEventListener('DOMContentLoaded', () => {

const DATA = [
  {rank:'A',suit:'♠',red:false,stars:5,quote:"Edgar a émerveillé tous nos invités. Les gens n'en revenaient pas - certains ont demandé à recommencer !",author:"Sophie & Thomas - Mariage à Versailles"},
  {rank:'K',suit:'♦',red:true,stars:5,quote:"Notre soirée d'entreprise a pris une toute autre dimension. Il sait mettre tout le monde à l'aise instantanément.",author:"Marc D. - Directeur chez Renault"},
  {rank:'Q',suit:'♥',red:true,stars:5,quote:"Pour les 40 ans de ma femme je voulais quelque chose d'inoubliable. Edgar a largement dépassé nos attentes.",author:"Laurent B. - Soirée privée Paris"},
  {rank:'J',suit:'♣',red:false,stars:5,quote:"Nos clients ont été totalement subjugués. Edgar s'adapte à chaque personne, c'est ce qui rend sa magie si unique.",author:"Céline M. - Événement VIP Lyon"},
  {rank:'10',suit:'♠',red:false,stars:5,quote:"Les enfants comme les adultes étaient sous le charme. Un magicien qui touche tout le monde, c'est vraiment rare.",author:"Famille Bertrand - Anniversaire Nantes"},
  {rank:'9',suit:'♦',red:true,stars:5,quote:"Une prestation hors du commun pour notre gala. Chaque invité repartait avec un souvenir plein les yeux.",author:"Isabelle R. - Gala caritatif Paris"},
  {rank:'7',suit:'♥',red:true,stars:5,quote:"Bluffant du début à la fin. Toute la table en parlait encore le lendemain matin.",author:"Pierre V. - Dîner d'affaires Bordeaux"},
];

const CARD_W = 210, GAP = 20, STEP = CARD_W + GAP;
const track = document.getElementById('tcTrack');
const stage = document.getElementById('tcStage');
const overlay = document.getElementById('tcOverlay');
const bigCard = document.getElementById('tcBigCard');

if (!track || !stage || !overlay || !bigCard) return;

let offset = 0, running = true, raf = null, last = null, speed = 0.4;
let dragging = false, dragX0 = 0, dragOff0 = 0;

function cloneData() {
  const arr = [];
  for (let i = 0; i < 4; i++) DATA.forEach(d => arr.push(d));
  return arr;
}

const ALL = cloneData();
const cards = [];

ALL.forEach((d) => {
  const el = document.createElement('div');
  el.className = 'tc-card';
  const col = d.red ? '#c0392b' : 'var(--text)';
  const starCol = d.red ? '#c0392b' : '#00CFFF';
  el.innerHTML =
    '<div class="tc-corner tl" style="color:' + col + '">' + d.rank + '<br>' + d.suit + '</div>' +
    '<div class="tc-corner br" style="color:' + col + '">' + d.rank + '<br>' + d.suit + '</div>' +
    '<div class="tc-suit-bg">' + d.suit + '</div>' +
    '<div class="tc-body">' +
      '<div class="tc-stars" style="color:' + starCol + '">' + '★'.repeat(d.stars) + '</div>' +
      '<div class="tc-quote">"' + d.quote + '"</div>' +
      '<div class="tc-author">— ' + d.author + '</div>' +
    '</div>';
  el.addEventListener('click', () => openCard(d));
  track.appendChild(el);
  cards.push(el);
});

const halfTotal = Math.floor(ALL.length / 2) * STEP;
offset = 0;

function applyOffset(animated) {
  track.style.transition = animated ? 'transform .4s cubic-bezier(0.4,0,0.2,1)' : 'none';
  track.style.transform = 'translateX(' + (-offset) + 'px)';
}

function loop(ts) {
  if (!running) { raf = requestAnimationFrame(loop); return; }
  if (last === null) { last = ts; }
  const dt = ts - last; last = ts;
  offset += speed * (dt / 16);
  if (offset >= halfTotal) offset -= halfTotal;
  applyOffset(false);
  raf = requestAnimationFrame(loop);
}
raf = requestAnimationFrame(loop);

stage.addEventListener('mousedown', e => {
  dragging = true; dragX0 = e.clientX; dragOff0 = offset; running = false;
  track.style.transition = 'none';
});
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  const dx = dragX0 - e.clientX;
  offset = dragOff0 + dx;
  if (offset < 0) offset += halfTotal;
  if (offset >= halfTotal) offset -= halfTotal;
  applyOffset(false);
});
window.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false; running = true; last = null;
});

document.getElementById('tcPrev').onclick = () => {
  offset -= STEP; if (offset < 0) offset += halfTotal; applyOffset(true);
};
document.getElementById('tcNext').onclick = () => {
  offset += STEP; if (offset >= halfTotal) offset -= halfTotal; applyOffset(true);
};

function spawnParticles() {
  const p = document.getElementById('tcParticles');
  p.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'tc-p';
    const angle = Math.random() * 360;
    const dist = 60 + Math.random() * 80;
    const dx = Math.cos(angle * Math.PI / 180) * dist + 'px';
    const dy = Math.sin(angle * Math.PI / 180) * dist + 'px';
    el.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;--dx:' + dx + ';--dy:' + dy + ';animation-delay:' + (Math.random() * 0.3) + 's;background:' + (Math.random() > .5 ? '#00CFFF' : '#fff') + ';';
    p.appendChild(el);
  }
}

function openCard(d) {
  running = false;
  const col = d.red ? '#c0392b' : 'var(--text)';
  const starCol = d.red ? '#c0392b' : '#00CFFF';
  document.getElementById('ocTL').style.color = col;
  document.getElementById('ocTL').innerHTML = d.rank + '<br>' + d.suit;
  document.getElementById('ocBR').style.color = col;
  document.getElementById('ocBR').innerHTML = d.rank + '<br>' + d.suit;
  document.getElementById('ocSuit').textContent = d.suit;
  document.getElementById('ocStars').style.color = starCol;
  document.getElementById('ocStars').textContent = '★'.repeat(d.stars);
  document.getElementById('ocQuote').textContent = '"' + d.quote + '"';
  document.getElementById('ocAuthor').textContent = '— ' + d.author;
  overlay.classList.add('active');
  setTimeout(spawnParticles, 400);
}

function closeCard() {
  bigCard.style.transition = 'opacity .4s ease, transform .5s cubic-bezier(0.4,0,0.6,1)';
  bigCard.style.opacity = '0';
  bigCard.style.transform = 'scale(1.2) rotate(-4deg)';
  document.getElementById('tcBg').style.opacity = '0';
  setTimeout(() => {
    overlay.classList.remove('active');
    bigCard.style.opacity = '';
    bigCard.style.transform = '';
    bigCard.style.transition = '';
    running = true; last = null;
  }, 500);
}

document.getElementById('tcClose').onclick = closeCard;
document.getElementById('tcBg').onclick = closeCard;

});