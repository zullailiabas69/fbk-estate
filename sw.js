const CACHE="fbk-estate-v58";
const CORE=["./","./index.html","./base.html","./v55.html","./v56.html","./manifest.webmanifest","./icon.svg","./index%20(2).html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin!==location.origin){return}
  e.respondWith((async()=>{
    try{
      const fresh=await fetch(r);
      if(fresh&&fresh.ok){const c=await caches.open(CACHE);c.put(r,fresh.clone())}
      return fresh;
    }catch(err){
      const cached=await caches.match(r,{ignoreSearch:true});
      if(cached)return cached;
      if(r.mode==="navigate"){const home=await caches.match("./index.html");if(home)return home}
      throw err;
    }
  })());
});