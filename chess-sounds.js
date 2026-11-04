(() => {
  const key = 'zou-chess-sound';
  let enabled = true, context;
  try { enabled = localStorage.getItem(key) !== 'off'; } catch {}
  const patterns = {
    move: [[320,.052,0]],
    capture: [[265,.055,0],[150,.08,.045]],
    check: [[620,.095,0],[835,.14,.09]],
    mate: [[587,.13,0],[740,.13,.12],[880,.28,.24]],
    castle: [[310,.06,0],[370,.07,.085]],
    promotion: [[440,.08,0],[554,.09,.07],[740,.16,.15]]
  };
  const Engine = window.AudioContext || window.webkitAudioContext;
  function unlock() {
    if (!enabled || !Engine) return;
    try {
      context ||= new Engine();
      if (context.state !== 'running') context.resume().catch(()=>{});
    } catch {}
  }
  function play(kind='move') {
    if (!enabled || !Engine) return;
    unlock();
    if (!context || context.state==='closed') return;
    for (const [frequency,duration,delay] of patterns[kind] || patterns.move) {
      const start=context.currentTime+delay+.008;
      const tone=context.createOscillator(), gain=context.createGain();
      tone.type='triangle';
      tone.frequency.setValueAtTime(frequency,start);
      if(kind==='move'||kind==='capture'||kind==='castle')tone.frequency.exponentialRampToValueAtTime(frequency*.52,start+duration);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(.12,start+.006);
      gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
      tone.connect(gain);gain.connect(context.destination);
      tone.onended=()=>{tone.disconnect();gain.disconnect()};
      tone.start(start);tone.stop(start+duration+.005);
    }
  }
  function move(m) {
    if(!m)return;
    const san=m.san||'';
    if(san.endsWith('#'))play('mate');
    else if(san.endsWith('+'))play('check');
    else if(m.promotion)play('promotion');
    else if(san.startsWith('O-O'))play('castle');
    else play(m.captured?'capture':'move');
  }
  window.ZouChessSound={play,move};
  if(!Engine)return;
  document.addEventListener('pointerdown',unlock,{capture:true,once:true});
  document.addEventListener('keydown',unlock,{capture:true,once:true});
  const button=document.createElement('button');
  button.type='button';
  button.style.cssText='display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:6px 10px;margin:4px;border:1px solid #788b80;border-radius:9px;background:#24392d;color:#fff;font:600 14px system-ui;cursor:pointer';
  function label(){
    button.textContent=enabled?'♪ Sons actifs':'♪ Sons coupés';
    button.setAttribute('aria-pressed',String(enabled));
    button.setAttribute('aria-label','Bruitages des échecs');
  }
  button.onclick=()=>{
    enabled=!enabled;
    try { localStorage.setItem(key,enabled?'on':'off'); } catch {}
    label();if(enabled)play();
  };
  window.addEventListener('storage',e=>{if(e.key===key){enabled=e.newValue!=='off';label()}});
  label();
  const host=document.querySelector('.tools')||document.querySelector('header')||document.querySelector('main')||document.body;
  if(host.matches('main,body'))host.prepend(button);else host.append(button);
})();