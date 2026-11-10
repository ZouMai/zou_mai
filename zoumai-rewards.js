/* Zoumaï : moteur commun de récompenses, version 1.
   Utilisation dans un exercice :
   ZoumaiRewards.correct(); ZoumaiRewards.incorrect();
   ZoumaiRewards.complete({perfect:true});
   Les images attendues sont images/loups/loup-01.png ... loup-12.png.
*/
(function(){
  'use strict';
  if(window.ZoumaiRewards) return;
  let streak=0, successes=0, last=0, timer=null;
  const base='images/loups/';
  const images=Array.from({length:12},(_,i)=>base+'loup-'+String(i+1).padStart(2,'0')+'.png');
  const style=document.createElement('style');
  style.textContent=`
    .zm-reward{position:fixed;right:clamp(12px,4vw,36px);bottom:clamp(12px,5vh,40px);z-index:2147483000;
      display:flex;align-items:center;gap:12px;max-width:min(340px,85vw);padding:10px 16px;
      background:#fffdf5;border:3px solid #1f2830;border-radius:22px;box-shadow:0 9px 25px #0003;
      font:800 17px/1.2 system-ui,sans-serif;color:#1f2830;pointer-events:none;
      animation:zm-reward-enter .35s ease-out both}
    .zm-reward img{width:84px;height:84px;object-fit:contain}
    .zm-reward span{flex:1}
    .zm-reward--special{background:#fff1b5}
    @keyframes zm-reward-enter{from{opacity:0;transform:translateY(30px) scale(.85)}to{opacity:1;transform:none}}
    @media(prefers-reduced-motion:reduce){.zm-reward{animation:none}}
  `;
  function mount(){if(!style.isConnected)document.head.appendChild(style);}
  function show(message,special=false){
    const now=Date.now();if(now-last<900)return;last=now;
    mount();document.querySelector('.zm-reward')?.remove();clearTimeout(timer);
    const node=document.createElement('div');node.className='zm-reward'+(special?' zm-reward--special':'');
    node.setAttribute('role','status');
    const img=document.createElement('img');img.alt='';img.src=images[Math.floor(Math.random()*images.length)];
    img.onerror=()=>img.remove();
    const label=document.createElement('span');label.textContent=message;
    node.append(img,label);document.body.appendChild(node);
    timer=setTimeout(()=>node.remove(),special?2600:1700);
  }
  window.ZoumaiRewards={
    correct(){streak++;successes++;if(streak%5===0)show('Super série de '+streak+' !',true);else if(successes%3===0)show('Bravo, continue !');},
    incorrect(){streak=0;},
    complete({perfect=false}={}){show(perfect?'Sans-faute ! Bravo !':'Exercice terminé !',true);streak=0;successes=0;},
    show,
    reset(){streak=0;successes=0;}
  };
})();
