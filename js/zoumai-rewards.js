/* Zoumaï : récompenses surprises, module commun. */
(function () {
  'use strict';
  const filenames = ['01_curieux.webp','02_clin_oeil.webp','03_royal.webp','04_cool.webp','05_musicien.webp','06_detective.webp','07_super_loup.webp','08_scientifique.webp','09_cuisinier.webp','10_pirate.webp','11_astronaute.webp','12_lecteur.webp'];
  const base = new URL('../assets/zouku-loups/', document.currentScript ? document.currentScript.src : location.href).href;
  const images = filenames.map(name => base + name);
  let streak=0, last=0, active=false;
  const css=document.createElement('style');
  css.textContent='.zm-wolf-reward{position:fixed;bottom:5%;right:5%;z-index:99999;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:5px;animation:zm-wolf-in .3s ease-out both}.zm-wolf-reward img{max-width:min(180px,34vw);max-height:180px;object-fit:contain;filter:drop-shadow(0 6px 12px #0004)}.zm-wolf-reward span{font:bold 18px Arial,sans-serif;background:#fffbe8;color:#24211a;padding:8px 14px;border-radius:20px;box-shadow:0 3px 12px #0002}@keyframes zm-wolf-in{from{opacity:0;transform:translateY(24px) scale(.85)}to{opacity:1;transform:translateY(0) scale(1)}}@media(prefers-reduced-motion:reduce){.zm-wolf-reward{animation:none}}';
  css.textContent += '.zm-wolf-reward{isolation:isolate}.zm-wolf-reward img,.zm-wolf-reward span{position:relative;z-index:1}.zm-wolf-sparkles{position:absolute;left:50%;top:40%;z-index:0}.zm-wolf-sparkles i{position:absolute;font:900 22px Arial;color:#ffcc29;transform:rotate(var(--a)) translateY(0);animation:zm-spark 1.1s ease-out infinite;animation-delay:calc(var(--a) * 0)}.zm-wolf-level-2 img{animation:zm-bounce .75s ease-in-out 2}.zm-wolf-level-3 img{animation:zm-bounce .7s ease-in-out 3}.zm-wolf-level-3 span{background:#ffe171}@keyframes zm-spark{0%{opacity:0;transform:rotate(var(--a)) translateY(0) scale(.3)}50%{opacity:1}100%{opacity:0;transform:rotate(var(--a)) translateY(calc(-1 * var(--d))) scale(1.1)}}@keyframes zm-bounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.08)}}@media(prefers-reduced-motion:reduce){.zm-wolf-sparkles i,.zm-wolf-level-2 img,.zm-wolf-level-3 img{animation:none}}';
  document.head.appendChild(css);
  function show(message, level=1){
    if(active){document.querySelector('.zm-wolf-reward')?.remove();active=false;}
    if(level===1 && Date.now()-last<5000)return;
    const img=images[Math.floor(Math.random()*images.length)];
    const el=document.createElement('div');el.className='zm-wolf-reward zm-wolf-level-'+level;el.setAttribute('role','status');
    const picture=document.createElement('img');picture.src=img;picture.alt='Loup Zoumaï qui félicite';
    picture.onerror=()=>{el.remove();active=false;};
    const label=document.createElement('span');label.textContent=message;
    const sparkles=document.createElement('div');sparkles.className='zm-wolf-sparkles';sparkles.setAttribute('aria-hidden','true');
    for(let i=0;i<(level===3?14:level===2?8:3);i++){const star=document.createElement('i');star.textContent=i%3===0?'✦':'★';star.style.setProperty('--a',(i*360/(level===3?14:level===2?8:3))+'deg');star.style.setProperty('--d',(level===3?112:level===2?86:62)+'px');sparkles.appendChild(star);}
    el.append(sparkles,picture,label);document.body.appendChild(el);active=true;last=Date.now();
    setTimeout(()=>{el.remove();active=false},level===3?3100:level===2?2400:1800);
  }
  window.ZoumaiRewards={
    correct(){streak++;if(streak%5===0)show('Super série !',2);else if(Math.random()<.2)show(['Bravo !','Bien joué !','Excellent !'][Math.floor(Math.random()*3)]);},
    incorrect(){streak=0;},
    complete(perfect){if(perfect)show('Sans faute !',3);},
    reset(){streak=0;}
  };
})();
