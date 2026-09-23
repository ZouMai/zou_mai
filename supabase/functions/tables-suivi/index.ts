import { createClient } from 'npm:@supabase/supabase-js@2.96.0';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const cors = {
  'Access-Control-Allow-Origin': 'https://zoumai.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: cors });
const cleanCode = (v: unknown) => typeof v === 'string' ? v.replace(/[-\s]/g, '').toLowerCase() : '';
async function hash(code: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function summary(rows: any[]) {
  const weak = new Map<string, { attempts: number; correct: number }>();
  let correct = 0;
  for (const row of rows) {
    if (row.correct) correct++;
    const k = `${row.a} × ${row.b}`;
    const item = weak.get(k) || { attempts: 0, correct: 0 };
    if (item.attempts < 3) {
      item.attempts++;
      if (row.correct) item.correct++;
    }
    weak.set(k, item);
  }
  return {
    attempts: rows.length, correct,
    lastPlayed: rows[0]?.played_at || null,
    weak: [...weak].filter(([,s]) => s.correct < Math.min(2,s.attempts))
      .sort((a,b) => (b[1].attempts-b[1].correct)-(a[1].attempts-a[1].correct))
      .slice(0, 8).map(([fact,s]) => ({ fact, ...s }))
  };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return reply({ error: 'Méthode indisponible.' }, 405);
  let body: any;
  try { body = await req.json(); } catch { return reply({ error: 'Requête invalide.' }, 400); }
  const code = cleanCode(body.code);
  if (!/^(?:[0-9a-f]{20}|[0-9a-f]{48})$/.test(code)) return reply({ error: 'Code invalide.' }, 401);
  const { data: account, error: authError } = await db.from('tables_accounts')
    .select('id,nickname,role,active').eq('code_hash', await hash(code)).maybeSingle();
  if (authError) return reply({ error: 'Service indisponible.' }, 503);
  if (!account?.active) return reply({ error: 'Code inconnu ou désactivé.' }, 401);
  const action = body.action;
  try {
    if (action === 'me') return reply({ id: account.id, role: account.role, nickname: account.nickname });
    if (account.role === 'student') {
      if (action === 'record') {
        const a = body.a, b = body.b, response = body.response;
        if (!Number.isInteger(a) || a < 2 || a > 11 || !Number.isInteger(b) || b < 1 || b > 10 ||
            (response !== null && (!Number.isInteger(response) || response < 0 || response > 110)) ||
            !['learn','train','perfect','champion'].includes(body.mode)) return reply({ error: 'Résultat invalide.' }, 400);
        const elapsed_ms = Math.max(0, Math.min(120000, Number(body.elapsedMs) || 0));
        const { error } = await db.from('tables_attempts').insert({
          account_id: account.id, a, b, response, correct: response === a*b,
          mode: body.mode, elapsed_ms: Math.round(elapsed_ms)
        });
        if (error) throw error;
        return reply({ saved: true });
      }
      if (action === 'summary') {
        const { data, error } = await db.from('tables_attempts').select('a,b,correct,played_at')
          .eq('account_id', account.id).order('played_at', { ascending: false }).limit(1500);
        if (error) throw error;
        return reply({ nickname: account.nickname, ...summary(data || []) });
      }
      return reply({ error: 'Accès refusé.' }, 403);
    }
    if (action === 'create') {
      const nickname = typeof body.nickname === 'string' ? body.nickname.trim().replace(/\s+/g,' ') : '';
      if (!/^[\p{L}\p{N}][\p{L}\p{N} _-]{0,23}$/u.test(nickname)) return reply({ error: 'Pseudo invalide (24 caractères maximum).' }, 400);
      const { count, error: countError } = await db.from('tables_accounts').select('id', { count: 'exact', head: true }).eq('role','student').eq('active',true);
      if (countError) throw countError;
      if ((count || 0) >= 40) return reply({ error: 'Limite de comptes atteinte.' }, 400);
      const raw = [...crypto.getRandomValues(new Uint8Array(10))].map(x=>x.toString(16).padStart(2,'0')).join('');
      const { error } = await db.from('tables_accounts').insert({ code_hash: await hash(raw), role: 'student', nickname });
      if (error) throw error;
      return reply({ nickname, code: raw.toUpperCase().match(/.{1,4}/g)?.join('-') });
    }
    if (action === 'revoke') {
      if (typeof body.studentId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.studentId)) return reply({ error: 'Compte invalide.' }, 400);
      const { error } = await db.from('tables_accounts').update({ active: false })
        .eq('id', body.studentId).eq('role', 'student');
      if (error) throw error;
      return reply({ revoked: true });
    }
    if (action === 'class') {
      const { data: pupils, error } = await db.from('tables_accounts').select('id,nickname,active,created_at')
        .eq('role','student').order('nickname');
      if (error) throw error;
      const students = await Promise.all((pupils || []).map(async (p: any) => {
        const { data, error: attemptsError } = await db.from('tables_attempts').select('a,b,correct,played_at')
          .eq('account_id', p.id).order('played_at', { ascending: false }).limit(1500);
        if (attemptsError) throw attemptsError;
        return { ...p, ...summary(data || []) };
      }));
      return reply({ students });
    }
    return reply({ error: 'Action inconnue.' }, 400);
  } catch (error) {
    console.error('tables-suivi', error);
    return reply({ error: 'Enregistrement momentanément indisponible.' }, 503);
  }
});
