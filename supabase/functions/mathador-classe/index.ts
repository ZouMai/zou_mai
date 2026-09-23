import { createClient } from 'npm:@supabase/supabase-js@2';
import { challengeBank } from './challenges.ts';

const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const allowed = [['+'],['+','−'],['+','×'],['+','×'],['+','×','÷'],['+','−','×'],['+','−','×','÷'],['+','−','×','÷'],['+','−','×','÷']];
const requiredSteps = [1,1,1,2,2,3,3,4,4];
const requiredOp = ['+','−','×',null,'÷',null,'÷',null,null];
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
function checkAnswer(cards: number[],target: number,level: number,moves: unknown,hintUsed: boolean) {
  if(!Array.isArray(moves)||moves.length!==requiredSteps[level])return null;
  const tokens = new Map<number,{value:number,used:number[],ops:string[]}>(cards.map((value,id)=>[id,{value,used:[id],ops:[]}]));
  let final: {value:number,used:number[],ops:string[]}|undefined;
  for(let i=0;i<moves.length;i++){
    const step=moves[i];
    if(!step||typeof step!=='object')return null;
    const {firstId,secondId,op}=step as {firstId:number,secondId:number,op:string};
    if(!Number.isInteger(firstId)||!Number.isInteger(secondId)||firstId===secondId||!allowed[level].includes(op))return null;
    const a=tokens.get(firstId),b=tokens.get(secondId);
    if(!a||!b)return null;
    const value=op==='+'?a.value+b.value:op==='−'?a.value-b.value:op==='×'?a.value*b.value:a.value/b.value;
    if(!Number.isSafeInteger(value)||value<=0)return null;
    tokens.delete(firstId);tokens.delete(secondId);
    final={value,used:[...a.used,...b.used],ops:[...a.ops,...b.ops,op]};
    tokens.set(5+i,final);
  }
  if(!final||final.value!==target||requiredOp[level]&&!final.ops.includes(requiredOp[level]!))return null;
  if(level>=7&&final.used.length!==5)return null;
  const mathador=final.used.length===5&&final.ops.length===4&&['+','−','×','÷'].every(op=>final!.ops.includes(op));
  if(level===8&&!mathador)return null;
  return Math.max(0,(mathador?18:5+final.ops.reduce((sum,op)=>sum+weight[op],0))-(hintUsed?2:0));
}
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.headers.get('origin') && req.headers.get('origin')!=='https://zoumai.github.io')return reply({error:'Origine non autorisée'},403);
  try {
    if(req.method==='GET'){
      const {data,error}=await service.from('mathador_scores').select('nickname,completed,points').limit(500);
      if(error)throw error;
      const ranking=(data||[]).map(row=>({name:row.nickname,completed:row.completed,
        points:(row.points as number[]).reduce((sum,n)=>sum+n,0)}))
        .sort((a,b)=>b.completed-a.completed||b.points-a.points||a.name.localeCompare(b.name,'fr')).slice(0,10);
      return reply({ranking});
    }
    if(req.method!=='POST')return reply({error:'Méthode non autorisée'},405);
    if(Number(req.headers.get('content-length')||0)>8192)return reply({error:'Requête trop longue'},413);
    const body=await req.json();
    if(!uuid.test(body?.playerId||''))return reply({error:'Identifiant invalide'},400);
    if(body.action==='challenge'){
      const nickname=nameOf(body.nickname),level=body.level;
      if(!nickname||!Number.isInteger(level)||level<0||level>8)return reply({error:'Défi invalide'},400);
      let {data:profile,error}=await service.from('mathador_scores').select('completed,points').eq('player_id',body.playerId).maybeSingle();
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
        player_id:body.playerId,level,cards:pick.cards,target:pick.target,witness:pick.witness
      }).select('id').single();
      if(insertError)throw insertError;
      return reply({id:data.id,cards:pick.cards,target:pick.target,witness:pick.witness,
        level,completed:profile.completed,points:profile.points});
    }
    if(body.action==='finish'){
      if(!uuid.test(body.challengeId||''))return reply({error:'Défi invalide'},400);
      const {data:challenge,error}=await service.from('mathador_challenges').select('*').eq('id',body.challengeId)
        .eq('player_id',body.playerId).maybeSingle();
      if(error)throw error;
      if(!challenge||challenge.consumed_at||Date.parse(challenge.expires_at)<Date.now())return reply({error:'Tirage expiré ou déjà joué'},400);
      const score=checkAnswer(challenge.cards,challenge.target,challenge.level,body.moves,body.hintUsed===true);
      if(score===null)return reply({error:'Calcul non valide'},400);
      const {data:used,error:useError}=await service.from('mathador_challenges').update({consumed_at:new Date().toISOString()})
        .eq('id',challenge.id).is('consumed_at',null).gt('expires_at',new Date().toISOString()).select('id');
      if(useError)throw useError;
      if(!used?.length)return reply({error:'Tirage déjà enregistré'},409);
      const {data:profile,error:profileError}=await service.from('mathador_scores').select('completed,points').eq('player_id',body.playerId).single();
      if(profileError)throw profileError;
      const points=[...profile.points];points[challenge.level]=Math.max(points[challenge.level],score);
      const completed=Math.max(profile.completed,challenge.level+1);
      const updated=await service.from('mathador_scores').update({points,completed,updated_at:new Date().toISOString()})
        .eq('player_id',body.playerId).select('completed,points').single();
      if(updated.error)throw updated.error;
      return reply({score,completed:updated.data.completed,points:updated.data.points});
    }
    return reply({error:'Action inconnue'},400);
  }catch(error){console.error(error);return reply({error:'Service temporairement indisponible'},500);}
});
