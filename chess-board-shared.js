/* Shared visual board system for Class'Échecs, Zou Échecs and free play. */
(()=>{const board=document.getElementById('board');if(!board)return;
const css=document.createElement('style');css.textContent=`
#board{border:5px solid #354d5c!important;border-radius:8px!important;overflow:hidden;touch-action:manipulation;box-shadow:0 10px 30px #07121b55}
#board .sq,#board .square{border:0;padding:0;position:relative;aspect-ratio:1;display:grid;place-items:center;cursor:pointer}
#board .light{background:#eeeed2}#board .dark{background:#769656}
#board[data-theme="blue"] .light{background:#dee7ed!important}#board[data-theme="blue"] .dark{background:#6b90a7!important}
#board[data-theme="wood"] .light{background:#f0d9b5!important}#board[data-theme="wood"] .dark{background:#b58863!important}
#board .sq img,#board .square img{width:96%!important;height:96%!important;object-fit:contain;pointer-events:none;z-index:1;filter:drop-shadow(0 2px 1px #17212b35)}
#board .sq:focus-visible,#board .square:focus-visible{outline:3px solid #ffce63;outline-offset:-3px;z-index:3}
#board .chess-coordinate{position:absolute;z-index:2;pointer-events:none;font-size:clamp(9px,1.3vw,13px);font-weight:900;line-height:1}
#board .chess-coordinate.rank{top:3px;left:4px}#board .chess-coordinate.file{bottom:3px;right:4px}
#board .light .chess-coordinate{color:#5b7b51}#board .dark .chess-coordinate{color:#f5f2da}
#board[data-theme="blue"] .light .chess-coordinate{color:#4a718c}
#board[data-theme="wood"] .light .chess-coordinate{color:#8a6344}
#board[data-theme="wood"] .dark .chess-coordinate{color:#fff3dc}
`;document.head.append(css);
let active=false;
function sync(){if(active)return;active=true;try{
let theme='green',pieces='merida';try{theme=localStorage.getItem('zou-board')||'green';pieces=localStorage.getItem('zou-pieces')||'merida'}catch{}
if(!['green','blue','wood'].includes(theme))theme='green';
if(!['merida','alpha','cburnett'].includes(pieces))pieces='merida';
if(!document.getElementById('theme'))board.dataset.theme=theme;
const squares=Array.from(board.querySelectorAll('.sq,.square'));if(squares.length!==64)return;
const flipped=!!(squares[0].getAttribute('aria-label')||'').startsWith('h1');
for(let i=0;i<64;i++){const cell=squares[i],sq=(cell.getAttribute('aria-label')||'').match(/^[a-h][1-8]/)?.[0];if(!sq)continue;
const img=cell.querySelector('img');if(img){const current=img.getAttribute('src')||'';const desired=current.replace(/\/piece\/(?:merida|alpha|cburnett)\//,'/piece/'+pieces+'/');if(current!==desired&&(!document.getElementById('pieces')))img.setAttribute('src',desired)}
if(!cell.querySelector('.chess-coordinate')){const rank=Number(sq[1]),file=sq[0];const firstFile=flipped?'h':'a',bottomRank=flipped?8:1;
if(file===firstFile){const e=document.createElement('span');e.className='chess-coordinate rank';e.textContent=rank;cell.append(e)}
if(rank===bottomRank){const e=document.createElement('span');e.className='chess-coordinate file';e.textContent=file;cell.append(e)}}
}
}finally{active=false}}
const observer=new MutationObserver(sync);observer.observe(board,{childList:true,subtree:true});sync();
window.addEventListener('storage',sync);
})();