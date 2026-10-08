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
#board .chess-coordinate{position:absolute;z-index:2;pointer-events:none;font-size:clamp(12px,1.8vw,17px);font-weight:900;line-height:1}
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
const rank=Number(sq[1]),file=sq[0],firstFile=flipped?'h':'a',bottomRank=flipped?8:1;
const existingRank=cell.querySelector('.chess-coordinate.rank,.coord:not(.file),.coordinate.rank');
const existingFile=cell.querySelector('.chess-coordinate.file,.coord.file,.coordinate.file');
if(file===firstFile&&!existingRank){const e=document.createElement('span');e.className='chess-coordinate rank';e.textContent=rank;cell.append(e)}
if(rank===bottomRank&&!existingFile){const e=document.createElement('span');e.className='chess-coordinate file';e.textContent=file;cell.append(e)}

}
}finally{active=false}}
const observer=new MutationObserver(sync);observer.observe(board,{childList:true,subtree:true});sync();
window.addEventListener('storage',sync);
/* Pedagogical arrows: window.ZouChessBoard.showArrow('e2','e4')
   or .showArrows([{from:'a1',to:'a5',color:'#ffcc47'}]); .clearArrows() */
const ns='http://www.w3.org/2000/svg';let arrowData=[];
const host=board.parentElement;const existingPosition=getComputedStyle(host).position;
if(existingPosition==='static')host.style.position='relative';
const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 800 800');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;pointer-events:none;z-index:5;overflow:visible;';
const defs=document.createElementNS(ns,'defs');svg.append(defs);host.append(svg);
function positionSvg(){const br=board.getBoundingClientRect(),hr=host.getBoundingClientRect();svg.style.left=(br.left-hr.left)+'px';svg.style.top=(br.top-hr.top)+'px';svg.style.width=br.width+'px';svg.style.height=br.height+'px'}
function arrowCenter(square){const cell=[...board.querySelectorAll('.sq,.square')].find(e=>(e.getAttribute('aria-label')||'').startsWith(square));if(!cell)return null;const r=cell.getBoundingClientRect(),b=board.getBoundingClientRect();return {x:(r.left+r.width/2-b.left)/b.width*800,y:(r.top+r.height/2-b.top)/b.height*800}}
function drawArrows(){positionSvg();svg.replaceChildren();defs.replaceChildren();svg.append(defs);arrowData.forEach((a,i)=>{const from=arrowCenter(a.from),to=arrowCenter(a.to);if(!from||!to||a.from===a.to)return;const color=a.color||'#f6c542';const marker=document.createElementNS(ns,'marker');marker.id='zou-arrow-'+i;marker.setAttribute('markerWidth','5');marker.setAttribute('markerHeight','5');marker.setAttribute('refX','4');marker.setAttribute('refY','2.5');marker.setAttribute('orient','auto');marker.setAttribute('markerUnits','strokeWidth');const head=document.createElementNS(ns,'path');head.setAttribute('d','M0,0 L5,2.5 L0,5 Z');head.setAttribute('fill',color);marker.append(head);defs.append(marker);const line=document.createElementNS(ns,'line');line.setAttribute('x1',from.x);line.setAttribute('y1',from.y);line.setAttribute('x2',to.x);line.setAttribute('y2',to.y);line.setAttribute('stroke',color);line.setAttribute('stroke-width','13');line.setAttribute('stroke-linecap','round');line.setAttribute('opacity','.87');line.setAttribute('marker-end','url(#zou-arrow-'+i+')');svg.append(line)})}
window.ZouChessBoard={showArrow(from,to,color){arrowData=[{from,to,color}];drawArrows()},showArrows(arrows){arrowData=Array.isArray(arrows)?arrows.filter(a=>/^[a-h][1-8]$/.test(a.from)&&/^[a-h][1-8]$/.test(a.to)):[];drawArrows()},clearArrows(){arrowData=[];drawArrows()}};
const resize=new ResizeObserver(()=>{if(arrowData.length)drawArrows();else positionSvg()});resize.observe(board);

})();