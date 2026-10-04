(function(){
const KEY='zoumai-player-nickname',SCORES='zoumai-best-scores-v2',API='https://loibjnlffyjrwttvntup.supabase.co/functions/v1/game-scores';
function clean(v){return String(v||'').trim().replace(/\s+/g,' ').slice(0,18)}
function name(){let n=clean(localStorage.getItem(KEY));if(n)return n;n=clean(prompt('Ton prénom ou ton pseudo (pas de nom de famille) :')||'');if(n)localStorage.setItem(KEY,n);return n}
function all(){try{return JSON.parse(localStorage.getItem(SCORES))||{}}catch(e){return{}}}
function localSave(game,n,score,max){const pct=Math.max(0,Math.min(100,Math.round(score/max*100))),d=all(),g=d[game]||(d[game]={players:{}}),o=g.players[n];if(!o||pct>o.points)g.players[n]={score,max,points:pct,at:Date.now()};localStorage.setItem(SCORES,JSON.stringify(d));return pct}
function localRank(game){const g=all()[game];return g?Object.entries(g.players||{}).map(([nickname,x])=>({nickname,...x})).sort((a,b)=>b.points-a.points||b.score-a.score||a.at-b.at).slice(0,10):[]}
async function save(game,score,max){const n=name();score=Number(score);max=Number(max);if(!n||!Number.isFinite(score)||!Number.isFinite(max)||max<=0)return null;const points=localSave(game,n,score,max);try{await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game,nickname:n,score:Math.round(score),max:Math.round(max)})})}catch(e){}return{nickname:n,points}}
async function rank(game){try{const r=await fetch(API+'?game='+encodeURIComponent(game),{cache:'no-store'}),j=await r.json();if(r.ok&&Array.isArray(j.ranking))return j.ranking}catch(e){}return localRank(game)}
function esc(v){return String(v).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]))}
async function render(game,title,target){const el=typeof target==='string'?document.querySelector(target):target;if(!el)return;el.innerHTML='<h2>🏆 '+esc(title)+'</h2><p>Classement partagé · meilleur score de chaque pseudo.</p><p>Chargement…</p>';const r=await rank(game);el.innerHTML='<h2>🏆 '+esc(title)+'</h2><p>Classement partagé · meilleur score de chaque pseudo.</p><ol>'+(r.length?r.map(x=>'<li><strong>'+esc(x.nickname)+'</strong> — '+x.points+' pts</li>').join(''):'<li>Aucun score pour le moment.</li>')+'</ol>'}
window.ZoumaiScores={name,save,rank,render};
})();