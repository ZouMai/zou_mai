import { createClient } from 'npm:@supabase/supabase-js@2.96.0';
import { challengeBank } from './challenges.ts';

const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const weight: Record<string,number> = {'+':1,'−':2,'×':1,'÷':3};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const cors = {
  'Access-Control-Allow-Origin':'https://zoumai.github.io',
  'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':'content-type',
  'Content-Type':'application/json',
  'Cache-Control':'no-store'
};
function reply(data: unknown,status=200) {return new Response(JSON.stringify(data),{status,headers:cors});}
function nameOf(value: unknown) {
  if(typeof value !== 'string')return '';
  const name=value.trim().replace(/\s+/g,' ');
  return name.length<=18 && /^[\p{L}][\p{L}\p{M}\p{N} _'-]*$/u.test(name) ? name : '';
}
function checkAnswer(cards: number[],target: number,moves: unknown,hintUsed: boolean) {
  if(!Array.isArray(moves)||moves.length<1||moves.length>cards.length-1)return null;
  const tokens = new Map<number,{value:number,used:number[],ops:string[]}>(cards.map((value,id)=>[id,{value,used:[id],ops:[]}]));
  for(let i=0;i<moves.length;i++){
    const step=moves[i];
    if(!step||typeof step!=='object')return null;
    const {firstId,secondId,op}=step as {firstId:number,secondId:number,op:string};
    if(!Number.isInteger(firstId)||!Number.isInteger(secondId)||firstId===secondId||!Object.hasOwn(weight,op))return null;
    const a=tokens.get(firstId),b=tokens.get(secondId);
    if(!a||!b)return null;
    const value=op==='+'?a.value+b.value:op==='−'?a.value-b.value:op==='×'?a.value*b.value:a.value/b.value;
    if(!Number.isSafeInteger(value)||value<=0)return null;
    tokens.delete(firstId);tokens.delete(secondId);
    tokens.set(cards.length+i,{value,used:[...a.used,...b.used],ops:[...a.ops,...b.ops,op]});
  }
  const scores=[...tokens.values()].filter(token=>token.value===target&&token.ops.length).map(token=>{
    const mathador=token.used.length===5&&token.ops.length===4&&Object.keys(weight).every(op=>token.ops.includes(op));
    return (mathador?18:5+token.ops.reduce((sum,op)=>sum+weight[op],0))-(hintUsed?2:0);
  });
  return scores.length?Math.max(...scores):null;
}
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.headers.get('origin') && req.headers.get('origin')!=='https://zoumai.github.io')return reply({error:'Origine non autorisée'},403);
  try {
    if(req.method==='GET'){
      const {data,error}=await service.from('mathador_scores').select('nickname,completed,points').limit(500);
      if(error)throw error;
      const grouped=new Map<string,{name:string,completed:number,points:number}>();
      for(const row of data||[]){const key=row.nickname.trim().toLocaleLowerCase('fr');const total=(row.points as number[]).reduce((sum,n)=>sum+n,0);const old=grouped.get(key);if(!old||total>old.points)grouped.set(key,{name:row.nickname,completed:row.completed,points:total});}
      const ranking=[...grouped.values()].sort((a,b)=>b.points-a.points||b.completed-a.completed||a.name.localeCompare(b.name,'fr')).slice(0,10);
      return reply({ranking});
    }
    if(req.method!=='POST')return reply({error:'Méthode non autorisée'},405);
    if(Number(req.headers.get('content-length')||0)>8192)return reply({error:'Requête trop longue'},413);
    const body=await req.json();
    if(!uuid.test(body?.playerId||''))return reply({error:'Identifiant invalide'},400);
    if(body.action==='challenge'){
      const nickname=nameOf(body.nickname),level=body.level;
      if(!nickname||!Number.isInteger(level)||level<0||level>8)return reply({error:'Défi invalide'},400);
      const {data:matches,error}=await service.from('mathador_scores').select('player_id,nickname,completed,points').ilike('nickname',nickname);
      if(error)throw error;
      const existing=(matches||[]).filter(p=>p.nickname.trim().toLocaleLowerCase('fr')===nickname.toLocaleLowerCase('fr')).sort((a,b)=>b.points.reduce((s:number,n:number)=>s+n,0)-a.points.reduce((s:number,n:number)=>s+n,0));
      let profile=existing[0]||null;
      const canonicalId=profile?.player_id||body.playerId;
      if(error)throw error;
      if(!profile){
        if(level!==0)return reply({error:'Commence au premier défi'},400);
        const created=await service.from('mathador_scores').insert({player_id:body.playerId,nickname}).select('completed,points').single();
        if(created.error)throw created.error;
        profile=created.data;
      }
      if(level>profile.completed)return reply({error:'Défi encore verrouillé'},403);
      const pick=challengeBank[level][crypto.getRandomValues(new Uint32Array(1))[0]%challengeBank[level].length];
      const {data,error:insertError}=await service.from('mathador_challenges').insert({
        player_id:canonicalId,level,cards:pick.cards,target:pick.target,witness:pick.witness
      }).select('id').single();
      if(insertError)throw insertError;
      return reply({id:data.id,cards:pick.cards,target:pick.target,witness:pick.witness,
        level,playerId:canonicalId,completed:profile.completed,points:profile.points});
    }
    if(body.action==='finish'){
      if(!uuid.test(body.challengeId||''))return reply({error:'Défi invalide'},400);
      const {data:challenge,error}=await service.from('mathador_challenges').select('*').eq('id',body.challengeId)
        .eq('player_id',body.playerId).maybeSingle();
      if(error)throw error;
      if(!challenge||challenge.awarded_score===null&&(challenge.consumed_at||Date.parse(challenge.expires_at)<=Date.now()))
        return reply({error:'Tirage expiré ou déjà joué'},400);
      const score=challenge.awarded_score??checkAnswer(challenge.cards,challenge.target,body.moves,body.hintUsed===true);
      if(score===null)return reply({error:'Calcul non valide'},400);
      const {data:saved,error:saveError}=await service.rpc('save_mathador_result',{
        p_challenge:challenge.id,p_player:body.playerId,p_score:score
      });
      if(saveError)throw saveError;
      return saved?reply(saved):reply({error:'Tirage expiré ou déjà joué'},409);
    }
    return reply({error:'Action inconnue'},400);
  }catch(error){console.error(error);return reply({error:'Service temporairement indisponible'},500);}
});
