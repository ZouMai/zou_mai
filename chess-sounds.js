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
  // A short, dry mechanical click. No pitched oscillator or low-frequency "boop".
  function buffer(){
    if(noise||!ctx)return noise;
    const rate=ctx.sampleRate, length=Math.ceil(rate*.045);
    noise=ctx.createBuffer(1,length,rate);
    const data=noise.getChannelData(0);
    let seed=1729, previous=0;
    for(let i=0;i<length;i++){
      seed=(Math.imul(seed,1664525)+1013904223)|0;
      const white=(seed/2147483648);
      // Remove low frequencies and use two tiny contact transients.
      const high=white-previous*.94;previous=white;
      const t=i/rate;
      const envelope=Math.exp(-t*390)+.22*Math.exp(-Math.max(0,t-.009)*620)*(t>=.009?1:0);
      data[i]=Math.max(-1,Math.min(1,high*envelope*.55));
    }
    return noise;
  }
  function tap(delay=0,weight=1,pitch=1){
    if(!ctx)return;
    const at=ctx.currentTime+.006+delay;
    const src=ctx.createBufferSource();src.buffer=buffer();src.playbackRate.value=pitch;
    const high=ctx.createBiquadFilter();high.type='highpass';high.frequency.value=1100;high.Q.value=.6;
    const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=6500;low.Q.value=.6;
    const gain=ctx.createGain();gain.gain.value=Math.min(.8,.32*weight);
    src.connect(high);high.connect(low);low.connect(gain);gain.connect(ctx.destination);
    src.start(at);src.stop(at+.05);
    src.onended=()=>{src.disconnect();high.disconnect();low.disconnect();gain.disconnect();};
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
      default:tap(0,.72,1);
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
