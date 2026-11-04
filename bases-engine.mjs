import {Chess} from './chess.mjs';

export class Mission {
  constructor(stage, level) {
    this.key = stage.key;
    this.level = level;
    this.game = new Chess();
    this.game.load(level.fen+' 0 1', {skipValidation:true});
    this.targets = new Set(level.stars?.split(' ') || []);
    if (!['king','setup'].includes(this.key)) {
      for (const square of this.targets) this.game.put({type:'p', color:'b'}, square);
    }
    this.count = 0;
    this.done = false;
    this.scriptIndex = 0;
    this.autoplay();
  }
  autoplay() {
    if (this.key !== 'enpassant' || this.game.turn() !== 'b') return;
    const reply = this.level.seq[this.scriptIndex++];
    if (reply) this.game.move({from:reply.slice(0,2), to:reply.slice(2)});
  }
  unsafe() {
    return this.game.moves({verbose:true}).some(move => {
      if (!move.captured) return false;
      this.game.move(move);
      const defended = this.game.moves({verbose:true}).some(reply => reply.to === move.to);
      this.game.undo();
      return !defended;
    });
  }
  play(from,to,promotion='q') {
    const g=this.game, k=this.key, l=this.level;
    if(this.done || g.get(to)?.type==='k') return;
    const move=g.move({from,to,promotion});
    const reject=message=>{g.undo();return message};
    if(['value','enpassant'].includes(k) && from+to !== l.seq[this.scriptIndex])
      return reject('Observe les pièces et essaie un autre coup.');
    if(['combat','protection','capture'].includes(k) && this.unsafe())
      return reject('Les Noirs peuvent prendre une pièce sans que tu puisses la reprendre. Essaie encore.');
    this.playedMove=move;
    this.count++;
    this.targets.delete(to);
    switch(k) {
      case 'setup': this.done=!l.place || l.stars.split(' ').every(s=>g.get(s)?.type===l.place && g.get(s).color==='w');break;
      case 'check1': case 'check2': this.done=g.isCheck();break;
      case 'outOfCheck': case 'protection': case 'value': this.done=true;break;
      case 'stalemate': this.done=g.isStalemate();break;
      case 'checkmate1': this.done=g.isCheckmate();break;
      case 'castling': this.done=move.san.replace(/[+#]/g,'')===l.castle;break;
      case 'capture': case 'combat': this.done=!g.board().flat().some(p=>p?.color==='b');break;
      case 'enpassant': this.scriptIndex++;this.done=this.scriptIndex===l.seq.length;break;
      default: this.done=this.targets.size===0;
    }
    if(!this.done && (['check1','check2','checkmate1','stalemate'].includes(k) && this.count>=l.par)){
      this.count--;
      return reject(k==='checkmate1'&&g.isCheck()?'Échec ! Les Noirs ont encore une défense.':'Essaie une autre case.');
    }
    if(!this.done){
      if(k==='enpassant') this.autoplay();
      else {
        const parts=g.fen().split(' ');
        parts[1]='w';parts[3]='-';
        g.load(parts.join(' '),{skipValidation:true});
      }
    }
    return this.done?'Bravo, problème réussi !':'À toi de continuer.';
  }
}
