// TALLY: count numbers up when their row scrolls into view. Runs on every load, reload and back/forward return.
(function(){
  var SEL='.hero-facts .hf-n, .glance .g-v';
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function parse(t){ var m=t.match(/^([^\d]*)([\d,]+)(.*)$/); if(!m) return null; if(/[A-Za-z]/.test(m[1])||/^\./.test(m[3])||m[3].length>3) return null; return {pre:m[1], target:+m[2].replace(/,/g,''), suf:m[3], comma:m[2].indexOf(',')>-1}; }
  function fmt(n,c){ return c ? n.toLocaleString('en-AU') : String(n); }
  function count(el){
    var p=el._tally; if(!p) return;
    if(reduce){ el.textContent=el.dataset.final; return; }
    el.textContent=p.pre+'0'+p.suf;
    var t0=null, dur=1400+Math.min(p.target,100)*6;
    function step(ts){ if(t0===null) t0=ts; var x=Math.min((ts-t0)/dur,1), e=1-Math.pow(1-x,3);
      el.textContent=p.pre+fmt(Math.round(p.target*e),p.comma)+p.suf; if(x<1) requestAnimationFrame(step); else el.textContent=el.dataset.final; }
    requestAnimationFrame(step);
  }
  function arm(){
    var els=document.querySelectorAll(SEL); if(!els.length) return;
    var groups={};
    els.forEach(function(el){
      if(!el.dataset.final) el.dataset.final=el.textContent.trim();
      el._tally=parse(el.dataset.final); if(!el._tally) return;
      el.textContent=el._tally.pre+'0'+el._tally.suf;
      var g=el.closest('.hero-facts, .glance')||el; (groups[g]||(groups[g]=[])).push(el); g._els=(g._els||[]).concat([el]);
    });
    var roots=[]; els.forEach(function(el){ var g=el.closest('.hero-facts, .glance')||el; if(roots.indexOf(g)<0) roots.push(g); });
    function fire(g){ if(g._fired) return; g._fired=true; (g._els||[]).forEach(count); }
    if(!('IntersectionObserver' in window)){ roots.forEach(fire); return; }
    var io=new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ io.unobserve(en.target); fire(en.target); } }); },{threshold:.35});
    roots.forEach(function(g){ g._fired=false; io.observe(g); });
  }
  window.addEventListener('pageshow',function(){ setTimeout(arm,200); });
  if(document.readyState==='complete') setTimeout(arm,200);
})();
