const CACHE='zoumai-pwa-v1';
const scope=new URL(self.registration.scope);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.add(new URL('offline.html',scope))));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zoumai-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;if(r.mode==='navigate'){event.respondWith(fetch(r).catch(()=>caches.match(new URL('offline.html',scope))));}});
