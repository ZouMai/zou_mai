(function(){
const KEY='zoumai-player-nickname',SCORES='zoumai-best-scores-v1';
function clean(v){return String(v||'').trim().replace(/\s+/g,' ').slice(0,18)}
function name(){let n=clean(localStorage.getItem(KEY));if(n)return n;n=clean(prompt('Ton prénom ou ton pseudo (pas de nom de famille) :')||'');if(n)localStorage.setItem(KEY,n);return n}
function all(){try{return JSON.parse(localStorage.getItem(SCORES))||{}}catch(e){return{}}}
function save(game,score,max,category){const n=name();if(!n||!max)return null;const pct=Math.max(0,Math.min(100,Math.round(Number(score)/Number(max)*100))),data=all(),g=data[game]||(data[game]={category:category||game,players:{}}),old=g.players[n];if(!old||pct>old.points||(pct===old.points&&Number(score)>old.score))g.players[n]={score:Number(score),max:Number(max),points:pct,at:Date.now()};localStorage.setItem(SCORES,JSON.stringify(data));return{nickname:n,points:pct,ranking:rank(game)}}
function rank(game){const g=all()[game];return g?Object.entries(g.players||{}).map(([nickname,x])=>({nickname,...x})).sort((a,b)=>b.points-a.points||b.score-a.score||a.at-b.at).slice(0,10):[]}
function render(game,title,target){const el=typeof target==='string'?document.querySelector(target):target;if(!el)return;const r=rank(game);el.innerHTML='<h2>🏆 '+title+'</h2><p>Meilleur score de chaque pseudo sur cet appareil.</p><ol>'+(r.length?r.map(x=>'<li><strong>'+x.nickname.replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]))+'</strong> — '+x.points+' pts</li>').join(''):'<li>Aucun score pour le moment.</li>')+'</ol>'}
window.ZoumaiScores={name,save,rank,render};
})();