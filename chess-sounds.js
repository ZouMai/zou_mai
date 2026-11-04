/* Zoumaï chess: short, natural wood-like clicks, no external audio dependency. */
(() => {
  const key='zou-chess-sound';
  let enabled=true,ctx=null,noise=null;
  try { enabled=localStorage.getItem(key)!=='off'; } catch {}
  const Engine=window.AudioContext||window.webkitAudioContext;
  function unlock(){
    if(!enabled||!Engine)return;
    try {ctx ||= new Engine();if(ctx.state==='suspended')ctx.resume().catch(()=>{});}catch{}
  }
  function buffer(){
    if(noise||!ctx)return noise;
    const length=Math.ceil(ctx.sampleRate*.20);
    noise=ctx.createBuffer(1,length,ctx.sampleRate);
    const data=noise.getChannelData(0);
    // Deterministic, softly decaying contact noise rather than electronic notes.
    let seed=23456789;
    for(let i=0;i<length;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;data[i]=((seed>>>0)/2147483648-1)*Math.exp(-i/(ctx.sampleRate*.025));}
    return noise;
  }
  function tap(delay=0,weight=1,pitch=1){
    if(!ctx)return;
    const at=ctx.currentTime+.006+delay;
    const src=ctx.createBufferSource();src.buffer=buffer();src.playbackRate.value=pitch;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1450/Math.sqrt(weight);filter.Q.value=.65;
    const body=ctx.createBiquadFilter();body.type='peaking';body.frequency.value=510/pitch;body.Q.value=1.1;body.gain.value=5;
    const gain=ctx.createGain();gain.gain.setValueAtTime(.0001,at);
    gain.gain.linearRampToValueAtTime(.24*weight,at+.002);
    gain.gain.exponentialRampToValueAtTime(.0001,at+.075*weight);
    src.connect(filter);filter.connect(body);body.connect(gain);gain.connect(ctx.destination);
    src.start(at);src.stop(at+.15);
    src.onended=()=>{src.disconnect();filter.disconnect();body.disconnect();gain.disconnect();};
  }
  function play(kind='move'){
    if(!enabled||!Engine)return;
    unlock();if(!ctx||ctx.state!=='running')return;
    switch(kind){
      case 'capture':tap(0,1.22,.85);tap(.047,.67,1.2);break;
      case 'castle':tap(0,.9,1);tap(.105,1.08,.88);break;
      case 'check':tap(0,1.12,.82);tap(.105,.48,1.3);break;
      case 'mate':tap(0,1.2,.85);tap(.115,.95,1);tap(.26,.72,1.15);break;
      case 'promotion':tap(0,1.02,1);tap(.10,.74,1.24);break;
      case 'illegal':case 'error':tap(0,.55,.7);break;
      case 'success':tap(0,.8,1.1);tap(.105,.55,1.3);break;
      default:tap(0,.87,1.08);
    }
  }
  function move(m){
    if(!m)return;
    const san=m.san||'';
    if(san.endsWith('#'))play('mate');
    else if(san.endsWith('+'))play('check');
    else if(m.promotion)play('promotion');
    else if(san.startsWith('O-O'))play('castle');
    else play(m.captured||m.flags?.includes('e')?'capture':'move');
  }
  window.ZouChessSound={play,move};
  if(!Engine)return;
  document.addEventListener('pointerdown',unlock,{capture:true,once:true});
  document.addEventListener('keydown',unlock,{capture:true,once:true});
  const button=document.createElement('button');button.type='button';
  button.style.cssText='display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:6px 10px;margin:4px;border:1px solid #788b80;border-radius:9px;background:#24392d;color:#fff;font:600 14px system-ui;cursor:pointer';
  function label(){button.textContent=enabled?'♪ Sons actifs':'♪ Sons coupés';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label','Bruitages des échecs');}
  button.onclick=()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'on':'off');}catch{}label();if(enabled)play('move');};
  window.addEventListener('storage',e=>{if(e.key===key){enabled=e.newValue!=='off';label();}});
  label();
  const host=document.querySelector('.tools')||document.querySelector('header')||document.querySelector('main')||document.body;
  if(host.matches('main,body'))host.prepend(button);else host.append(button);
})();
