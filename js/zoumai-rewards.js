/* Zoumaï : récompenses surprises, module commun. */
(function () {
  'use strict';
  const filenames = ['01_curieux.webp','02_clin_oeil.webp','03_royal.webp','04_cool.webp','05_musicien.webp','06_detective.webp','07_super_loup.webp','08_scientifique.webp','09_cuisinier.webp','10_pirate.webp','11_astronaute.webp','12_lecteur.webp'];
  const base = new URL('../assets/zouku-loups/', document.currentScript ? document.currentScript.src : location.href).href;
  const images = filenames.map(name => base + name);
  let streak=0, last=0, active=false;
  const css=document.createElement('style');
  css.textContent='.zm-wolf-reward{position:fixed;bottom:5%;right:5%;z-index:99999;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:5px;animation:zm-wolf-in .3s ease-out both}.zm-wolf-reward img{max-width:min(180px,34vw);max-height:180px;object-fit:contain;filter:drop-shadow(0 6px 12px #0004)}.zm-wolf-reward span{font:bold 18px Arial,sans-serif;background:#fffbe8;color:#24211a;padding:8px 14px;border-radius:20px;box-shadow:0 3px 12px #0002}@keyframes zm-wolf-in{from{opacity:0;transform:translateY(24px) scale(.85)}to{opacity:1;transform:translateY(0) scale(1)}}@media(prefers-reduced-motion:reduce){.zm-wolf-reward{animation:none}}';
  document.head.appendChild(css);
  function show(message){
    if(active || Date.now()-last<5000)return;
    const img=images[Math.floor(Math.random()*images.length)];
    const el=document.createElement('div');el.className='zm-wolf-reward';el.setAttribute('role','status');
    const picture=document.createElement('img');picture.src=img;picture.alt='Loup Zoumaï qui félicite';
    picture.onerror=()=>{el.remove();active=false;};
    const label=document.createElement('span');label.textContent=message;
    el.append(picture,label);document.body.appendChild(el);active=true;last=Date.now();
    setTimeout(()=>{el.remove();active=false},1800);
  }
  window.ZoumaiRewards={
    correct(){streak++;if(streak%5===0)show('Super série !');else if(Math.random()<.2)show(['Bravo !','Bien joué !','Excellent !'][Math.floor(Math.random()*3)]);},
    incorrect(){streak=0;},
    complete(perfect){if(perfect)show('Sans faute !');},
    reset(){streak=0;}
  };
})();
