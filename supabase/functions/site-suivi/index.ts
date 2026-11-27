import { createClient } from 'npm:@supabase/supabase-js@2.96.0';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const headers = {
  'Access-Control-Allow-Origin': 'https://zoumai.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};
const reply = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers });
const CLASS_ACCOUNT = 'CM2.Craoux';
const TEST_PROFILE = 'Élève test';
const rewards = [
  { activity: 'M6 Lecture', path: '/m6-fractions-decimales.html', subject: 'Mathématiques', label: 'Lire une fraction décimale', min: 5, max: 5 },
  { activity: 'M6 Décomposition', path: '/m6-fractions-decimales.html', subject: 'Mathématiques', label: 'Décomposer une fraction décimale', min: 5, max: 5 },
  { activity: 'M6 Équivalences', path: '/m6-fractions-decimales.html', subject: 'Mathématiques', label: 'Reconnaître des fractions équivalentes', min: 5, max: 5 },
  { activity: 'M6 Demi-droite', path: '/m6-fractions-decimales.html', subject: 'Mathématiques', label: 'Lire une demi-droite graduée', min: 5, max: 5 },
  { activity: 'Transpo Imparfait', path: '/transpo-chrono.html', subject: 'Français', label: 'Transposer un texte à l’imparfait', min: 1, max: 1 }
];
const normalize = (value: unknown) => typeof value === 'string' ? value.replace(/[-\s]/g, '').toLowerCase() : '';
const bytes = (size: number) => crypto.getRandomValues(new Uint8Array(size));
const hex = (value: Uint8Array) => [...value].map(b => b.toString(16).padStart(2, '0')).join('');
const unhex = (value: string) => Uint8Array.from(value.match(/../g)!.map(x => parseInt(x, 16)));
async function hash(value: string) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))));
}
async function pinHash(pin: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return hex(new Uint8Array(await crypto.subtle.deriveBits({
    name: 'PBKDF2', hash: 'SHA-256', salt: unhex(salt), iterations: 180000
  }, key, 256)));
}
async function encryptionKey() {
  const material = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!), 'HKDF', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey({
    name: 'HKDF', hash: 'SHA-256',
    salt: new TextEncoder().encode('zoumai-pin-v1'),
    info: new TextEncoder().encode('teacher-only-pin-recovery')
  }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function encrypt(pin: string) {
  const nonce = bytes(12);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce }, await encryptionKey(), new TextEncoder().encode(pin)
  ));
  return { pin_cipher: hex(encrypted), pin_nonce: hex(nonce) };
}
async function decrypt(cipher: string, nonce: string) {
  return new TextDecoder().decode(await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unhex(nonce) }, await encryptionKey(), unhex(cipher)
  ));
}
async function studentSession(token: unknown, table = 'site_sessions') {
  const value = normalize(token);
  if (!/^[0-9a-f]{64}$/.test(value)) return null;
  const { data, error } = await db.from(table)
    .select('account_id,expires_at,tables_accounts!inner(id,nickname,role,active,avatar)')
    .eq('token_hash', await hash(value)).gt('expires_at', new Date().toISOString()).maybeSingle();
  if (error || !data) return null;
  const account: any = data.tables_accounts;
  return account?.active && account.role === 'student' ? account : null;
}
async function teacher(code: unknown) {
  const value = normalize(code);
  if (!/^[0-9a-f]{48}$/.test(value)) return null;
  const { data } = await db.from('tables_accounts').select('id,active,role')
    .eq('code_hash', await hash(value)).maybeSingle();
  return data?.active && data.role === 'teacher' ? data : null;
}
function safePath(value: unknown) {
  if (typeof value !== 'string') return null;
  const path = value.split('?')[0];
  return /^\/[a-zA-Z0-9_./%-]{1,179}$/.test(path) && !path.includes('..') ? path : null;
}
async function validClassAccess(account: unknown, code: unknown) {
  if (typeof account !== 'string' || typeof code !== 'string' || code.length > 80) return false;
  const name = account.trim().toLowerCase();
  if (name !== 'cm2.craoux' && name !== 'cm2 craoux') return false;
  const { data, error } = await db.from('site_class_access').select('code_hash,custom_code_hash').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) return false;
  if (name === 'cm2 craoux') {
    const legacyCode = normalize(code);
    return /^[0-9a-f]{16}$/.test(legacyCode) && data.code_hash === await hash(legacyCode);
  }
  if (!data.custom_code_hash) return false;
  const [salt, expected] = data.custom_code_hash.split(':');
  return expected === await pinHash(code.trim(), salt);
}
function validNickname(value: unknown) {
  return typeof value === 'string' && /^[\p{L}\p{N}][\p{L}\p{N} _-]{0,23}$/u.test(value.trim());
}
function activityResults(events: any[]) {
  const groups = new Map<string, { activity: string; attempts: number; scored: number; possible: number; perfects: number; errors: number }>();
  for (const event of events) {
    if (event.event_type !== 'result' || !event.activity || !event.max_score) continue;
    const item = groups.get(event.activity) || { activity: event.activity, attempts: 0, scored: 0, possible: 0, perfects: 0, errors: 0 };
    item.attempts++; item.scored += event.score || 0; item.possible += event.max_score; if (event.perfect) item.perfects++; item.errors += event.errors || 0;
    groups.set(event.activity, item);
  }
  return [...groups.values()].map(item => ({ ...item, successRate: Math.round(item.scored / item.possible * 100) }))
    .sort((a, b) => a.successRate - b.successRate || b.attempts - a.attempts);
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply({ error: 'Méthode indisponible.' }, 405);
  let body: any;
  try { body = await req.json(); } catch { return reply({ error: 'Requête invalide.' }, 400); }
  try {
    if (body.action === 'classCode') {
      if (!await teacher(body.teacherCode)) return reply({ error: 'Accès refusé.' }, 403);
      const { data: current, error: readError } = await db.from('site_class_access')
        .select('code_cipher,code_nonce,custom_code_hash').eq('id', 1).maybeSingle();
      if (readError) throw readError;
      if (current && body.rotate !== true)
        return reply({ account: CLASS_ACCOUNT, code: await decrypt(current.code_cipher, current.code_nonce), custom: Boolean(current.custom_code_hash) });
      const code = hex(bytes(8));
      const secret = await encrypt(code);
      const { error } = await db.from('site_class_access').upsert({
        id: 1, code_hash: await hash(code), code_cipher: secret.pin_cipher,
        code_nonce: secret.pin_nonce, updated_at: new Date().toISOString()
      });
      if (error) throw error;
      return reply({ account: CLASS_ACCOUNT, code });
    }
    if (body.action === 'roster') {
      if (!await validClassAccess(body.classAccount, body.classCode)) return reply({ error: 'Compte ou mot de passe de classe incorrect.' }, 403);
      const { data, error } = await db.from('tables_accounts').select('nickname,pin_hash')
        .eq('role', 'student').eq('active', true).order('nickname');
      if (error) throw error;
      return reply({ students: (data || []).map(p => ({ name: p.nickname, pinSet: Boolean(p.pin_hash) })) });
    }
    if (body.action === 'issueActivation' || body.action === 'resetTestProgress') {
      if (!await teacher(body.teacherCode)) return reply({ error: 'Accès refusé.' }, 403);
      if (typeof body.studentId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.studentId))
        return reply({ error: 'Élève invalide.' }, 400);
      if (body.action === 'resetTestProgress') {
        const { data, error } = await db.rpc('reset_zoumai_test_progress', { pupil_id: body.studentId });
        if (error) throw error;
        return data ? reply({ saved: true }) : reply({ error: 'Profil test introuvable.' }, 404);
      }
      const activationCode = hex(bytes(6));
      const { data, error } = await db.from('tables_accounts')
        .update({ activation_hash: await hash(activationCode) })
        .eq('id', body.studentId).eq('role', 'student').eq('active', true).is('pin_hash', null)
        .select('id').maybeSingle();
      if (error) throw error;
      return data ? reply({ activationCode }) : reply({ error: 'Ce compte a déjà un PIN ou est inactif.' }, 409);
    }
    if (body.action === 'activate') {
      if (!await validClassAccess(body.classAccount, body.classCode)) return reply({ error: 'Compte ou mot de passe de classe incorrect.' }, 403);
      if (!validNickname(body.nickname) || !/^\d{4}$/.test(body.pin)) return reply({ error: 'Prénom ou code invalide.' }, 400);
      const { data: account } = await db.from('tables_accounts')
        .select('id,nickname,pin_hash,activation_hash,active').eq('role', 'student').eq('nickname', body.nickname.trim()).maybeSingle();
      if (!account?.active || account.pin_hash) return reply({ error: 'Code personnel déjà créé ou prénom inconnu.' }, 403);
      const activationCode = normalize(body.activationCode);
      if (!account.activation_hash || !/^[0-9a-f]{12}$/.test(activationCode) ||
          account.activation_hash !== await hash(activationCode))
        return reply({ error: 'Code d’activation incorrect. Demande ton code à ton enseignant.' }, 403);
      const salt = hex(bytes(16));
      const { data: updated, error } = await db.from('tables_accounts')
        .update({ pin_hash: await pinHash(body.pin, salt), pin_salt: salt, pin_approved: true, activation_hash: null })
        .eq('id', account.id).eq('activation_hash', account.activation_hash).is('pin_hash', null)
        .select('id').maybeSingle();
      if (error || !updated) return reply({ error: 'Activation impossible.' }, 409);
      return reply({ activated: true, pending: false, nickname: account.nickname });
    }
    if (body.action === 'pinLogin' || body.action === 'arcadeGuestLogin') {
      if (!await validClassAccess(body.classAccount, body.classCode)) return reply({ error: 'Compte ou mot de passe de classe incorrect.' }, 403);
      const nickname = typeof body.nickname === 'string' ? body.nickname.trim() : '';
      if (!/^[\p{L}\p{N}][\p{L}\p{N} _-]{0,23}$/u.test(nickname) || !/^\d{4}$/.test(body.pin))
        return reply({ error: 'Pseudo ou code invalide.' }, 401);
      const { data: account } = await db.from('tables_accounts')
        .select('id,nickname,active,role,pin_hash,pin_salt,pin_approved')
        .eq('role', 'student').eq('nickname', nickname).maybeSingle();
      if (!account?.active || !account.pin_hash) return reply({ error: 'Pseudo ou code invalide.' }, 401);
      if (!account.pin_approved) return reply({ error: 'Ton enseignant doit valider ta première connexion.' }, 403);
      const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count } = await db.from('site_pin_failures').select('id', { count: 'exact', head: true })
        .eq('account_id', account.id).gte('attempted_at', since);
      if ((count || 0) >= 5) return reply({ error: 'Trop d’essais. Réessaie dans 15 minutes.' }, 429);
      const expected = await pinHash(body.pin, account.pin_salt);
      if (expected !== account.pin_hash) {
        await db.from('site_pin_failures').insert({ account_id: account.id });
        return reply({ error: 'Pseudo ou code invalide.' }, 401);
      }
      await db.from('site_pin_failures').delete().eq('account_id', account.id);
      const token = hex(bytes(32));
      const isArcade = body.action === 'arcadeGuestLogin';
      const table = isArcade ? 'site_arcade_sessions' : 'site_sessions';
      const expires = new Date(Date.now() + (isArcade ? 1 : 12) * 60 * 60 * 1000).toISOString();
      if (isArcade) await db.from(table).delete().eq('account_id', account.id).lte('expires_at', new Date().toISOString());
      const { error } = await db.from(table).insert({
        token_hash: await hash(token), account_id: account.id, expires_at: expires
      });
      if (error) throw error;
      return reply({ token, nickname: account.nickname, expires, ...(isArcade ? { id: account.id } : {}) });
    }
    if (body.action === 'revealPin') {
      if (!await teacher(body.teacherCode)) return reply({ error: 'Accès refusé.' }, 403);
      if (typeof body.studentId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.studentId))
        return reply({ error: 'Élève invalide.' }, 400);
      const { data } = await db.from('tables_accounts').select('pin_cipher,pin_nonce')
        .eq('id', body.studentId).eq('role', 'student').maybeSingle();
      if (!data?.pin_cipher || !data.pin_nonce) return reply({ error: 'Aucun code choisi pour le moment.' }, 404);
      return reply({ pin: await decrypt(data.pin_cipher, data.pin_nonce) });
    }
    if (body.action === 'approvePin' || body.action === 'resetPin') {
      if (!await teacher(body.teacherCode)) return reply({ error: 'Accès refusé.' }, 403);
      if (typeof body.studentId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.studentId))
        return reply({ error: 'Élève invalide.' }, 400);
      const { data: pupil } = await db.from('tables_accounts').select('id,pin_hash')
        .eq('id', body.studentId).eq('role', 'student').eq('active', true).maybeSingle();
      if (!pupil) return reply({ error: 'Élève inconnu.' }, 404);
      if (body.action === 'approvePin') {
        if (!pupil.pin_hash) return reply({ error: 'Aucun PIN choisi.' }, 409);
        const { error } = await db.from('tables_accounts').update({ pin_approved: true }).eq('id', pupil.id);
        if (error) throw error;
      } else {
        const { error } = await db.from('tables_accounts').update({
          pin_hash: null, pin_salt: null, pin_cipher: null, pin_nonce: null, pin_approved: false, activation_hash: null
        }).eq('id', pupil.id);
        if (error) throw error;
        await db.from('site_sessions').delete().eq('account_id', pupil.id);
        await db.from('site_pin_failures').delete().eq('account_id', pupil.id);
      }
      return reply({ saved: true });
    }
    if (body.action === 'studentTimeline') {
      if (!await teacher(body.teacherCode)) return reply({ error: 'Accès refusé.' }, 403);
      if (typeof body.studentId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.studentId) ||
          (body.before !== undefined && (!Number.isSafeInteger(body.before) || body.before <= 0)))
        return reply({ error: 'Élève ou page invalide.' }, 400);
      let query = db.from('site_events')
        .select('id,page_path,event_type,activity,score,max_score,occurred_at')
        .eq('account_id', body.studentId).order('id', { ascending: false }).limit(51);
      if (body.before !== undefined) query = query.lt('id', body.before);
      const { data, error } = await query;
      if (error) throw error;
      const events = (data || []).slice(0, 50);
      return reply({ events, next: (data || []).length > 50 ? events[49].id : null });
    }
    if (body.action === 'siteClass') {
      if (!await teacher(body.teacherCode)) return reply({ error: 'Accès refusé.' }, 403);
      const { data: accounts, error } = await db.from('tables_accounts')
        .select('id,nickname,active,pin_hash,pin_approved,pin_cipher').eq('role', 'student').order('nickname');
      if (error) throw error;
      const students = await Promise.all((accounts || []).map(async pupil => {
        const { data: events, error: eventError } = await db.from('site_events')
          .select('page_path,event_type,activity,correct,score,max_score,errors,duration_ms,perfect,completed,occurred_at')
          .eq('account_id', pupil.id).order('occurred_at', { ascending: false }).limit(800);
        if (eventError) throw eventError;
        const list = events || [];
        return {
          id: pupil.id, nickname: pupil.nickname, active: pupil.active, pinSet: Boolean(pupil.pin_hash), pinApproved: pupil.pin_approved, canRevealPin: Boolean(pupil.pin_cipher), isTest: pupil.nickname === TEST_PROFILE,
          visits: list.filter(e => e.event_type === 'visit').length,
          results: list.filter(e => e.event_type === 'result').length,
          byActivity: activityResults(list),
          lastActive: list[0]?.occurred_at || null,
          activities: [...new Set(list.map(e => e.activity || e.page_path))].slice(0, 12),
          recent: list.slice(0, 15)
        };
      }));
      return reply({ students });
    }
    const account = await studentSession(body.session) || (body.action === 'arcadeBattleRecord' ? await studentSession(body.session, 'site_arcade_sessions') : null);
    if (!account) return reply({ error: 'Session expirée. Reconnecte-toi.' }, 401);
    if (body.action === 'me') return reply({ nickname: account.nickname, id: account.id });
    if (body.action === 'updateAvatar') {
      if (body.avatar !== 'zoum' && body.avatar !== 'mai')
        return reply({ error: 'Choisis Zoum ou Maï.' }, 400);
      const { data, error } = await db.from('tables_accounts')
        .update({ avatar: body.avatar }).eq('id', account.id).eq('role', 'student')
        .eq('active', true).select('avatar').maybeSingle();
      if (error) throw error;
      return data ? reply(data) : reply({ error: 'Session expirée. Reconnecte-toi.' }, 401);
    }
    if (body.action === 'arcadeSummary') {
      const { data, error } = await db.rpc('site_arcade_summary', { pupil: account.id });
      if (error) throw error;
      return reply(data);
    }
    if (body.action === 'arcadeBattleRecord') {
      const { match, mode, exercise, seconds, correct, errors } = body;
      const maxAnswers = 500;
      const tableSet = (value: unknown) => {
        if (!Array.isArray(value) || !value.length || value.length > 11 ||
            value.some(n => !Number.isInteger(n) || n < 2 || n > 12)) return null;
        return [...new Set<number>(value)].sort((a, b) => a - b);
      };
      const own = tableSet(body.tables);
      const other = tableSet(body.opponentTables);
      if (typeof match !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(match) ||
          !['flash','race','survival','champion'].includes(mode) || !['classic','missing'].includes(exercise) ||
          ![60,90,120].includes(seconds) || !own || !other ||
          !Number.isInteger(correct) || !Number.isInteger(errors) ||
          correct < 0 || errors < 0 || correct + errors < 1 || correct + errors > maxAnswers)
        return reply({ error: 'Bilan du duel invalide.' }, 400);
      const mistakes = Array.isArray(body.mistakes)
        ? body.mistakes.slice(0, 6).filter((fact: unknown) =>
          typeof fact === 'string' && /^(?:\d{1,2}|\?) × (?:\d{1,2}|\?) = (?:\d{1,3}|\?)$/.test(fact))
        : [];
      const shared = mode === 'flash' || mode === 'champion';
      const comparedTables = shared ? [own.join(','), other.join(',')].sort() : [own.join(','), other.join(',')];
      const { data, error } = await db.rpc('site_arcade_record', {
        pupil: account.id, match, game_name: 'tables-battle-duo',
        rules: [mode, exercise, seconds, ...comparedTables].join(':'),
        details: { mode, exercise, seconds, tables: own, opponentTables: other, correct, errors, mistakes },
        rating: Math.round(10 * correct / Math.max(5, correct + errors))
      });
      if (error) throw error;
      return reply({ points: data });
    }
    if (body.action === 'lessonJournal') {
      if (!Array.isArray(body.paths) || body.paths.length > 100)
        return reply({ error: 'Liste de leçons invalide.' }, 400);
      const requestedPaths = body.paths as unknown[];
      const paths = [...new Set(requestedPaths.map(safePath).filter(path => path !== null))];
      if (!paths.length) return reply({ lessons: [] });
      const lessons = new Map<string, { path: string; viewedAt: string }>();
      const batchSize = 500;
      for (let offset = 0; ; offset += batchSize) {
        const { data, error } = await db.from('site_events')
          .select('page_path,activity,occurred_at').eq('account_id', account.id)
          .eq('event_type', 'visit').in('page_path', paths)
          .order('occurred_at', { ascending: false }).order('id', { ascending: false })
          .range(offset, offset + batchSize - 1);
        if (error) throw error;
        for (const visit of data) {
          let path = visit.page_path;
          if (path === '/jeu-maths-cm2.html') {
            const level = /^Leçon M([7-9]|[12][0-9]|3[0-5])$/.exec(visit.activity || '');
            if (!level) continue;
            path += '?m=' + level[1];
          }
          if (!lessons.has(path)) lessons.set(path, { path, viewedAt: visit.occurred_at });
        }
        if (data.length < batchSize || lessons.size >= paths.length + (paths.includes('/jeu-maths-cm2.html') ? 28 : 0)) break;
      }
      return reply({ lessons: [...lessons.values()] });
    }
    if (body.action === 'summary') {
      const { data, error } = await db.from('site_events')
        .select('page_path,event_type,activity,correct,score,max_score,errors,duration_ms,perfect,completed,occurred_at')
        .eq('account_id', account.id).order('occurred_at', { ascending: false }).limit(800);
      if (error) throw error;
      const { data: attempts, error: attemptsError } = await db.from('tables_attempts')
        .select('a,b,correct,played_at').eq('account_id', account.id)
        .order('played_at', { ascending: false }).limit(1500);
      if (attemptsError) throw attemptsError;
      const rows = attempts || [];
      const correct = rows.filter(row => row.correct).length;
      const weak = new Map<string, { attempts: number; correct: number }>();
      const tables = new Map<number, { table: number; attempts: number; correct: number }>();
      for (const row of rows) {
        const fact = `${row.a} × ${row.b}`;
        const item = weak.get(fact) || { attempts: 0, correct: 0 };
        if (item.attempts < 3) { item.attempts++; if (row.correct) item.correct++; }
        weak.set(fact, item);
        const table = tables.get(row.a) || { table: row.a, attempts: 0, correct: 0 };
        table.attempts++; if (row.correct) table.correct++;
        tables.set(row.a, table);
      }
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const { data: earned, error: rewardError } = await db.from('site_rewards')
        .select('activity').eq('account_id', account.id);
      if (rewardError) throw rewardError;
      const earnedIds = new Set((earned || []).map(item => item.activity));
      return reply({
        rewards: rewards.map(({ activity, path, subject, label, min, max }) => ({
          path, subject, label, min, max, earned: earnedIds.has(activity)
        })),
        nickname: account.nickname, avatar: account.avatar, attempts: rows.length, correct,
        successRate: rows.length ? Math.round(correct / rows.length * 100) : null,
        last7days: rows.filter(row => Date.parse(row.played_at) >= weekAgo).length,
        byTable: [...tables.values()].sort((a,b) => a.table - b.table)
          .map(table => ({ ...table, successRate: Math.round(table.correct / table.attempts * 100) })),
        byActivity: activityResults(data || []),
        weak: [...weak].filter(([,item]) => item.correct < Math.min(2,item.attempts))
          .slice(0,8).map(([fact,item]) => ({ fact, ...item })),
        recent: (data || []).slice(0,15)
      });
    }
    if (body.action === 'tableRecord') {
      const a = body.a, b = body.b, response = body.response;
      if (!Number.isInteger(a) || a < 2 || a > 11 || !Number.isInteger(b) || b < 1 || b > 10 ||
          (response !== null && (!Number.isInteger(response) || response < 0 || response > 110)) ||
          !['learn','train','perfect','champion'].includes(body.mode))
        return reply({ error: 'Résultat invalide.' }, 400);
      const { error } = await db.from('tables_attempts').insert({
        account_id: account.id, a, b, response, correct: response === a * b,
        mode: body.mode, elapsed_ms: Math.max(0, Math.min(120000, Math.round(Number(body.elapsedMs) || 0)))
      });
      if (error) throw error;
      return reply({ saved: true });
    }
    if (body.action === 'record') {
      const path = safePath(body.path);
      if (!path || !['visit','result'].includes(body.type)) return reply({ error: 'Activité invalide.' }, 400);
      const activity = typeof body.activity === 'string' && /^[\p{L}\p{N} _-]{1,80}$/u.test(body.activity) ? body.activity : null;
      const score = Number.isInteger(body.score) && body.score >= 0 && body.score <= 100 ? body.score : null;
      const errors = Number.isInteger(body.errors) && body.errors >= 0 && body.errors <= 100 ? body.errors : null;
      const duration = Number.isInteger(body.durationMs) ? Math.max(0, Math.min(7200000, body.durationMs)) : null;
      const max = Number.isInteger(body.maxScore) && body.maxScore >= 1 && body.maxScore <= 100 ? body.maxScore : null;
      if (body.type === 'result' && (score === null || max === null || score > max))
        return reply({ error: 'Résultat invalide.' }, 400);
      const reward = body.type === 'result' && rewards.find(item =>
        item.path === path && item.activity === activity && max === item.max && score !== null && score >= item.min);
      if (reward) {
        const { error } = await db.from('site_rewards').upsert(
          { account_id: account.id, activity: reward.activity },
          { onConflict: 'account_id,activity', ignoreDuplicates: true }
        );
        if (error) throw error;
      }
      const { error } = await db.from('site_events').insert({
        account_id: account.id, page_path: path, event_type: body.type, activity,
        score: body.type === 'result' ? score : null, max_score: body.type === 'result' ? max : null,
        correct: body.type === 'result' ? score === max : null, errors: body.type === 'result' ? errors : null, duration_ms: body.type === 'result' ? duration : null, perfect: body.type === 'result' ? (errors === 0 && score === max) : null, completed: body.type === 'result' ? true : null
      });
      if (error) throw error;
      return reply({ saved: true });
    }
    return reply({ error: 'Action inconnue.' }, 400);
  } catch (error) {
    console.error('site-suivi', error);
    return reply({ error: 'Service temporairement indisponible.' }, 503);
  }
});
